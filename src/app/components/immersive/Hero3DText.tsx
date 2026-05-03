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
  // Ghost layers p/ chromatic aberration (estilo glitch profissional)
  const ghostRedRef = useRef<THREE.Group>(null!);
  const ghostCyanRef = useRef<THREE.Group>(null!);
  const ghostRedMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const ghostCyanMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const [glitch, setGlitch] = useState(0);

  useEffect(() => {
    const unsub = glitchClock.subscribe(setGlitch);
    return unsub;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const phase = position[0] + position[1]; // offset por instancia

    // === KINETIC TYPOGRAPHY: deformacao continua sempre-on ===
    const xJ = Math.sin(t * 3.1 + phase) * 0.022 + Math.sin(t * 9.7 + phase) * 0.011;
    const sY = 1 + Math.sin(t * 4.7) * 0.04 + Math.sin(t * 11.3 + phase) * 0.018;
    const sX = 1 + Math.sin(t * 5.3 + 0.7) * 0.022 + Math.sin(t * 8.1) * 0.012;
    const rZ = Math.sin(t * 1.7 + phase) * 0.012 + (Math.random() - 0.5) * 0.004;
    const yBob = Math.sin(t * 0.6) * 0.04;

    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.04;
    groupRef.current.position.x = position[0] + xJ;
    groupRef.current.position.y = position[1] + yBob;
    groupRef.current.scale.y = sY;
    groupRef.current.scale.x = sX;
    groupRef.current.rotation.z = rZ;

    let emissive = 0.35 + 0.25 * Math.abs(Math.sin(t * 2.1 + phase));

    // === GLITCH SPIKE PROFISSIONAL (bursts a cada 2s) ===
    // Camadas: chromatic aberration RGB + slice tear + scale crush
    if (glitch > 0.01) {
      // Slice tear: jitter intenso em X com salto digital (steps)
      const tear = Math.sign(Math.sin(t * 60)) * glitch * 0.35;
      groupRef.current.position.x += tear + (Math.random() - 0.5) * glitch * 0.3;
      // Crush vertical (scale Y)
      groupRef.current.scale.y *= 1 + (Math.random() - 0.5) * glitch * 0.22;
      groupRef.current.scale.x *= 1 + (Math.random() - 0.5) * glitch * 0.08;
      // Skew/rot Z forte
      groupRef.current.rotation.z += (Math.random() - 0.5) * glitch * 0.06;
      emissive += glitch * 1.4;
    }

    if (matRef.current) {
      matRef.current.emissiveIntensity = emissive;
    }

    // === Ghost layers: chromatic aberration ===
    // Red ghost desloca para +X, cyan para -X — visiveis APENAS durante burst
    const ghostShift = glitch * 0.12 + Math.sin(t * 47) * glitch * 0.05;
    if (ghostRedRef.current) {
      ghostRedRef.current.position.x = ghostShift;
      ghostRedRef.current.position.y = (Math.random() - 0.5) * glitch * 0.04;
    }
    if (ghostCyanRef.current) {
      ghostCyanRef.current.position.x = -ghostShift;
      ghostCyanRef.current.position.y = (Math.random() - 0.5) * glitch * 0.04;
    }
    if (ghostRedMatRef.current) {
      ghostRedMatRef.current.opacity = glitch * 0.85;
    }
    if (ghostCyanMatRef.current) {
      ghostCyanMatRef.current.opacity = glitch * 0.85;
    }

    // Visibilidade por Z da câmera
    if (zStart !== undefined && zEnd !== undefined) {
      const camZ = state.camera.position.z;
      const fadeIn = 1 - THREE.MathUtils.smoothstep(camZ, zStart, zStart + 18);
      const fadeOut = THREE.MathUtils.smoothstep(camZ, zEnd - 8, zEnd);
      const vis = fadeIn * fadeOut;
      if (matRef.current) {
        matRef.current.opacity = vis;
        matRef.current.transparent = true;
      }
    }
  });

  // Compartilha props do Text3D entre as camadas
  const text3dProps = {
    font: fontUrl,
    size,
    height,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize,
    bevelSegments: 3,
    letterSpacing,
  };

  return (
    <group ref={groupRef} position={position}>
      <Center>
        {/* Camada principal: vidro PBR */}
        <Text3D {...text3dProps}>
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

        {/* Ghost RED (chromatic aberration +X) */}
        <group ref={ghostRedRef}>
          <Text3D {...text3dProps}>
            {children}
            <meshBasicMaterial
              ref={ghostRedMatRef}
              color="#ff2030"
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </Text3D>
        </group>

        {/* Ghost CYAN (chromatic aberration -X) */}
        <group ref={ghostCyanRef}>
          <Text3D {...text3dProps}>
            {children}
            <meshBasicMaterial
              ref={ghostCyanMatRef}
              color="#00ffe5"
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </Text3D>
        </group>
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
