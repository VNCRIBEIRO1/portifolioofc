"use client";

/**
 * Cosmos.tsx — Universo realista substituindo o tunel liquido.
 *
 * Camadas (ordem de profundidade visual):
 *   1. DeepStarfield      — 8000 estrelas distantes em casca esferica raio 350
 *   2. NearStars          — 2000 estrelas medias com twinkle (size attenuation)
 *   3. MilkyWayBand       — banda galactica via shader gradiente
 *   4. SpiralGalaxies x6  — galaxias espirais procedurais (Bruno Simon style)
 *   5. NebulaClouds       — nuvens volumetricas via Cloud (drei)
 *   6. SpaceDust          — particulas brilhantes proximas via Sparkles
 *
 * Tudo proceduralmente gerado, zero textura externa, GPU friendly.
 * Todos elementos reagem a `reducedMotion` reduzindo contagem de particulas.
 *
 * Referencias: Bruno Simon (galaxy generator), drei <Stars/>, threejs-journey.
 */

import { Sparkles, Cloud } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useImmersive } from "./store";

// =====================================================================
// 1. DEEP STARFIELD — casca esferica fixa, sem twinkle
// =====================================================================
export function DeepStarfield() {
  const reducedMotion = useImmersive((s) => s.reducedMotion);
  const count = reducedMotion ? 2500 : 8000;

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const palette = [
      new THREE.Color("#e8e8f0"), // branco
      new THREE.Color("#c5cde8"), // azul claro (paleta)
      new THREE.Color("#9ba3c4"), // accent
      new THREE.Color("#fff5e0"), // amarelado quente
      new THREE.Color("#ffd5b8"), // alaranjado (gigante vermelha sutil)
    ];
    for (let i = 0; i < count; i++) {
      // Distribuicao uniforme em esfera (raio fixo grande)
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = 320 + Math.random() * 60;
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Cor temperatura aleatoria
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      // Size: maior parte pequenas, poucas grandes
      const r2 = Math.random();
      sizes[i] = r2 < 0.95 ? 0.5 + Math.random() * 0.6 : 1.6 + Math.random() * 1.2;
    }
    return { positions, colors, sizes };
  }, [count]);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.9}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// =====================================================================
// 2. NEAR STARS — estrelas medias com twinkle (shader simples)
// =====================================================================
export function NearStars() {
  const reducedMotion = useImmersive((s) => s.reducedMotion);
  const count = reducedMotion ? 600 : 2000;
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const { positions, phases, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Cilindro alongado em Z (corredor cosmico em volta da camera)
      const theta = Math.random() * Math.PI * 2;
      const r = 28 + Math.random() * 80;
      positions[i * 3 + 0] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(theta) * r;
      positions[i * 3 + 2] = -Math.random() * 320 + 30;
      phases[i] = Math.random() * Math.PI * 2;
      sizes[i] = 0.8 + Math.random() * 1.6;
    }
    return { positions, phases, sizes };
  }, [count]);

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aPhase" count={count} array={phases} itemSize={1} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={/* glsl */ `
          attribute float aPhase;
          attribute float aSize;
          uniform float uTime;
          varying float vTwinkle;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            float tw = 0.6 + 0.4 * sin(uTime * 1.6 + aPhase * 3.1);
            vTwinkle = tw;
            gl_PointSize = aSize * tw * (220.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={/* glsl */ `
          varying float vTwinkle;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            float a = smoothstep(0.5, 0.0, d);
            // raios cruzados sutis
            float ray = max(
              smoothstep(0.5, 0.0, abs(c.x) * 6.0) * smoothstep(0.5, 0.0, abs(c.y)),
              smoothstep(0.5, 0.0, abs(c.y) * 6.0) * smoothstep(0.5, 0.0, abs(c.x))
            );
            a = max(a, ray * 0.5);
            vec3 col = mix(vec3(0.78, 0.81, 0.91), vec3(1.0, 0.96, 0.88), vTwinkle);
            gl_FragColor = vec4(col, a * vTwinkle);
            if (gl_FragColor.a < 0.01) discard;
          }
        `}
      />
    </points>
  );
}

// =====================================================================
// 3. MILKY WAY BAND — banda galactica nebulosa atras
// =====================================================================
export function MilkyWayBand() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  useFrame((s) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return (
    <mesh position={[0, -8, -300]} rotation={[0, 0, 0.35]}>
      <planeGeometry args={[700, 220, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime;
          varying vec2 vUv;

          // Hash
          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          // Value noise
          float noise(vec2 p) {
            vec2 i = floor(p), f = fract(p);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }
          float fbm(vec2 p) {
            float v = 0.0; float a = 0.5;
            for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
            return v;
          }

          void main() {
            vec2 uv = vUv;
            // Banda concentrada no meio Y
            float band = exp(-pow((uv.y - 0.5) * 4.0, 2.0));
            float n = fbm(uv * vec2(12.0, 4.0) + vec2(uTime * 0.005, 0.0));
            float n2 = fbm(uv * vec2(40.0, 12.0));
            float core = n * n2 * band;
            // Cor: roxo-azul profundo com toques quentes
            vec3 col = mix(vec3(0.06, 0.08, 0.18), vec3(0.55, 0.6, 0.85), n);
            col = mix(col, vec3(0.9, 0.7, 0.5), pow(core, 3.0) * 0.6);
            float a = core * 0.55;
            gl_FragColor = vec4(col, a);
          }
        `}
      />
    </mesh>
  );
}

// =====================================================================
// 4. SPIRAL GALAXY — Bruno Simon style logarithmic spiral particles
// =====================================================================
function SpiralGalaxy({
  position,
  rotation,
  scale = 1,
  insideColor = "#ffd5b8",
  outsideColor = "#9ba3c4",
  count: cParam,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  insideColor?: string;
  outsideColor?: string;
  count?: number;
}) {
  const reducedMotion = useImmersive((s) => s.reducedMotion);
  const count = cParam ?? (reducedMotion ? 2500 : 8000);
  const groupRef = useRef<THREE.Group>(null!);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cIn = new THREE.Color(insideColor);
    const cOut = new THREE.Color(outsideColor);
    const branches = 5;
    const radius = 8;
    const spin = 1.3;
    const randomness = 0.35;
    const randomnessPower = 3;

    for (let i = 0; i < count; i++) {
      const r = Math.random() * radius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * spin;

      const rx =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        r;
      const ry =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        r *
        0.3;
      const rz =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        r;

      positions[i * 3 + 0] = Math.cos(branchAngle + spinAngle) * r + rx;
      positions[i * 3 + 1] = ry;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + rz;

      const mixColor = cIn.clone();
      mixColor.lerp(cOut, r / radius);
      colors[i * 3 + 0] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;
    }
    return { positions, colors };
  }, [count, insideColor, outsideColor]);

  useFrame((s) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = s.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export function DistantGalaxies() {
  const reducedMotion = useImmersive((s) => s.reducedMotion);
  const galaxies = useMemo(
    () => [
      { p: [-90, 35, -260] as [number, number, number], r: [0.4, 1.2, 0.1] as [number, number, number], s: 1.4, ci: "#ffd5b8", co: "#9ba3c4" },
      { p: [110, -40, -270] as [number, number, number], r: [0.8, 0.3, -0.2] as [number, number, number], s: 1.1, ci: "#fff5e0", co: "#7a82a8" },
      { p: [-60, -50, -180] as [number, number, number], r: [-0.3, 2.0, 0.5] as [number, number, number], s: 0.8, ci: "#c5cde8", co: "#4a5375" },
      { p: [70, 60, -200] as [number, number, number], r: [1.2, 0.7, -0.4] as [number, number, number], s: 1.0, ci: "#e8e8f0", co: "#9ba3c4" },
      { p: [0, -85, -250] as [number, number, number], r: [0.1, 1.5, 0.0] as [number, number, number], s: 1.3, ci: "#ffe2d0", co: "#5a627a" },
      { p: [-130, 0, -150] as [number, number, number], r: [0.6, 0.0, 0.3] as [number, number, number], s: 0.7, ci: "#c5cde8", co: "#9ba3c4" },
    ],
    []
  );
  const list = reducedMotion ? galaxies.slice(0, 3) : galaxies;
  return (
    <>
      {list.map((g, i) => (
        <SpiralGalaxy
          key={i}
          position={g.p}
          rotation={g.r}
          scale={g.s}
          insideColor={g.ci}
          outsideColor={g.co}
          count={reducedMotion ? 1500 : 6000}
        />
      ))}
    </>
  );
}

// =====================================================================
// 5. NEBULA CLOUDS — drei Cloud volumetrico
// =====================================================================
export function NebulaClouds() {
  const reducedMotion = useImmersive((s) => s.reducedMotion);
  if (reducedMotion) return null;
  return (
    <>
      <Cloud
        position={[-25, 8, -120]}
        seed={1}
        segments={20}
        bounds={[18, 8, 18]}
        volume={12}
        color="#4a5375"
        opacity={0.35}
        speed={0.05}
        growth={2}
      />
      <Cloud
        position={[30, -10, -180]}
        seed={2}
        segments={20}
        bounds={[22, 10, 22]}
        volume={14}
        color="#7a82a8"
        opacity={0.32}
        speed={0.04}
        growth={2.5}
      />
      <Cloud
        position={[0, 12, -240]}
        seed={3}
        segments={18}
        bounds={[28, 8, 28]}
        volume={16}
        color="#9ba3c4"
        opacity={0.25}
        speed={0.03}
        growth={3}
      />
    </>
  );
}

// =====================================================================
// 6. SPACE DUST — particulas brilhantes proximas
// =====================================================================
export function SpaceDust() {
  const reducedMotion = useImmersive((s) => s.reducedMotion);
  if (reducedMotion) return null;
  return (
    <>
      <Sparkles
        count={120}
        scale={[40, 25, 200]}
        position={[0, 0, -110]}
        size={2}
        speed={0.25}
        color="#c5cde8"
        opacity={0.7}
      />
      <Sparkles
        count={80}
        scale={[30, 18, 200]}
        position={[0, 0, -200]}
        size={3}
        speed={0.15}
        color="#fff5e0"
        opacity={0.6}
      />
    </>
  );
}

// =====================================================================
// COSMOS — combinador
// =====================================================================
export function Cosmos() {
  return (
    <group>
      <DeepStarfield />
      <NearStars />
      <MilkyWayBand />
      <DistantGalaxies />
      <NebulaClouds />
      <SpaceDust />
    </group>
  );
}
