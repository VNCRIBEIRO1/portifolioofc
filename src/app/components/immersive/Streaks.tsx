"use client";

/**
 * Streaks.tsx — Warp drive cosmico.
 *
 * Linhas finas alongadas em Z dao sensacao de hyperspace. Cada linha tem
 * um gradiente alpha (vertice traseiro fade) via vertex colors + LineBasicMaterial.
 * Comprimento e densidade reagem a velocidade da camera.
 *
 * NOTE: HorizonGodRays foi removido — substituido por BlackHole.tsx.
 */

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useImmersive } from "./store";

export function SpeedStreaks() {
  const reducedMotion = useImmersive((s) => s.reducedMotion);
  const ref = useRef<THREE.LineSegments>(null!);
  const matRef = useRef<THREE.LineBasicMaterial>(null!);
  const lastZ = useRef(20);

  const count = reducedMotion ? 90 : 320;

  const { positions, colors } = useMemo(() => {
    const p = new Float32Array(count * 6);
    const c = new Float32Array(count * 6);
    const front = new THREE.Color("#fff5e0");
    const back = new THREE.Color("#9ba3c4");
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 4 + Math.pow(Math.random(), 1.5) * 24;
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;
      const z = -Math.random() * 280 + 20;
      const len = 6 + Math.random() * 14;
      p[i * 6 + 0] = x; p[i * 6 + 1] = y; p[i * 6 + 2] = z;
      p[i * 6 + 3] = x; p[i * 6 + 4] = y; p[i * 6 + 5] = z + len;
      c[i * 6 + 0] = front.r; c[i * 6 + 1] = front.g; c[i * 6 + 2] = front.b;
      c[i * 6 + 3] = back.r; c[i * 6 + 4] = back.g; c[i * 6 + 5] = back.b;
    }
    return { positions: p, colors: c };
  }, [count]);

  useFrame((state) => {
    if (!ref.current || !matRef.current) return;
    const z = state.camera.position.z;
    const speed = Math.abs(z - lastZ.current);
    lastZ.current = z;
    const target = Math.min(speed * 7.0, 0.95);
    const cur = matRef.current.opacity;
    matRef.current.opacity = cur + (target - cur) * 0.15;
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count * 2} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count * 2} array={colors} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={matRef}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
