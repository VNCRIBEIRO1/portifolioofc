"use client";

/**
 * CrystalShatter.tsx
 *
 * Shatter MESH-BASED: a propria malha do cristal (com sua textura/cor de
 * vertice + PBR) e quebrada em triangulos individuais que se afastam do
 * centro, giram em torno do proprio centroide e voltam para reformar
 * a pedra original — preservando a textura e a fisica.
 *
 * Tecnica:
 *  1. Para cada Mesh dentro do scene GLTF, clonamos a geometria e
 *     convertemos para non-indexed (toNonIndexed) — assim cada
 *     triangulo tem seus 3 vertices proprios, nao compartilhados.
 *  2. Calculamos o centroide de cada triangulo e gravamos como atributo
 *     `aCentroid` (replicado nos 3 vertices). Tambem gravamos:
 *       - aDir: direcao radial unitaria do centro do mesh ate o centroide
 *       - aAxis: eixo aleatorio para spin
 *  3. Clonamos o material original (MeshStandardMaterial) e injetamos via
 *     onBeforeCompile o seguinte no vertex shader:
 *       transformed = position - aCentroid;        // bring to local centroid space
 *       transformed = rotate(aAxis, t * progress); // spin in place
 *       transformed += aCentroid;                  // back to mesh space
 *       transformed += aDir * progress * factor;   // explode outward
 *  4. Uniform `uProgress` (0..1) controla a quantidade de quebra. Em 0
 *     a malha aparece IDENTICA a original (textura, normais, PBR).
 *
 * Nenhuma geometria procedural — apenas a propria pedra.
 */

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  /** Scene GLTF do cristal (resultado de useGLTF().scene.clone()). */
  scene: THREE.Object3D;
  /** Escala aplicada ao group (mesma usada na primitive original). */
  scale: number;
  /** Funcao chamada a cada frame: retorna progress 0..1. */
  getProgress: () => number;
};

type ShatterMeshData = {
  mesh: THREE.Mesh;
  shaderRef: { current: THREE.Shader | null };
};

function buildShatterMesh(src: THREE.Mesh): ShatterMeshData {
  // 1. Clona a geometria e converte para non-indexed
  let geo = src.geometry.clone();
  if (geo.index) geo = geo.toNonIndexed();

  const posAttr = geo.attributes.position as THREE.BufferAttribute;
  const positions = posAttr.array as Float32Array;
  const vCount = posAttr.count;
  const triCount = vCount / 3;

  // Bbox centro p/ direcao radial coerente
  geo.computeBoundingSphere();
  const cx0 = geo.boundingSphere?.center.x ?? 0;
  const cy0 = geo.boundingSphere?.center.y ?? 0;
  const cz0 = geo.boundingSphere?.center.z ?? 0;

  const aCentroid = new Float32Array(vCount * 3);
  const aDir = new Float32Array(vCount * 3);
  const aAxis = new Float32Array(vCount * 3);
  const aSeed = new Float32Array(vCount); // 1 float por vertice (replicado)

  for (let i = 0; i < triCount; i++) {
    const i0 = i * 9;
    const cx = (positions[i0 + 0] + positions[i0 + 3] + positions[i0 + 6]) / 3;
    const cy = (positions[i0 + 1] + positions[i0 + 4] + positions[i0 + 7]) / 3;
    const cz = (positions[i0 + 2] + positions[i0 + 5] + positions[i0 + 8]) / 3;

    let dx = cx - cx0, dy = cy - cy0, dz = cz - cz0;
    const dlen = Math.hypot(dx, dy, dz) || 1;
    dx /= dlen; dy /= dlen; dz /= dlen;

    // eixo aleatorio coerente por triangulo
    let ax = Math.random() - 0.5;
    let ay = Math.random() - 0.5;
    let az = Math.random() - 0.5;
    const al = Math.hypot(ax, ay, az) || 1;
    ax /= al; ay /= al; az /= al;

    const seed = Math.random();

    for (let v = 0; v < 3; v++) {
      const o = (i * 3 + v) * 3;
      aCentroid[o + 0] = cx; aCentroid[o + 1] = cy; aCentroid[o + 2] = cz;
      aDir[o + 0] = dx;       aDir[o + 1] = dy;       aDir[o + 2] = dz;
      aAxis[o + 0] = ax;      aAxis[o + 1] = ay;      aAxis[o + 2] = az;
      aSeed[i * 3 + v] = seed;
    }
  }

  geo.setAttribute("aCentroid", new THREE.BufferAttribute(aCentroid, 3));
  geo.setAttribute("aDir", new THREE.BufferAttribute(aDir, 3));
  geo.setAttribute("aAxis", new THREE.BufferAttribute(aAxis, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 1));
  // Recomputa normais flat por triangulo (consistente com toNonIndexed)
  geo.computeVertexNormals();

  // 2. Clona o material e injeta o shader
  const srcMat = (Array.isArray(src.material) ? src.material[0] : src.material) as THREE.Material;
  const mat = (srcMat as any).clone() as THREE.MeshStandardMaterial;
  mat.transparent = true; // permitira fade tambem se quisermos
  const shaderRef: { current: THREE.Shader | null } = { current: null };

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uProgress = { value: 0 };
    shader.uniforms.uTime = { value: 0 };
    shaderRef.current = shader;

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        attribute vec3 aCentroid;
        attribute vec3 aDir;
        attribute vec3 aAxis;
        attribute float aSeed;
        uniform float uProgress;
        uniform float uTime;

        mat3 axisAngle(vec3 a, float ang) {
          float c = cos(ang);
          float s = sin(ang);
          float oc = 1.0 - c;
          return mat3(
            c + a.x*a.x*oc,       a.x*a.y*oc - a.z*s,   a.x*a.z*oc + a.y*s,
            a.y*a.x*oc + a.z*s,   c + a.y*a.y*oc,       a.y*a.z*oc - a.x*s,
            a.z*a.x*oc - a.y*s,   a.z*a.y*oc + a.x*s,   c + a.z*a.z*oc
          );
        }`
      )
      .replace(
        "#include <begin_vertex>",
        `vec3 transformed = position;
        if (uProgress > 0.001) {
          // 1. relativo ao centroide
          vec3 rel = transformed - aCentroid;
          // 2. spin em torno do centroide com velocidade variavel por aSeed
          float ang = uProgress * (3.0 + aSeed * 4.0) + uTime * 0.6 * uProgress;
          rel = axisAngle(aAxis, ang) * rel;
          // 3. volta ao espaco da malha
          transformed = aCentroid + rel;
          // 4. expande para fora — distancia variavel por seed
          float radF = 0.6 + aSeed * 0.8;
          transformed += aDir * uProgress * radF;
          // 5. ruido organico (oscila + leve deriva tangencial)
          float wob = sin(uTime * (1.5 + aSeed * 2.0) + aSeed * 6.28) * 0.06 * uProgress;
          transformed += aDir * wob;
        }`
      )
      .replace(
        "#include <beginnormal_vertex>",
        `vec3 objectNormal = normal;
        if (uProgress > 0.001) {
          float ang = uProgress * (3.0 + aSeed * 4.0) + uTime * 0.6 * uProgress;
          objectNormal = axisAngle(aAxis, ang) * objectNormal;
        }`
      );
  };

  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = src.castShadow;
  mesh.receiveShadow = src.receiveShadow;
  mesh.frustumCulled = false;
  return { mesh, shaderRef };
}

export function CrystalShatter({ scene, scale, getProgress }: Props) {
  const groupRef = useRef<THREE.Group>(null!);

  // Constroi UMA vez por scene change
  const data = useMemo(() => {
    const list: ShatterMeshData[] = [];
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        list.push(buildShatterMesh(obj as THREE.Mesh));
      }
    });
    return list;
  }, [scene]);

  // Injeta os meshes no group (evita recriar arvore React/Fiber)
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    data.forEach((d) => g.add(d.mesh));
    return () => {
      data.forEach((d) => g.remove(d.mesh));
    };
  }, [data]);

  useFrame((state) => {
    const p = THREE.MathUtils.clamp(getProgress(), 0, 1);
    const t = state.clock.elapsedTime;
    for (let i = 0; i < data.length; i++) {
      const sh = data[i].shaderRef.current;
      if (sh) {
        sh.uniforms.uProgress.value = p;
        sh.uniforms.uTime.value = t;
      }
    }
  });

  return <group ref={groupRef} scale={scale} />;
}
