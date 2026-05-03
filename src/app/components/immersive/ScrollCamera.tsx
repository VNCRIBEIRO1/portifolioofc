"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CRYSTALS } from "./CrystalShowcase";
import { useImmersive } from "./store";

/**
 * ScrollCamera — Zoom seguidor que serpenteia pelos cristais.
 *
 * - 0..0.10  hero approach (passa pelo gap PixelCode/Studio)
 * - 0.10..0.22 manifesto
 * - 0.22..0.88 vault — CatmullRomCurve3 com waypoints contornando cada cristal
 *               (X oposto ao offset), criando "S" entre eles.
 * - 0.88..1.0  CTA / abismo
 *
 * Dolly: setDollyTarget(i) → camera para FRENTE do cristal (+8z, FOV 24).
 *  Hold 2.5s. Se openedCrystal == dolly, dolly fica travado (nao retorna).
 */
export function ScrollCamera() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 20));
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const fovTarget = useRef(55);
  const dollyState = useRef<{ id: number; t: number } | null>(null);
  const lookOverride = useRef(new THREE.Vector3());
  const lookActive = useRef(false);

  // Curva pelo vault — contorna cada cristal pelo X OPOSTO ao seu offset,
  // criando movimento serpentino S entre eles.
  const vaultCurve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    points.push(new THREE.Vector3(0, 0, -75)); // entrada
    CRYSTALS.forEach((c) => {
      // Approach: passa pelo lado oposto antes de chegar no cristal
      const approachX = -c.offset[0] * 0.55;
      const approachY = -c.offset[1] * 0.4;
      points.push(new THREE.Vector3(approachX, approachY, c.z + 6));
      // Pass-by: ligeiramente atras do cristal, ainda com X oposto
      points.push(new THREE.Vector3(-c.offset[0] * 0.2, -c.offset[1] * 0.2, c.z - 1));
    });
    points.push(new THREE.Vector3(0, 0, -245)); // saida
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  }, []);

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
    const opened = useImmersive.getState().openedCrystal;

    const pos = new THREE.Vector3(0, 0, 20);
    let lookY = 0;
    let fovBase = 55;

    if (p < 0.10) {
      const t = p / 0.10;
      pos.set(0, 0, THREE.MathUtils.lerp(20, -2, t));
      lookY = Math.sin((t - 0.5) * Math.PI) * 0.9;
      fovBase = 55 + Math.sin(t * Math.PI) * 7;
    } else if (p < 0.22) {
      const t = (p - 0.10) / 0.12;
      pos.set(
        Math.sin(t * Math.PI) * 0.6,
        Math.cos(t * Math.PI) * 0.4,
        THREE.MathUtils.lerp(-2, -75, t)
      );
    } else if (p < 0.88) {
      const t = (p - 0.22) / 0.66;
      const cv = vaultCurve.getPoint(t);
      pos.copy(cv);
    } else {
      const t = (p - 0.88) / 0.12;
      pos.set(0, 0, THREE.MathUtils.lerp(-245, -285, t));
    }

    target.current.copy(pos);
    fovTarget.current = fovBase;

    // Olhar adiante na curva — camera olha para onde VAI
    const lookAtScroll = new THREE.Vector3();
    if (p >= 0.22 && p < 0.88) {
      const t = (p - 0.22) / 0.66;
      const tAhead = Math.min(0.999, t + 0.04);
      lookAtScroll.copy(vaultCurve.getPoint(tAhead));
    } else {
      lookAtScroll.set(target.current.x * 0.5, target.current.y * 0.5 + lookY, target.current.z - 8);
    }

    // Dolly override
    if (dolly >= 0) {
      const c = CRYSTALS[dolly];
      if (c) {
        if (!dollyState.current || dollyState.current.id !== dolly) {
          dollyState.current = { id: dolly, t: 0 };
        }
        dollyState.current.t += delta;
        const dt = Math.min(dollyState.current.t / 1.0, 1);
        const eased = 1 - Math.pow(1 - dt, 3);
        target.current.set(
          THREE.MathUtils.lerp(target.current.x, c.offset[0], eased),
          THREE.MathUtils.lerp(target.current.y, c.offset[1], eased),
          THREE.MathUtils.lerp(target.current.z, c.z + 8, eased)
        );
        fovTarget.current = THREE.MathUtils.lerp(55, 24, eased);
        lookOverride.current.set(c.offset[0], c.offset[1], c.z);
        lookActive.current = true;

        // Se overlay aberto, MANTEM dolly travado (nao reseta automaticamente)
        if (opened !== dolly && dollyState.current.t > 2.5) {
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
      lookAt.current.lerp(lookOverride.current, 0.15);
    } else {
      lookAt.current.lerp(lookAtScroll, 0.10);
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
