"use client";

import { Text3D, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { glitchClock } from "./glitch";
import { useImmersive } from "./store";

/**
 * Texto 3D com material vidro/mercúrio + glitch shader.
 * Usado pelo Hero (PixelCode / Studio), Manifesto e CTA.
 */
type Props = {
  children: string;
  size?: number;
  position?: [number, number, number];
  /** Início (z) onde texto começa a ficar visível */
  zStart?: number;
  /** Fim (z) onde texto desaparece */
  zEnd?: number;
  height?: number;
  bevelSize?: number;
  letterSpacing?: number;
  fontUrl?: string;
};

export function GlitchText3D({
  children,
  size = 1,
  position = [0, 0, 0],
  zStart,
  zEnd,
  height = 0.18,
  bevelSize = 0.012,
  letterSpacing = 0,
  fontUrl = "/fonts/helvetiker_bold.typeface.json",
}: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null!);
  const [glitch, setGlitch] = useState(0);

  useEffect(() => {
    const unsub = glitchClock.subscribe(setGlitch);
    return unsub;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Idle micro-movimento (respiração)
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.04;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.6) * 0.04;

    // Glitch V4: jitter de posicao X + scale Y + flash emissive + skew leve
    if (glitch > 0.01) {
      groupRef.current.position.x = position[0] + (Math.random() - 0.5) * glitch * 0.45;
      groupRef.current.scale.y = 1 + (Math.random() - 0.5) * glitch * 0.18;
      groupRef.current.scale.x = 1 + (Math.random() - 0.5) * glitch * 0.06;
      groupRef.current.rotation.z = (Math.random() - 0.5) * glitch * 0.04;
      if (matRef.current) {
        matRef.current.emissiveIntensity = 0.35 + glitch * 1.3;
      }
    } else {
      groupRef.current.position.x = position[0];
      groupRef.current.scale.y = 1;
      groupRef.current.scale.x = 1;
      groupRef.current.rotation.z = 0;
      if (matRef.current) {
        matRef.current.emissiveIntensity = 0.35;
      }
    }

    // Visibilidade por Z da câmera
    if (zStart !== undefined && zEnd !== undefined) {
      const camZ = state.camera.position.z;
      // fadeIn: 1 quando camera está em zStart, 0 quando mais longe que zStart+18
      const fadeIn = 1 - THREE.MathUtils.smoothstep(camZ, zStart, zStart + 18);
      // fadeOut: 1 enquanto camera não passou de zEnd, 0 quando passou (camZ < zEnd-8)
      const fadeOut = THREE.MathUtils.smoothstep(camZ, zEnd - 8, zEnd);
      const vis = fadeIn * fadeOut;
      if (matRef.current) {
        matRef.current.opacity = vis;
        matRef.current.transparent = true;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Center>
        <Text3D
          font={fontUrl}
          size={size}
          height={height}
          curveSegments={6}
          bevelEnabled
          bevelThickness={0.015}
          bevelSize={bevelSize}
          bevelSegments={3}
          letterSpacing={letterSpacing}
        >
          {children}
          <meshPhysicalMaterial
            ref={matRef}
            color="#e8e8f0"
            emissive="#c5cde8"
            emissiveIntensity={0.35}
            roughness={0.18}
            metalness={0.55}
            clearcoat={1}
            clearcoatRoughness={0.08}
            transmission={0.25}
            thickness={0.4}
            ior={1.45}
            transparent
            opacity={1}
          />
        </Text3D>
      </Center>
    </group>
  );
}

/**
 * Hero: "PixelCode" em cima e "Studio" embaixo.
 * Câmera entra pelo gap entre eles.
 */
export function Hero3DText() {
  return (
    <group>
      <GlitchText3D position={[0, 1.5, 0]} size={1.5} zStart={20} zEnd={-8}>
        PixelCode
      </GlitchText3D>
      <GlitchText3D position={[0, -1.5, 0]} size={1.5} zStart={20} zEnd={-8}>
        Studio
      </GlitchText3D>
      {/* Tagline subtle abaixo */}
      <GlitchText3D
        position={[0, -3.2, 0]}
        size={0.18}
        height={0.04}
        bevelSize={0.003}
        zStart={20}
        zEnd={-6}
        letterSpacing={0.08}
      >
        EXPERIENCIAS DIGITAIS SOB MEDIDA
      </GlitchText3D>
    </group>
  );
}
