"use client";

/**
 * CrystalShatter.tsx
 *
 * Shatter MESH-BASED por SHARDS AGRUPADOS: a malha do cristal preserva
 * textura/PBR, mas os triangulos sao agrupados em no maximo 20 blocos.
 * Cada bloco se move como uma peca coesa, evitando o efeito de milhares
 * de triangulos independentes.
 *
 * Tecnica:
 *  1. Cada mesh e convertida para non-indexed.
 *  2. Triangulos sao atribuidos a um conjunto pequeno de shards por
 *     direcao espacial (seeds esfericas deterministicas).
 *  3. Cada shard recebe centroide/pivo, direcao radial, eixo de spin e
 *     seed propria.
 *  4. No shader, todos os triangulos daquele shard se movem juntos.
 *
 * Nenhuma geometria procedural — apenas a propria pedra.
 */

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_SHARDS = 20;

type Props = {
  /** Scene GLTF do cristal (resultado de useGLTF().scene.clone()). */
  scene: THREE.Object3D;
  /** Escala aplicada ao group (mesma usada na primitive original). */
  scale: number;
  /** Funcao chamada a cada frame: retorna progress 0..1. */
  getProgress: () => number;
};

type ShatterShader = {
  uniforms: {
    uProgress: { value: number };
    uTime: { value: number };
    [key: string]: THREE.IUniform;
  };
};

type ShatterMeshData = {
  mesh: THREE.Mesh;
  shaderRef: { current: ShatterShader | null };
};

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomUnit(rand: () => number) {
  const z = rand() * 2 - 1;
  const theta = rand() * Math.PI * 2;
  const radius = Math.sqrt(Math.max(0, 1 - z * z));
  return new THREE.Vector3(
    Math.cos(theta) * radius,
    z,
    Math.sin(theta) * radius
  );
}

function allocatePieceCounts(weights: number[], budget: number) {
  if (weights.length === 0) return [];
  const counts = new Array(weights.length).fill(1);
  let remaining = Math.max(0, budget - weights.length);

  while (remaining > 0) {
    let bestIndex = 0;
    let bestScore = -Infinity;
    for (let i = 0; i < weights.length; i++) {
      const score = weights[i] / counts[i];
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
    counts[bestIndex] += 1;
    remaining -= 1;
  }

  return counts;
}

function buildShatterMesh(src: THREE.Mesh, pieceCount: number, meshIndex: number): ShatterMeshData {
  // 1. Clona a geometria e converte para non-indexed
  let geo = src.geometry.clone();
  if (geo.index) geo = geo.toNonIndexed();

  const posAttr = geo.attributes.position as THREE.BufferAttribute;
  const positions = posAttr.array as Float32Array;
  const vCount = posAttr.count;
  const triCount = vCount / 3;
  const shardCount = Math.max(1, Math.min(pieceCount, triCount));

  // Centro local da mesh para direcoes radiais coerentes.
  geo.computeBoundingSphere();
  const center = geo.boundingSphere?.center.clone() ?? new THREE.Vector3();
  const rand = mulberry32(hashString(`${src.name}:${meshIndex}:${shardCount}`));

  const shards = Array.from({ length: shardCount }, () => ({
    seedDir: randomUnit(rand),
    axis: randomUnit(rand),
    centroid: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    seed: rand(),
    count: 0,
  }));

  const triShard = new Uint16Array(triCount);

  for (let i = 0; i < triCount; i++) {
    const i0 = i * 9;
    const cx = (positions[i0 + 0] + positions[i0 + 3] + positions[i0 + 6]) / 3;
    const cy = (positions[i0 + 1] + positions[i0 + 4] + positions[i0 + 7]) / 3;
    const cz = (positions[i0 + 2] + positions[i0 + 5] + positions[i0 + 8]) / 3;

    const triCentroid = new THREE.Vector3(cx, cy, cz);
    const triDir = triCentroid.clone().sub(center);
    if (triDir.lengthSq() < 1e-6) {
      triDir.copy(shards[i % shardCount].seedDir);
    } else {
      triDir.normalize();
    }

    let bestShard = 0;
    let bestDot = -Infinity;
    for (let shardIndex = 0; shardIndex < shardCount; shardIndex++) {
      const dot = triDir.dot(shards[shardIndex].seedDir);
      if (dot > bestDot) {
        bestDot = dot;
        bestShard = shardIndex;
      }
    }

    triShard[i] = bestShard;
    shards[bestShard].centroid.add(triCentroid);
    shards[bestShard].count += 1;
  }

  for (let i = 0; i < shardCount; i++) {
    const shard = shards[i];
    if (shard.count > 0) {
      shard.centroid.divideScalar(shard.count);
    } else {
      shard.centroid.copy(center).add(shard.seedDir.clone().multiplyScalar(0.25));
    }

    shard.dir.copy(shard.centroid).sub(center);
    if (shard.dir.lengthSq() < 1e-6) {
      shard.dir.copy(shard.seedDir);
    } else {
      shard.dir.normalize();
    }
  }

  const aShardCentroid = new Float32Array(vCount * 3);
  const aShardDir = new Float32Array(vCount * 3);
  const aShardAxis = new Float32Array(vCount * 3);
  const aShardSeed = new Float32Array(vCount);

  for (let i = 0; i < triCount; i++) {
    const shard = shards[triShard[i]];
    for (let v = 0; v < 3; v++) {
      const o = (i * 3 + v) * 3;
      aShardCentroid[o + 0] = shard.centroid.x;
      aShardCentroid[o + 1] = shard.centroid.y;
      aShardCentroid[o + 2] = shard.centroid.z;
      aShardDir[o + 0] = shard.dir.x;
      aShardDir[o + 1] = shard.dir.y;
      aShardDir[o + 2] = shard.dir.z;
      aShardAxis[o + 0] = shard.axis.x;
      aShardAxis[o + 1] = shard.axis.y;
      aShardAxis[o + 2] = shard.axis.z;
      aShardSeed[i * 3 + v] = shard.seed;
    }
  }

  geo.setAttribute("aShardCentroid", new THREE.BufferAttribute(aShardCentroid, 3));
  geo.setAttribute("aShardDir", new THREE.BufferAttribute(aShardDir, 3));
  geo.setAttribute("aShardAxis", new THREE.BufferAttribute(aShardAxis, 3));
  geo.setAttribute("aShardSeed", new THREE.BufferAttribute(aShardSeed, 1));
  geo.computeVertexNormals();

  // 2. Clona o material e injeta o shader
  const srcMat = (Array.isArray(src.material) ? src.material[0] : src.material) as THREE.Material;
  const mat = (srcMat as any).clone() as THREE.MeshStandardMaterial;
  mat.transparent = true; // permitira fade tambem se quisermos
  const shaderRef: { current: ShatterShader | null } = { current: null };

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uProgress = { value: 0 };
    shader.uniforms.uTime = { value: 0 };
    shaderRef.current = shader as unknown as ShatterShader;

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        attribute vec3 aShardCentroid;
        attribute vec3 aShardDir;
        attribute vec3 aShardAxis;
        attribute float aShardSeed;
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
          float burst = smoothstep(0.0, 0.45, uProgress);
          float orbit = smoothstep(0.3, 1.0, uProgress);
          vec3 rel = transformed - aShardCentroid;
          float ang = burst * (1.2 + aShardSeed * 1.1) + uTime * (0.35 + aShardSeed * 0.55) * orbit;
          rel = axisAngle(aShardAxis, ang) * rel;
          transformed = aShardCentroid + rel;
          transformed += aShardDir * burst * (1.2 + aShardSeed * 0.9);
          vec3 tangent = normalize(cross(aShardAxis, aShardDir));
          transformed += tangent * sin(uTime * (1.1 + aShardSeed * 1.6) + aShardSeed * 6.2831) * 0.14 * orbit;
        }`
      )
      .replace(
        "#include <beginnormal_vertex>",
        `vec3 objectNormal = normal;
        if (uProgress > 0.001) {
          float burst = smoothstep(0.0, 0.45, uProgress);
          float orbit = smoothstep(0.3, 1.0, uProgress);
          float ang = burst * (1.2 + aShardSeed * 1.1) + uTime * (0.35 + aShardSeed * 0.55) * orbit;
          objectNormal = axisAngle(aShardAxis, ang) * objectNormal;
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

  // Constroi uma vez por scene change com ate MAX_SHARDS shards por cristal.
  const data = useMemo(() => {
    const sources: Array<{ mesh: THREE.Mesh; triangleCount: number }> = [];
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const posAttr = mesh.geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
        if (!posAttr) return;
        const triangleCount = mesh.geometry.index
          ? mesh.geometry.index.count / 3
          : posAttr.count / 3;
        sources.push({ mesh, triangleCount });
      }
    });

    const pieceCounts = allocatePieceCounts(
      sources.map((source) => source.triangleCount),
      MAX_SHARDS
    );

    return sources.map((source, index) => (
      buildShatterMesh(source.mesh, pieceCounts[index] ?? 1, index)
    ));
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
