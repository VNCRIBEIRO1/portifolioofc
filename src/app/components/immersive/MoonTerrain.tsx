"use client";

/**
 * MoonTerrain.tsx
 *
 * Terreno cinza lunar/rochoso ao longo de TODO o eixo z imersivo
 * (de z=+30 em frente ao Hero ate z=-300 alem da CTA).
 *
 * Tecnica:
 *   - PlaneGeometry alta-resolucao deslocado por multi-octave noise
 *     (combinacao de fbm + ridges para picos angulosos lunares).
 *   - Material MeshStandardMaterial cinza com roughness alto p/ matte
 *     rochoso, recebendo a iluminacao da Scene (directional + ambient).
 *   - Plano deitado (-X tilt PI/2) com base Y = -7.6, abaixo dos cristais
 *     (que ficam orbitando entre Y=-3.5 e Y=-1.0).
 *
 * Performance:
 *   - 1 unica geometria 96 x 480 segments (~46k verts) — calculada uma
 *     unica vez no client (useMemo), reaproveita ate o unmount.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---------- noise utilitarios ----------
function hash2(x: number, y: number): number {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
}
function smooth(t: number) {
  return t * t * (3 - 2 * t);
}
function valueNoise2D(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  const u = smooth(xf), v = smooth(yf);
  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(a, b, u),
    THREE.MathUtils.lerp(c, d, u),
    v
  );
}
function fbm(x: number, y: number, oct: number): number {
  let amp = 0.5, freq = 1, sum = 0, norm = 0;
  for (let i = 0; i < oct; i++) {
    sum += amp * valueNoise2D(x * freq, y * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2.07;
  }
  return sum / norm; // 0..1
}
function ridges(x: number, y: number, oct: number): number {
  let amp = 0.5, freq = 1, sum = 0, norm = 0;
  for (let i = 0; i < oct; i++) {
    const v = 1 - Math.abs(valueNoise2D(x * freq, y * freq) * 2 - 1);
    sum += amp * v * v;
    norm += amp;
    amp *= 0.5;
    freq *= 2.13;
  }
  return sum / norm; // 0..1, com cumes pronunciados
}

export function MoonTerrain() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const geometry = useMemo(() => {
    // Largura (X) = 60, profundidade (Z) = 360 — cobre toda a viagem da camera.
    const segX = 96;
    const segZ = 480;
    const geo = new THREE.PlaneGeometry(60, 360, segX, segZ);
    // Plano nasce no XY → rotacionar p/ XZ depois (no JSX). Por enquanto,
    // o "z do mundo" e o "y local" do plano antes da rotacao.
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const colA = new THREE.Color("#3a3d44"); // vale escuro
    const colB = new THREE.Color("#9aa0aa"); // crista clara
    const tmpCol = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Coordenadas normalizadas p/ o noise (escala mundo)
      const nx = x * 0.06;
      const ny = y * 0.06;
      // Camadas
      const macro = fbm(nx * 0.3, ny * 0.3, 4) * 5.5;       // ondulacoes amplas
      const meso = fbm(nx, ny, 5) * 1.8;                    // colinas medias
      const rid = ridges(nx * 0.85, ny * 0.85, 5) * 2.2;    // picos lunares
      const micro = (valueNoise2D(nx * 6, ny * 6) - 0.5) * 0.4; // pedrinhas
      let h = macro + meso + rid + micro;
      // Vale rebaixado no centro (X≈0) para abrir caminho da camera entre
      // os cristais — depressao gaussiana ao longo do eixo Z
      const valley = Math.exp(-(x * x) / 90) * 1.6;
      h -= valley;
      pos.setZ(i, h); // antes da rotacao, Z local = altura
      // Cor: gradiente vale→crista
      const t = THREE.MathUtils.clamp((h + 1.6) / 7, 0, 1);
      tmpCol.copy(colA).lerp(colB, t);
      // Sombra leve nas micro-depressoes
      const shade = 0.85 + valueNoise2D(nx * 8, ny * 8) * 0.18;
      colors[i * 3 + 0] = tmpCol.r * shade;
      colors[i * 3 + 1] = tmpCol.g * shade;
      colors[i * 3 + 2] = tmpCol.b * shade;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.95,
        metalness: 0.02,
        flatShading: false,
      }),
    []
  );

  // micro respiracao p/ vida no terreno (pulse de luz no rim)
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    // Sutil deslocamento Y para parallax visual
    meshRef.current.position.y = -7.6 + Math.sin(t * 0.18) * 0.08;
  });

  return (
    <>
      {/* Terreno principal — plano XZ rotacionado, centro em z=-135
          p/ cobrir de z=+45 ate z=-315 (toda a jornada da camera). */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -7.6, -135]}
        receiveShadow
      />
      {/* Halo atmosferico cinza — esfera grande envolvendo a cena
          p/ "ar gelado lunar" evidenciando o terreno na neblina. */}
      <mesh position={[0, 0, -135]}>
        <sphereGeometry args={[280, 24, 16]} />
        <meshBasicMaterial
          color="#6a6f7a"
          side={THREE.BackSide}
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
