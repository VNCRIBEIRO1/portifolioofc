"use client";

/**
 * CrystalShowcase.tsx — Holocristais facetados com paletas únicas.
 *
 * Cada cristal e fantasy-tier:
 *   - Paleta única (esmeralda / safira / rubi / ametista / citrino / topazio /
 *     obsidiana / opala / turmalina / fluorita / agua-marinha)
 *   - Geometria variada (icosa / octa / dodeca / bipiramide alongada)
 *   - Inner core duplo (gem + glow color)
 *   - Halo torus PBR
 *   - Caustica no chao
 *   - Holograma lateral que EMERGE no hover (plane com glitch shader)
 *   - Click abre overlay full-mockup (estado externo openedCrystal)
 *
 * Click → setOpenedCrystal(i) + dolly. ESC fecha.
 */

import { Sparkles, useTexture, Billboard } from "@react-three/drei";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { glitchClock } from "./glitch";
import { useImmersive } from "./store";

export type GemKind = "icosa" | "octa" | "dodeca" | "bipyramid";

export type CrystalCase = {
  slug: string;
  title: string;
  nicho: string;
  mockup: string | null;
  /** Cor primaria do cristal (gem) */
  gemColor: string;
  /** Cor de luz interna complementar (glow) */
  glowColor: string;
  /** Cor do halo / acentos UI */
  accent: string;
  /** Tipo geometrico do shell */
  kind: GemKind;
  /** Tamanho base */
  size: number;
  z: number;
  offset: [number, number];
  rotY: number;
};

export const CRYSTALS: CrystalCase[] = [
  // 1. Cerbelera — JURIDICO :: Obsidiana com fogo dourado interno
  { slug: "cerbelera", title: "Cerbelera & Oliveira", nicho: "Juridico",
    mockup: "/images/projects/cerbelera-desktop.png",
    gemColor: "#1a1320", glowColor: "#ffb74a", accent: "#ffc674",
    kind: "octa", size: 2.6, z: -90, offset: [-3.5, 0.8], rotY: 0.3 },

  // 2. Andresa — SAUDE :: Quartzo rosa luminoso
  { slug: "andresa", title: "Dra. Andresa Martin", nicho: "Saude",
    mockup: "/images/projects/andresa-desktop.png",
    gemColor: "#f8c5d4", glowColor: "#ff7aa8", accent: "#ffb6c8",
    kind: "dodeca", size: 2.5, z: -104, offset: [3.2, -0.5], rotY: -0.4 },

  // 3. Apex — SAAS B2B :: Topazio azul-eletrico
  { slug: "apex", title: "Apex Analytics", nicho: "Landing SaaS B2B",
    mockup: "/images/cases/apex.png",
    gemColor: "#3da8ff", glowColor: "#00e5ff", accent: "#5ec8ff",
    kind: "bipyramid", size: 2.7, z: -118, offset: [-2.8, 1.2], rotY: 0.5 },

  // 4. Lumen — CRM :: Esmeralda verde-dourado (REFERENCIA do user)
  { slug: "lumen", title: "Lumen CRM", nicho: "CRM Dashboard",
    mockup: "/images/cases/lumen.png",
    gemColor: "#2dd47a", glowColor: "#ffd54a", accent: "#7be8a8",
    kind: "bipyramid", size: 2.8, z: -132, offset: [3.8, 0.4], rotY: -0.3 },

  // 5. Onda — APP iOS :: Agua-marinha translucida
  { slug: "onda", title: "Onda Banking", nicho: "App iOS",
    mockup: "/images/cases/onda.png",
    gemColor: "#5cc8ff", glowColor: "#a8f0ff", accent: "#7dd3fc",
    kind: "icosa", size: 2.5, z: -146, offset: [-3.3, -0.8], rotY: 0.4 },

  // 6. Pulse — APP Android :: Rubi vermelho-fogo
  { slug: "pulse", title: "Pulse Fit", nicho: "App Android",
    mockup: "/images/cases/pulse.png",
    gemColor: "#e63946", glowColor: "#ff8f6b", accent: "#ff6b8a",
    kind: "octa", size: 2.6, z: -160, offset: [3.0, 1.0], rotY: -0.5 },

  // 7. Atelier — E-COMMERCE :: Ametista violeta-rosado
  { slug: "atelier", title: "Atelier", nicho: "E-commerce Moda",
    mockup: "/images/cases/atelier.png",
    gemColor: "#9d4edd", glowColor: "#e0aaff", accent: "#c77dff",
    kind: "dodeca", size: 2.6, z: -174, offset: [-3.5, 0.2], rotY: 0.3 },

  // 8. Forge — ERP :: Citrino dourado-cobre
  { slug: "forge", title: "Forge", nicho: "ERP / Admin",
    mockup: "/images/cases/forge.png",
    gemColor: "#ff9c1a", glowColor: "#ffe066", accent: "#ffb84a",
    kind: "bipyramid", size: 2.7, z: -188, offset: [3.4, -0.6], rotY: -0.4 },

  // 9. Northwind — INSTITUCIONAL :: Safira azul-real profundo
  { slug: "northwind", title: "Northwind Capital", nicho: "Institucional Premium",
    mockup: "/images/cases/northwind.png",
    gemColor: "#1e40af", glowColor: "#60a5fa", accent: "#93c5fd",
    kind: "octa", size: 2.7, z: -202, offset: [-2.9, 1.0], rotY: 0.5 },

  // 10. Kira — PORTFOLIO EDITORIAL :: Opala iridescente (multi-color)
  { slug: "kira", title: "Kira Tanaka", nicho: "Portfolio Editorial",
    mockup: "/images/cases/kira.png",
    gemColor: "#f0aaff", glowColor: "#80ffea", accent: "#caf0f8",
    kind: "icosa", size: 2.5, z: -216, offset: [3.1, 0.5], rotY: -0.3 },

  // 11. Scholae — EDUCACIONAL :: Fluorita verde-azul
  { slug: "scholae", title: "Scholae", nicho: "Educacional",
    mockup: "/images/cases/scholae.png",
    gemColor: "#06d6a0", glowColor: "#118ab2", accent: "#48cae4",
    kind: "dodeca", size: 2.6, z: -230, offset: [-3.2, -0.8], rotY: 0.4 },
];

/** Placeholder canvas texture (caso o mockup nao exista ainda). */
function makePlaceholderTexture(c: CrystalCase): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 0, 640);
  grad.addColorStop(0, "#0c0c20");
  grad.addColorStop(0.5, c.gemColor + "33");
  grad.addColorStop(1, "#03030c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 640);
  ctx.strokeStyle = "rgba(232,232,240,0.06)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1024; x += 48) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 640); ctx.stroke();
  }
  for (let y = 0; y <= 640; y += 48) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
  }
  ctx.fillStyle = "rgba(155,163,196,0.7)";
  ctx.font = "20px 'Courier New', monospace";
  ctx.fillText(`> CASE_${c.slug.toUpperCase()}`, 48, 60);
  ctx.fillText(`> ${c.nicho.toUpperCase()}`, 48, 90);
  ctx.fillStyle = "#e8e8f0";
  ctx.font = "700 78px Inter, sans-serif";
  ctx.fillText(c.title, 48, 320);
  ctx.fillStyle = c.accent;
  ctx.fillRect(48, 360, 120, 2);
  ctx.fillStyle = "rgba(232,232,240,0.6)";
  ctx.font = "24px Inter, sans-serif";
  ctx.fillText("Mockup PNG", 48, 410);
  ctx.fillStyle = "rgba(197,205,232,0.08)";
  ctx.font = "900 240px Inter, sans-serif";
  ctx.fillText(c.slug.charAt(0).toUpperCase(), 720, 540);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** Bipiramide alongada (cristal estilo cuarzo) — combina dois cones espelhados. */
function makeBipyramidGeometry(radius = 1.4, height = 3.0, segments = 6): THREE.BufferGeometry {
  // Construir manualmente para garantir flat shading e arestas duras
  const positions: number[] = [];
  const indices: number[] = [];
  // Vertices: top, bottom, anel central
  positions.push(0, height / 2, 0); // 0 = top
  positions.push(0, -height / 2, 0); // 1 = bottom
  for (let i = 0; i < segments; i++) {
    const ang = (i / segments) * Math.PI * 2;
    positions.push(Math.cos(ang) * radius, 0, Math.sin(ang) * radius);
  }
  // Faces top/bottom (triangulos com top/bottom como apice)
  for (let i = 0; i < segments; i++) {
    const a = 2 + i;
    const b = 2 + ((i + 1) % segments);
    indices.push(0, a, b); // top fan
    indices.push(1, b, a); // bottom fan
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/** Geometria curva (segmento cilindrico) para a tela holografica. */
function curvedScreenGeometry(width = 4, height = 2.5, radius = 6, segments = 32) {
  const geo = new THREE.PlaneGeometry(width, height, segments, 1);
  const pos = geo.attributes.position;
  const arr = pos.array as Float32Array;
  const arc = width / radius;
  for (let i = 0; i < pos.count; i++) {
    const x = arr[i * 3 + 0];
    const y = arr[i * 3 + 1];
    const angle = (x / width) * arc;
    arr[i * 3 + 0] = Math.sin(angle) * radius;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = -radius + Math.cos(angle) * radius;
  }
  geo.computeVertexNormals();
  return geo;
}

export function CrystalShowcase() {
  return (
    <group>
      {CRYSTALS.map((c, i) => (
        <Holocrystal key={c.slug} info={c} index={i} />
      ))}
    </group>
  );
}

function Holocrystal({ info, index }: { info: CrystalCase; index: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const shellRef = useRef<THREE.Mesh>(null!);
  const shellMatRef = useRef<THREE.MeshPhysicalMaterial>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const hologramGroupRef = useRef<THREE.Group>(null!);
  const hologramMatRef = useRef<THREE.ShaderMaterial>(null!);
  const hologramFrameMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const causticMatRef = useRef<THREE.ShaderMaterial>(null!);
  const coreMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const [glitch, setGlitch] = useState(0);

  const gemColor = useMemo(() => new THREE.Color(info.gemColor), [info.gemColor]);
  const glowColor = useMemo(() => new THREE.Color(info.glowColor), [info.glowColor]);
  const accentColor = useMemo(() => new THREE.Color(info.accent), [info.accent]);

  // Plano lateral 16:9 — emerge do lado do cristal no hover (holograma)
  const hologramGeo = useMemo(() => new THREE.PlaneGeometry(4.2, 2.36, 32, 18), []);
  const screenGeo = useMemo(() => curvedScreenGeometry(4.6, 2.9, 7, 40), []);

  const texture = useMockupTexture(info);

  // Geometria do shell — varia por kind
  const shellGeoEl = useMemo(() => {
    switch (info.kind) {
      case "octa":
        return <octahedronGeometry args={[info.size, 0]} />;
      case "dodeca":
        return <dodecahedronGeometry args={[info.size * 0.92, 0]} />;
      case "bipyramid":
        return (
          <primitive
            object={makeBipyramidGeometry(info.size * 0.7, info.size * 1.6, 6)}
            attach="geometry"
          />
        );
      case "icosa":
      default:
        return <icosahedronGeometry args={[info.size, 0]} />;
    }
  }, [info.kind, info.size]);

  useEffect(() => glitchClock.subscribe(setGlitch), []);
  useEffect(() => () => {
    hologramGeo.dispose();
    screenGeo.dispose();
  }, [hologramGeo, screenGeo]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const camZ = state.camera.position.z;

    const distToCam = info.z - camZ;
    const fadeIn = THREE.MathUtils.smoothstep(distToCam, -45, -15);
    const fadeOut = 1 - THREE.MathUtils.smoothstep(distToCam, 8, 22);
    const vis = fadeIn * fadeOut;

    const focused = useImmersive.getState().focusedCrystal === index;
    const dolly = useImmersive.getState().dollyTarget === index;
    const opened = useImmersive.getState().openedCrystal === index;

    // Rotacao: SUSPENSA durante hover/dolly/opened para legibilidade
    if (dolly || focused || opened) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
    } else {
      const targetRotY = info.rotY + t * 0.18;
      groupRef.current.rotation.y = targetRotY;
      groupRef.current.rotation.x = Math.sin(t * 0.4 + index) * 0.08;
      groupRef.current.rotation.z = Math.cos(t * 0.3 + index * 1.7) * 0.05;
    }

    const baseX = info.offset[0];
    const baseY = info.offset[1] + Math.sin(t * 0.6 + index * 1.3) * 0.18;
    const jx = glitch > 0.01 ? (Math.random() - 0.5) * glitch * 0.5 : 0;
    groupRef.current.position.set(baseX + jx, baseY, info.z);

    const targetScale = vis * (focused ? 1.1 : 1) * (dolly ? 1.2 : 1);
    const cur = groupRef.current.scale.x;
    const eased = THREE.MathUtils.lerp(cur, targetScale, 0.12);
    groupRef.current.scale.setScalar(Math.max(0.001, eased));

    // Halo torus
    if (haloRef.current) {
      const haloSpeed = (focused || dolly) ? 1.8 : 0.5;
      haloRef.current.rotation.z = t * haloSpeed * 0.3;
      haloRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3 + index) * 0.2;
    }

    // Shell: opacidade SOLIDA (cristal vivido), abre levemente no dolly
    if (shellMatRef.current) {
      const shellOpacity = dolly ? 0.55 : focused ? 0.78 : 0.94;
      shellMatRef.current.opacity = THREE.MathUtils.lerp(
        shellMatRef.current.opacity, shellOpacity, 0.1
      );
      shellMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        shellMatRef.current.emissiveIntensity,
        focused || dolly ? 0.85 : 0.35,
        0.1
      );
    }

    // Holograma frontal: posiciona-se entre o cristal e a câmera
    // (vetor crystal→camera) e EMERGE no hover/dolly.
    if (hologramGroupRef.current) {
      const camPos = state.camera.position;
      const crystalWorldPos = groupRef.current.position;
      // Vetor unitário do cristal para a câmera (em world space).
      const dx = camPos.x - crystalWorldPos.x;
      const dy = camPos.y - crystalWorldPos.y;
      const dz = camPos.z - crystalWorldPos.z;
      const len = Math.max(0.001, Math.sqrt(dx * dx + dy * dy + dz * dz));
      const ux = dx / len, uy = dy / len, uz = dz / len;
      // Distância do holograma em frente do cristal
      const hologramDist = (focused || dolly) ? info.size + 2.4 : info.size + 1.0;
      const targetX = ux * hologramDist;
      const targetY = uy * hologramDist + 0.2;
      const targetZ = uz * hologramDist;
      const targetScaleH = (focused || dolly) ? 1.0 : 0.001;

      hologramGroupRef.current.position.x = THREE.MathUtils.lerp(
        hologramGroupRef.current.position.x, targetX, 0.14
      );
      hologramGroupRef.current.position.y = THREE.MathUtils.lerp(
        hologramGroupRef.current.position.y, targetY, 0.14
      );
      hologramGroupRef.current.position.z = THREE.MathUtils.lerp(
        hologramGroupRef.current.position.z, targetZ, 0.14
      );
      const csH = hologramGroupRef.current.scale.x;
      const esH = THREE.MathUtils.lerp(csH, targetScaleH, 0.1);
      hologramGroupRef.current.scale.setScalar(Math.max(0.001, esH));
    }

    // Hologram shader uniforms
    if (hologramMatRef.current) {
      const u = hologramMatRef.current.uniforms;
      u.uTime.value = t;
      u.uIntensity.value = (focused || dolly) ? 1.0 : 0.0;
      u.uGlitch.value = glitch + (focused ? 0.08 : 0); // glitch base mais forte no hover
    }
    if (hologramFrameMatRef.current) {
      hologramFrameMatRef.current.opacity = THREE.MathUtils.lerp(
        hologramFrameMatRef.current.opacity,
        (focused || dolly) ? 0.7 : 0,
        0.1
      );
    }

    // Core inner: pulse com glow color
    if (coreMatRef.current) {
      const pulse = 0.7 + Math.sin(t * 1.5 + index) * 0.25 + (focused ? 0.4 : 0);
      coreMatRef.current.color.copy(glowColor).multiplyScalar(pulse);
      coreMatRef.current.opacity = vis;
    }
    if (glowMatRef.current) {
      const gp = 0.5 + Math.sin(t * 0.9 + index * 1.2) * 0.3;
      glowMatRef.current.color.copy(gemColor).multiplyScalar(gp);
      glowMatRef.current.opacity = vis * 0.5;
    }

    // Caustic
    if (causticMatRef.current) {
      causticMatRef.current.uniforms.uTime.value = t;
      causticMatRef.current.uniforms.uIntensity.value =
        vis * (dolly ? 1.6 : focused ? 1.1 : 0.5);
    }
  });

  const handleEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    useImmersive.getState().setFocusedCrystal(index);
    document.body.style.cursor = "pointer";
  };
  const handleLeave = () => {
    useImmersive.getState().setFocusedCrystal(-1);
    document.body.style.cursor = "";
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    useImmersive.getState().setDollyTarget(index);
    useImmersive.getState().setOpenedCrystal(index);
  };

  return (
    <group ref={groupRef}>
      {/* Hit-area sphere */}
      <mesh
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onClick={handleClick}
        visible={false}
      >
        <sphereGeometry args={[Math.max(info.size * 1.5, 4.2), 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 1. Faceted shell — vidro fisico facetado VIVIDO */}
      <mesh ref={shellRef}>
        {shellGeoEl}
        <meshPhysicalMaterial
          ref={shellMatRef}
          color={gemColor}
          emissive={gemColor}
          emissiveIntensity={0.35}
          roughness={0.06}
          metalness={0.15}
          transmission={0.7}
          thickness={1.6}
          ior={1.85}
          clearcoat={1}
          clearcoatRoughness={0.04}
          attenuationColor={glowColor}
          attenuationDistance={1.6}
          iridescence={0.6}
          iridescenceIOR={1.6}
          iridescenceThicknessRange={[100, 600]}
          sheen={0.5}
          sheenColor={accentColor}
          sheenRoughness={0.4}
          flatShading
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
          envMapIntensity={2.2}
        />
      </mesh>

      {/* 1c. Camada interna de facetas — geometria nested para profundidade */}
      <mesh scale={0.62} rotation={[0.6, 0.4, 0.2]}>
        {info.kind === "octa" ? (
          <octahedronGeometry args={[info.size, 0]} />
        ) : info.kind === "dodeca" ? (
          <icosahedronGeometry args={[info.size * 0.95, 0]} />
        ) : (
          <octahedronGeometry args={[info.size * 0.9, 0]} />
        )}
        <meshPhysicalMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.3}
          transmission={0.4}
          thickness={0.8}
          ior={1.9}
          flatShading
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* 1b. Glow halo — esfera maior aditiva ao redor */}
      <mesh scale={1.18}>
        {shellGeoEl}
        <meshBasicMaterial
          ref={glowMatRef}
          color={gemColor}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* 2. Inner core — pequena gem brilhante interna */}
      <mesh>
        <icosahedronGeometry args={[info.size * 0.22, 1]} />
        <meshBasicMaterial
          ref={coreMatRef}
          color={glowColor}
          transparent
          opacity={1}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Halo torus orbitando */}
      <mesh ref={haloRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[info.size * 1.55, 0.05, 8, 96]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* 4. HOLOGRAMA FRONTAL — entre cristal e câmera, Billboard (sempre face), com glitch shader */}
      <group ref={hologramGroupRef} scale={0.001}>
        <Billboard follow lockX={false} lockY={false} lockZ={false}>
        {/* Frame brilhante atras */}
        <mesh position={[0, 0, -0.02]} scale={[1.06, 1.08, 1]}>
          <planeGeometry args={[4.2, 2.36]} />
          <meshBasicMaterial
            ref={hologramFrameMatRef}
            color={accentColor}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        {/* Tela com mockup + glitch shader */}
        <mesh geometry={hologramGeo}>
          <shaderMaterial
            ref={hologramMatRef}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.NormalBlending}
            uniforms={{
              uTime: { value: 0 },
              uIntensity: { value: 0 },
              uGlitch: { value: 0 },
              uMap: { value: texture },
              uColor: { value: accentColor },
            }}
            vertexShader={/* glsl */ `
              uniform float uTime;
              uniform float uGlitch;
              varying vec2 vUv;
              float rand(float n) { return fract(sin(n) * 43758.5453); }
              void main() {
                vUv = uv;
                vec3 p = position;
                // Jitter horizontal por banda Y (glitch slice)
                float band = floor(uv.y * 18.0);
                float jit = (rand(band + floor(uTime * 12.0)) - 0.5) * uGlitch * 0.4;
                p.x += jit;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
              }
            `}
            fragmentShader={/* glsl */ `
              uniform float uTime;
              uniform float uIntensity;
              uniform float uGlitch;
              uniform sampler2D uMap;
              uniform vec3 uColor;
              varying vec2 vUv;
              float rand(vec2 c) { return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453); }
              void main() {
                vec2 uv = vUv;
                // RGB split
                float split = 0.006 + uGlitch * 0.025;
                float r = texture2D(uMap, uv + vec2(split, 0.0)).r;
                float g = texture2D(uMap, uv).g;
                float b = texture2D(uMap, uv - vec2(split, 0.0)).b;
                vec3 col = vec3(r, g, b);
                // Scanlines suaves
                float scan = 0.92 + 0.08 * sin(uv.y * 320.0 + uTime * 4.0);
                col *= scan;
                // Tinting holografico SUTIL (mantem mockup legivel)
                col = mix(col, col * (0.7 + uColor * 0.6), 0.12);
                // Vinheta suave
                float vig = smoothstep(1.2, 0.4, distance(uv, vec2(0.5)));
                col *= vig;
                // Static noise
                float n = rand(uv * 800.0 + uTime) * 0.04;
                col += n;
                // Slice glitch (bandas que saltam de cor)
                float slice = step(0.985, rand(vec2(floor(uv.y * 24.0), floor(uTime * 18.0))));
                col = mix(col, vec3(1.0) - col, slice * uGlitch * 0.5);
                // Edge glow
                float edge = smoothstep(0.0, 0.04, uv.x) * smoothstep(1.0, 0.96, uv.x)
                           * smoothstep(0.0, 0.04, uv.y) * smoothstep(1.0, 0.96, uv.y);
                col += uColor * (1.0 - edge) * 0.4;
                gl_FragColor = vec4(col, uIntensity * (0.96 + uGlitch * 0.04));
              }
            `}
          />
        </mesh>
        </Billboard>
      </group>

      {/* 5. Caustica chao */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -info.size - 0.6, 0]}>
        <ringGeometry args={[info.size * 0.7, info.size * 1.7, 64, 1]} />
        <shaderMaterial
          ref={causticMatRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          uniforms={{
            uTime: { value: 0 },
            uIntensity: { value: 0 },
            uColor: { value: gemColor },
          }}
          vertexShader={/* glsl */ `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            uniform float uTime; uniform float uIntensity; uniform vec3 uColor;
            varying vec2 vUv;
            void main() {
              float r = vUv.y;
              float theta = vUv.x * 6.2831;
              float ripple = sin(theta * 8.0 + uTime * 1.5) * 0.5 + 0.5;
              float bands = sin((1.0 - r) * 16.0 - uTime * 2.0) * 0.5 + 0.5;
              float a = pow(1.0 - abs(r - 0.5) * 2.0, 2.0) * ripple * bands;
              gl_FragColor = vec4(uColor, a * uIntensity * 0.7);
            }
          `}
        />
      </mesh>

      {/* 6. Sparkles ao redor */}
      <Sparkles
        count={28}
        scale={[info.size * 2.4, info.size * 2.4, info.size * 2.4]}
        size={2.5}
        speed={0.5}
        color={info.glowColor}
        opacity={0.8}
      />

      <pointLight color={glowColor} intensity={0.9} distance={8} />
    </group>
  );
}

function useMockupTexture(info: CrystalCase): THREE.Texture {
  const real = useTexture(info.mockup ? [info.mockup] : []);
  const placeholder = useMemo(() => makePlaceholderTexture(info), [info]);
  if (info.mockup && Array.isArray(real) && real.length > 0) {
    const t = real[0] as THREE.Texture;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  return placeholder;
}
