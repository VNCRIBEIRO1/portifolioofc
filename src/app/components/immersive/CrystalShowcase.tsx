"use client";

/**
 * CrystalShowcase.tsx — Holocrystals cosmicos.
 *
 * Cada Holocrystal e um conjunto rico de meshes:
 *   1. Faceted shell (icosaedro) — vidro fisico facetado com transmission
 *   2. Inner core — pequeno nucleo emissivo dentro do cristal
 *   3. Halo torus — anel rotativo orbitando o cristal
 *   4. Curved screen — quad cilindrico curvo mostrando o mockup HD
 *      Dimensoes: 4w x 2.5h, raio de curvatura 6 (~30deg de arco)
 *   5. Caustic ring — disco de luz no "chao" (plano horizontal abaixo)
 *   6. Holo glyph particles — sparkles ao redor
 *
 * Quando dolly ativo (focado): a rotacao idle PARA, o cristal se orienta
 * frontal a camera, halo acelera, brilho aumenta.
 * Quando idle: cristal gira lento, mockup invisivel atras, halo lento.
 *
 * Substitui o CrystalShowcase antigo (octaedro + plano interno).
 */

import { Sparkles, useTexture, Billboard } from "@react-three/drei";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { glitchClock } from "./glitch";
import { useImmersive } from "./store";

export type CrystalCase = {
  slug: string;
  title: string;
  nicho: string;
  mockup: string | null;
  accent: string;
  z: number;
  offset: [number, number];
  rotY: number;
};

export const CRYSTALS: CrystalCase[] = [
  { slug: "cerbelera", title: "Cerbelera & Oliveira", nicho: "Juridico", mockup: "/images/projects/cerbelera-desktop.png", accent: "#9ba3c4", z: -90, offset: [-3.5, 0.8], rotY: 0.3 },
  { slug: "andresa", title: "Dra. Andresa Martin", nicho: "Saude", mockup: "/images/projects/andresa-desktop.png", accent: "#c5cde8", z: -104, offset: [3.2, -0.5], rotY: -0.4 },
  { slug: "apex", title: "Apex Analytics", nicho: "Landing SaaS B2B", mockup: "/images/cases/apex.png", accent: "#9ba3c4", z: -118, offset: [-2.8, 1.2], rotY: 0.5 },
  { slug: "lumen", title: "Lumen CRM", nicho: "CRM Dashboard", mockup: "/images/cases/lumen.png", accent: "#c5cde8", z: -132, offset: [3.8, 0.4], rotY: -0.3 },
  { slug: "onda", title: "Onda Banking", nicho: "App iOS", mockup: "/images/cases/onda.png", accent: "#9ba3c4", z: -146, offset: [-3.3, -0.8], rotY: 0.4 },
  { slug: "pulse", title: "Pulse Fit", nicho: "App Android", mockup: "/images/cases/pulse.png", accent: "#c5cde8", z: -160, offset: [3.0, 1.0], rotY: -0.5 },
  { slug: "atelier", title: "Atelier", nicho: "E-commerce Moda", mockup: "/images/cases/atelier.png", accent: "#c5cde8", z: -174, offset: [-3.5, 0.2], rotY: 0.3 },
  { slug: "forge", title: "Forge", nicho: "ERP / Admin", mockup: "/images/cases/forge.png", accent: "#9ba3c4", z: -188, offset: [3.4, -0.6], rotY: -0.4 },
  { slug: "northwind", title: "Northwind Capital", nicho: "Institucional Premium", mockup: "/images/cases/northwind.png", accent: "#c5cde8", z: -202, offset: [-2.9, 1.0], rotY: 0.5 },
  { slug: "kira", title: "Kira Tanaka", nicho: "Portfolio Editorial", mockup: "/images/cases/kira.png", accent: "#9ba3c4", z: -216, offset: [3.1, 0.5], rotY: -0.3 },
  { slug: "scholae", title: "Scholae", nicho: "Educacional", mockup: "/images/cases/scholae.png", accent: "#c5cde8", z: -230, offset: [-3.2, -0.8], rotY: 0.4 },
];

/** Placeholder canvas texture (caso o mockup nao exista ainda). */
function makePlaceholderTexture(c: CrystalCase): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 0, 640);
  grad.addColorStop(0, "#0c0c20");
  grad.addColorStop(0.5, c.accent + "33");
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
  ctx.fillText("Mockup gerado via Stable Diffusion", 48, 410);
  ctx.fillText("Click + scroll para explorar", 48, 445);
  ctx.fillStyle = "rgba(197,205,232,0.08)";
  ctx.font = "900 240px Inter, sans-serif";
  ctx.fillText(c.slug.charAt(0).toUpperCase(), 720, 540);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** Geometria curva (segmento cilindrico) para a tela holografica. */
function curvedScreenGeometry(width = 4, height = 2.5, radius = 6, segments = 32) {
  const geo = new THREE.PlaneGeometry(width, height, segments, 1);
  const pos = geo.attributes.position;
  const arr = pos.array as Float32Array;
  const arc = width / radius; // total angle
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
  const screenGroupRef = useRef<THREE.Group>(null!);
  const screenMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const screenFrameMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const causticMatRef = useRef<THREE.ShaderMaterial>(null!);
  const coreMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const [glitch, setGlitch] = useState(0);
  const accentColor = useMemo(() => new THREE.Color(info.accent), [info.accent]);
  // Curved screen mais largo (16:10) — proporção realista de monitor/mockup
  const screenGeo = useMemo(() => curvedScreenGeometry(4.6, 2.9, 7, 40), []);

  const texture = useMockupTexture(info);

  useEffect(() => glitchClock.subscribe(setGlitch), []);
  useEffect(() => () => screenGeo.dispose(), [screenGeo]);

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

    // Rotacao: SUSPENSA durante dolly/focus para legibilidade
    if (dolly || focused) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.12);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.12);
    } else {
      const targetRotY = info.rotY + t * 0.12;
      groupRef.current.rotation.y = targetRotY;
      groupRef.current.rotation.x = Math.sin(t * 0.4 + index) * 0.06;
    }

    const baseX = info.offset[0];
    const baseY = info.offset[1] + Math.sin(t * 0.6 + index * 1.3) * 0.15;
    const jx = glitch > 0.01 ? (Math.random() - 0.5) * glitch * 0.4 : 0;
    groupRef.current.position.set(baseX + jx, baseY, info.z);

    const targetScale = vis * (focused ? 1.12 : 1) * (dolly ? 1.25 : 1);
    const cur = groupRef.current.scale.x;
    const eased = THREE.MathUtils.lerp(cur, targetScale, 0.12);
    groupRef.current.scale.setScalar(Math.max(0.001, eased));

    // Halo torus: sempre orbitando, acelera quando focado/dolly
    if (haloRef.current) {
      const haloSpeed = (focused || dolly) ? 1.6 : 0.5;
      haloRef.current.rotation.z = t * haloSpeed * 0.3;
      haloRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3 + index) * 0.2;
    }

    // Shell: durante dolly/focus, abre — fica menos opaca para revelar screen atrás
    if (shellMatRef.current) {
      const shellOpacity = dolly ? 0.18 : focused ? 0.45 : 0.85;
      shellMatRef.current.opacity = THREE.MathUtils.lerp(
        shellMatRef.current.opacity,
        shellOpacity,
        0.12
      );
      // Emissive pulse acentuado no focus
      shellMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        shellMatRef.current.emissiveIntensity,
        focused || dolly ? 0.6 : 0.25,
        0.1
      );
    }
    if (shellRef.current) {
      // Shell encolhe levemente no dolly para nao cobrir a tela
      const shellScale = dolly ? 0.85 : 1.0;
      const sCur = shellRef.current.scale.x;
      shellRef.current.scale.setScalar(THREE.MathUtils.lerp(sCur, shellScale, 0.1));
    }

    // Tela holografica: forte no dolly, suave no idle
    if (screenMatRef.current) {
      const screenVis = vis * (dolly ? 1.0 : focused ? 0.95 : 0.0);
      screenMatRef.current.opacity = THREE.MathUtils.lerp(
        screenMatRef.current.opacity,
        screenVis,
        0.12
      );
    }
    if (screenFrameMatRef.current) {
      const frameVis = vis * (dolly ? 0.55 : focused ? 0.35 : 0.0);
      screenFrameMatRef.current.opacity = THREE.MathUtils.lerp(
        screenFrameMatRef.current.opacity,
        frameVis,
        0.12
      );
    }

    // Screen group: posiciona FRENTE do shell durante focus/dolly
    if (screenGroupRef.current) {
      const targetZ = dolly ? 3.2 : focused ? 1.8 : 0;
      const targetScaleZ = dolly ? 1.15 : focused ? 1.05 : 1.0;
      const curZ = screenGroupRef.current.position.z;
      screenGroupRef.current.position.z = THREE.MathUtils.lerp(curZ, targetZ, 0.1);
      const csZ = screenGroupRef.current.scale.x;
      const esZ = THREE.MathUtils.lerp(csZ, targetScaleZ, 0.1);
      screenGroupRef.current.scale.setScalar(esZ);
    }

    // Core: emissive pulse
    if (coreMatRef.current) {
      const pulse = 0.6 + Math.sin(t * 1.2 + index) * 0.2 + (focused ? 0.4 : 0);
      coreMatRef.current.color.setRGB(pulse, pulse, pulse);
      // No dolly o core some para nao competir com a tela
      coreMatRef.current.opacity = vis * (dolly ? 0.0 : 1.0);
    }

    // Caustic ring shader uniform
    if (causticMatRef.current) {
      causticMatRef.current.uniforms.uTime.value = t;
      causticMatRef.current.uniforms.uIntensity.value = vis * (dolly ? 1.5 : focused ? 1.0 : 0.6);
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
  };

  return (
    <group ref={groupRef}>
      {/* Hit-area invisivel maior — facilita o click mesmo se shell estiver pequeno */}
      <mesh
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onClick={handleClick}
        visible={false}
      >
        <sphereGeometry args={[4.2, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 1. Faceted icosaedric shell — vidro fisico */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[2.6, 0]} />
        <meshPhysicalMaterial
          ref={shellMatRef}
          color="#e8e8f0"
          emissive={accentColor}
          emissiveIntensity={0.22}
          roughness={0.05}
          metalness={0.15}
          transmission={0.95}
          thickness={1.6}
          ior={1.55}
          clearcoat={1}
          clearcoatRoughness={0.04}
          attenuationColor={accentColor}
          attenuationDistance={3.0}
          flatShading
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Inner emissive core — pequena esfera brilhante */}
      <mesh>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial
          ref={coreMatRef}
          color={accentColor}
          transparent
          opacity={1}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Halo torus — anel orbitando */}
      <mesh ref={haloRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.8, 0.04, 8, 96]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* 4. Curved screen — mockup holografico curvo, AVANCA pra frente no dolly */}
      <group ref={screenGroupRef} position={[0, 0, 0]}>
        {/* Frame brilhante atras */}
        <mesh geometry={screenGeo} scale={[1.06, 1.08, 1.06]} renderOrder={5}>
          <meshBasicMaterial
            ref={screenFrameMatRef}
            color={accentColor}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Tela com mockup */}
        <mesh geometry={screenGeo} renderOrder={6}>
          <meshBasicMaterial
            ref={screenMatRef}
            map={texture}
            toneMapped={false}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 5. Caustic ring no plano horizontal abaixo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]}>
        <ringGeometry args={[1.8, 4.5, 64, 1]} />
        <shaderMaterial
          ref={causticMatRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          uniforms={{
            uTime: { value: 0 },
            uIntensity: { value: 0 },
            uColor: { value: new THREE.Color(info.accent) },
          }}
          vertexShader={/* glsl */ `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            uniform float uTime;
            uniform float uIntensity;
            uniform vec3 uColor;
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

      {/* 6. Holo glyph particles around */}
      <Sparkles
        count={20}
        scale={[5, 5, 5]}
        size={2}
        speed={0.4}
        color={info.accent}
        opacity={0.7}
      />

      {/* Luz interna fraca (point) */}
      <pointLight color={accentColor} intensity={0.7} distance={7} />

      {/* Label flutuante (Billboard) — slug + nicho */}
      <Billboard position={[0, 3.6, 0]}>
        <mesh>
          <planeGeometry args={[0.001, 0.001]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </Billboard>
    </group>
  );
}

function useMockupTexture(info: CrystalCase): THREE.Texture {
  // Hooks ALWAYS called in the same order — fix anteriormente useMemo era condicional.
  const real = useTexture(info.mockup ? [info.mockup] : []);
  const placeholder = useMemo(() => makePlaceholderTexture(info), [info]);
  if (info.mockup && Array.isArray(real) && real.length > 0) {
    const t = real[0] as THREE.Texture;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  return placeholder;
}
