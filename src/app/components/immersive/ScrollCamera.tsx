"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CRYSTALS } from "./CrystalShowcase";
import { useImmersive } from "./store";

/**
 * Câmera amarrada ao scroll progress (0..1).
 * Mergulho em Z: começa em z=20 → desce até z=-285.
 *  - 0..0.10  hero approach (passa entre PixelCode e Studio)
 *  - 0.10..0.22 manifesto
 *  - 0.22..0.88 vale dos cristais (sinuoso x/y)
 *  - 0.88..1.0  CTA + abismo
 *
 * Dolly zoom on click: setDollyTarget(i) → câmera vai pra ~5u atrás do cristal,
 * FOV reduz, então retorna após ~1.8s.
 */
export function ScrollCamera() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 20));
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const fovTarget = useRef(55);
  const dollyState = useRef<{ id: number; t: number } | null>(null);
  const lookOverride = useRef(new THREE.Vector3());
  const lookActive = useRef(false);

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 55;
      camera.near = 0.1;
      camera.far = 600;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  useFrame((_, delta) => {
    const p = useImmersive.getState().progress;
    const dolly = useImmersive.getState().dollyTarget;

    let z = 20;
    let x = 0;
    let y = 0;
    // V4: pitch dinamico no ato 1 — camera entra olhando levemente pra baixo,
    // depois sobe a mira: cria sensacao de atravessar o GAP entre PixelCode/Studio
    let lookY = 0;
    let fovBase = 55;

    if (p < 0.10) {
      const t = p / 0.10;
      z = THREE.MathUtils.lerp(20, -2, t);
      // Pitch: mira comeca em -0.6 (texto top), atravessa pelo gap em t=0.5,
      // termina apontando ligeiramente abaixo (-0.4) ja olhando o tunel
      lookY = Math.sin((t - 0.5) * Math.PI) * 0.9;
      // FOV pump: 55 -> 62 no atravessamento -> 55
      fovBase = 55 + Math.sin(t * Math.PI) * 7;
    } else if (p < 0.22) {
      const t = (p - 0.10) / 0.12;
      z = THREE.MathUtils.lerp(-2, -75, t);
      x = Math.sin(t * Math.PI) * 0.6;
      y = Math.cos(t * Math.PI) * 0.4;
    } else if (p < 0.88) {
      const t = (p - 0.22) / 0.66;
      z = THREE.MathUtils.lerp(-75, -245, t);
      x = Math.sin(t * Math.PI * 3.5) * 1.2;
      y = Math.cos(t * Math.PI * 2.5) * 0.6;
    } else {
      const t = (p - 0.88) / 0.12;
      z = THREE.MathUtils.lerp(-245, -285, t);
    }

    target.current.set(x, y, z);
    fovTarget.current = fovBase;

    if (dolly >= 0) {
      const c = CRYSTALS[dolly];
      if (c) {
        if (!dollyState.current || dollyState.current.id !== dolly) {
          dollyState.current = { id: dolly, t: 0 };
        }
        dollyState.current.t += delta;
        // Hold time: 2.5s total (1.0s in, 1.0s hold, 0.5s ease)
        const dt = Math.min(dollyState.current.t / 1.0, 1);
        const eased = 1 - Math.pow(1 - dt, 3);
        // Posicao FRONTAL ao cristal: +8 unidades em Z (cristal esta em c.z, camera em c.z + 8)
        // Eixo X/Y centrado no cristal (offset)
        target.current.set(
          THREE.MathUtils.lerp(x, c.offset[0], eased),
          THREE.MathUtils.lerp(y, c.offset[1], eased),
          THREE.MathUtils.lerp(z, c.z + 8, eased)
        );
        // FOV: zoom dolly de 55 para 24 (mais cinematografico)
        fovTarget.current = THREE.MathUtils.lerp(55, 24, eased);
        // Mira direta no cristal (override do lookY normal)
        lookOverride.current.copy(new THREE.Vector3(c.offset[0], c.offset[1], c.z));
        lookActive.current = true;

        if (dollyState.current.t > 2.5) {
          useImmersive.getState().setDollyTarget(-1);
          dollyState.current = null;
          lookActive.current = false;
        }
      }
    } else {
      dollyState.current = null;
      lookActive.current = false;
    }

    camera.position.lerp(target.current, 0.10);

    if (lookActive.current) {
      // Dolly: mira direta no cristal
      lookAt.current.lerp(lookOverride.current, 0.15);
    } else {
      lookAt.current.set(
        target.current.x * 0.5,
        target.current.y * 0.5 + lookY,
        target.current.z - 8
      );
    }
    camera.lookAt(lookAt.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      const next = THREE.MathUtils.lerp(camera.fov, fovTarget.current, 0.08);
      if (Math.abs(next - camera.fov) > 0.05) {
        camera.fov = next;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
