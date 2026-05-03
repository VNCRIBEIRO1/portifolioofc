"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { glitchClock } from "./glitch";
import { useImmersive } from "./store";

export type CrystalCase = {
  slug: string;
  title: string;
  nicho: string;
  /** Mockup texture URL ou null para placeholder procedural */
  mockup: string | null;
  /** Cor de acento principal (paleta Liquid Mercury variations) */
  accent: string;
  /** Z position no path */
  z: number;
  /** offset lateral (x, y) */
  offset: [number, number];
  /** rotação inicial em Y (radianos) */
  rotY: number;
};

/** 11 cristais distribuídos do z=-90 ao z=-240 */
export const CRYSTALS: CrystalCase[] = [
  // Reais
  { slug: "cerbelera", title: "Cerbelera & Oliveira", nicho: "Juridico", mockup: "/images/projects/cerbelera-desktop.png", accent: "#9ba3c4", z: -90, offset: [-3.5, 0.8], rotY: 0.3 },
  { slug: "andresa", title: "Dra. Andresa Martin", nicho: "Saude", mockup: "/images/projects/andresa-desktop.png", accent: "#c5cde8", z: -104, offset: [3.2, -0.5], rotY: -0.4 },
  // SD list — mockup definitivo em /images/cases/{slug}.png assim que comfy-generate.mjs rodar.
  // Fallbacks temporarios apontam para imagens reais ate la.
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

/**
 * Gera um CanvasTexture com gradiente + título.
 * Usado para os cases sem mockup real ainda.
 */
function makePlaceholderTexture(c: CrystalCase): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  // Gradiente vertical
  const grad = ctx.createLinearGradient(0, 0, 0, 640);
  grad.addColorStop(0, "#0c0c20");
  grad.addColorStop(0.5, c.accent + "33");
  grad.addColorStop(1, "#03030c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 640);

  // Grid sutil
  ctx.strokeStyle = "rgba(232,232,240,0.06)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1024; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 640);
    ctx.stroke();
  }
  for (let y = 0; y <= 640; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Caption monoespaçado superior
  ctx.fillStyle = "rgba(155,163,196,0.7)";
  ctx.font = "20px 'Courier New', monospace";
  ctx.fillText(`> CASE_${c.slug.toUpperCase()}`, 48, 60);
  ctx.fillText(`> ${c.nicho.toUpperCase()}`, 48, 90);

  // Título grande
  ctx.fillStyle = "#e8e8f0";
  ctx.font = "700 78px Inter, sans-serif";
  ctx.fillText(c.title, 48, 320);

  // Linha + meta
  ctx.fillStyle = c.accent;
  ctx.fillRect(48, 360, 120, 2);
  ctx.fillStyle = "rgba(232,232,240,0.6)";
  ctx.font = "24px Inter, sans-serif";
  ctx.fillText("Mockup gerado via Stable Diffusion", 48, 410);
  ctx.fillText("Click + scroll para explorar", 48, 445);

  // Marca grande de canto
  ctx.fillStyle = "rgba(197,205,232,0.08)";
  ctx.font = "900 240px Inter, sans-serif";
  ctx.fillText(c.slug.charAt(0).toUpperCase(), 720, 540);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function CrystalShowcase() {
  return (
    <group>
      {CRYSTALS.map((c, i) => (
        <Crystal key={c.slug} info={c} index={i} />
      ))}
    </group>
  );
}

function Crystal({ info, index }: { info: CrystalCase; index: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const shellRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const innerMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const [glitch, setGlitch] = useState(0);
  const accentColor = useMemo(() => new THREE.Color(info.accent), [info.accent]);

  // Texture: real mockup OR placeholder canvas
  const texture = useMockupTexture(info);

  useEffect(() => glitchClock.subscribe(setGlitch), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const camZ = state.camera.position.z;

    // Visibilidade: aparece quando câmera está a ~30 unidades de distância, some ao passar
    const distToCam = info.z - camZ; // negativo quando câmera passou
    const fadeIn = THREE.MathUtils.smoothstep(distToCam, -45, -15);
    const fadeOut = 1 - THREE.MathUtils.smoothstep(distToCam, 8, 22);
    const vis = fadeIn * fadeOut;

    // Idle: rotação contínua + leve respiração
    const focused = useImmersive.getState().focusedCrystal === index;
    const dolly = useImmersive.getState().dollyTarget === index;
    const targetRotY = info.rotY + t * (focused ? 0.5 : 0.15);
    groupRef.current.rotation.y = targetRotY;
    groupRef.current.rotation.x = Math.sin(t * 0.4 + index) * 0.08;

    // Posição: x/y idle (pulse) + jitter no glitch
    const baseX = info.offset[0];
    const baseY = info.offset[1] + Math.sin(t * 0.6 + index * 1.3) * 0.15;
    const jx = glitch > 0.01 ? (Math.random() - 0.5) * glitch * 0.4 : 0;
    groupRef.current.position.set(baseX + jx, baseY, info.z);

    // Scale: visibilidade + boost no focused
    const targetScale = vis * (focused ? 1.18 : 1) * (dolly ? 1.4 : 1);
    const cur = groupRef.current.scale.x;
    const eased = THREE.MathUtils.lerp(cur, targetScale, 0.12);
    groupRef.current.scale.setScalar(Math.max(0.001, eased));

    // Inner: emissive pulse
    if (innerMatRef.current) {
      innerMatRef.current.opacity = vis;
      const pulse = 0.85 + Math.sin(t * 1.2 + index) * 0.1 + (focused ? 0.3 : 0);
      innerMatRef.current.color.setRGB(pulse, pulse, pulse);
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

  // Forma: octahedron facetado (placa de cristal cinemática)
  return (
    <group ref={groupRef}>
      {/* Casca de vidro/cristal facetada */}
      <mesh
        ref={shellRef}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onClick={handleClick}
      >
        <octahedronGeometry args={[2.8, 1]} />
        <meshPhysicalMaterial
          color="#e8e8f0"
          emissive={accentColor}
          emissiveIntensity={0.18}
          roughness={0.08}
          metalness={0.1}
          transmission={0.92}
          thickness={1.4}
          ior={1.52}
          clearcoat={1}
          clearcoatRoughness={0.05}
          attenuationColor={accentColor}
          attenuationDistance={2.8}
          flatShading
          transparent
          opacity={1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Mockup interno (plate dentro do cristal) */}
      <mesh ref={innerRef} rotation={[0, 0, 0]}>
        <planeGeometry args={[2.6, 2.6 / 1.6, 1, 1]} />
        <meshBasicMaterial
          ref={innerMatRef}
          map={texture}
          toneMapped={false}
          transparent
          opacity={1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Luz interior fraca (dá glow) */}
      <pointLight color={accentColor} intensity={0.6} distance={6} />
    </group>
  );
}

function useMockupTexture(info: CrystalCase): THREE.Texture {
  const real = useTexture(info.mockup ? [info.mockup] : []);
  const [placeholder, setPlaceholder] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!info.mockup) {
      const tex = makePlaceholderTexture(info);
      setPlaceholder(tex);
      return () => tex.dispose();
    }
  }, [info]);

  if (info.mockup && Array.isArray(real) && real.length > 0) {
    const t = real[0] as THREE.Texture;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  if (placeholder) return placeholder;

  // Fallback: texture vazia 1x1
  const blank = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 4;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#0c0c20";
    ctx.fillRect(0, 0, 4, 4);
    return new THREE.CanvasTexture(c);
  }, []);
  return blank;
}
