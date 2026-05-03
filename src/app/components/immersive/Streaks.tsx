"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useImmersive } from "./store";

/**
 * SpeedStreaks — linhas finas alongadas no eixo Z que dao sensacao de velocidade
 * conforme a camera mergulha. Alpha modulado pela velocidade absoluta da camera.
 *
 * Usadas no Ato 1 (atravessamento) e suavizadas durante o vale.
 */
export function SpeedStreaks() {
  const reducedMotion = useImmersive((s) => s.reducedMotion);
  const ref = useRef<THREE.LineSegments>(null!);
  const matRef = useRef<THREE.LineBasicMaterial>(null!);
  const lastZ = useRef(20);

  const count = reducedMotion ? 60 : 220;

  const { positions } = useMemo(() => {
    const p = new Float32Array(count * 6); // 2 vertices por segmento
    for (let i = 0; i < count; i++) {
      // anel ao redor do eixo Z
      const theta = Math.random() * Math.PI * 2;
      const r = 6 + Math.random() * 18;
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;
      const z = -Math.random() * 280;
      const len = 4 + Math.random() * 8;
      p[i * 6 + 0] = x; p[i * 6 + 1] = y; p[i * 6 + 2] = z;
      p[i * 6 + 3] = x; p[i * 6 + 4] = y; p[i * 6 + 5] = z + len;
    }
    return { positions: p };
  }, [count]);

  useFrame((state) => {
    if (!ref.current || !matRef.current) return;
    const z = state.camera.position.z;
    const speed = Math.abs(z - lastZ.current);
    lastZ.current = z;
    // alpha cresce com velocidade; satura
    const target = Math.min(speed * 6.5, 0.85);
    const cur = matRef.current.opacity;
    matRef.current.opacity = cur + (target - cur) * 0.15;
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count * 2} array={positions} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={matRef}
        color="#c5cde8"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

/**
 * HorizonGodRays — cone luminoso fixo no Z distante, simulando god rays
 * vindos do abismo. Intensidade cresce conforme a camera se aproxima.
 */
export function HorizonGodRays() {
  const ref = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame((state) => {
    if (!matRef.current || !ref.current) return;
    const z = state.camera.position.z;
    // mais perto do abismo (z=-285), mais intenso
    const t = THREE.MathUtils.smoothstep(z, -50, -280);
    matRef.current.opacity = 0.05 + t * 0.4;
    ref.current.rotation.z = state.clock.elapsedTime * 0.05;
  });
  return (
    <mesh ref={ref} position={[0, 0, -290]} rotation={[0, 0, 0]}>
      <coneGeometry args={[14, 80, 64, 1, true]} />
      <meshBasicMaterial
        ref={matRef}
        color="#c5cde8"
        transparent
        opacity={0.05}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
