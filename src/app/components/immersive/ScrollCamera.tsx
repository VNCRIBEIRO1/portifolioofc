"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CRYSTALS } from "./CrystalShowcase";
import { useImmersive } from "./store";

/**
 * ScrollCamera — Câmera Showcase: visita cada cristal um por um,
 * sempre olhando DIRETAMENTE para o cristal atual, seguindo o mesmo padrão
 * em todos. Holograma fica entre câmera e cristal (Billboard).
 *
 * Acts:
 *  - 0..0.10  hero approach (passa pelo gap PixelCode/Studio)
 *  - 0.10..0.22 manifesto (curva suave para o vault)
 *  - 0.22..0.88 vault — POSE-BASED: cada cristal ocupa um slot de progress;
 *               câmera interpola entre pose_i e pose_{i+1} olhando ao cristal.
 *  - 0.88..1.0  CTA / abismo
 *
 * Pose por cristal:
 *   - position = (c.offset.x * 0.55, c.offset.y * 0.35 + 0.6, c.z + DIST)
 *   - lookAt   = (c.offset.x,        c.offset.y,              c.z)
 *
 * Dolly (click): aproxima câmera mais perto do cristal/holograma com FOV reduzido,
 * de forma suave (cubic ease) e SUSTENTA enquanto openedCrystal == dolly.
 */

const POSE_DISTANCE = 11; // distância base do cristal durante scroll
const DOLLY_DISTANCE = 6.2; // distância no dolly (mockup ~80% viewport)
const FOV_BASE = 55;
const FOV_DOLLY = 32;

type Pose = {
  pos: THREE.Vector3;
  look: THREE.Vector3;
};

export function ScrollCamera() {
  const { camera } = useThree();

  const poses = useMemo<Pose[]>(() => {
    return CRYSTALS.map((c) => ({
      pos: new THREE.Vector3(c.offset[0] * 0.55, c.offset[1] * 0.35 + 0.6, c.z + POSE_DISTANCE),
      look: new THREE.Vector3(c.offset[0], c.offset[1], c.z),
    }));
  }, []);

  const entryPose = useMemo<Pose>(() => ({
    pos: new THREE.Vector3(0, 0, -75),
    look: new THREE.Vector3(0, 0, -85),
  }), []);
  const exitPose = useMemo<Pose>(() => ({
    pos: new THREE.Vector3(0, 0, -245),
    look: new THREE.Vector3(0, 0, -255),
  }), []);

  const targetPos = useRef(new THREE.Vector3(0, 0, 20));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const fovTarget = useRef(FOV_BASE);

  // Suaviza o dolly state — guarda inicio para ease cubico
  const dollyState = useRef<{ id: number; t: number } | null>(null);

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = FOV_BASE;
      camera.near = 0.1;
      camera.far = 600;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  /** Interpola pose entre A e B com alpha [0..1] (smoothstep). */
  const blendPose = (out: { pos: THREE.Vector3; look: THREE.Vector3 }, A: Pose, B: Pose, alpha: number) => {
    const a = THREE.MathUtils.smoothstep(alpha, 0, 1);
    out.pos.lerpVectors(A.pos, B.pos, a);
    out.look.lerpVectors(A.look, B.look, a);
  };

  const tmp = useMemo(() => ({ pos: new THREE.Vector3(), look: new THREE.Vector3() }), []);

  useFrame((_, delta) => {
    const p = useImmersive.getState().progress;
    const dolly = useImmersive.getState().dollyTarget;
    const opened = useImmersive.getState().openedCrystal;

    let basePos: THREE.Vector3;
    let baseLook: THREE.Vector3;
    let fovBase = FOV_BASE;

    if (p < 0.10) {
      // Hero approach — câmera entra do +z em direção ao manifesto
      const t = p / 0.10;
      tmp.pos.set(0, 0, THREE.MathUtils.lerp(20, -2, t));
      tmp.look.set(0, Math.sin((t - 0.5) * Math.PI) * 0.9, -10);
      basePos = tmp.pos.clone();
      baseLook = tmp.look.clone();
      fovBase = FOV_BASE + Math.sin(t * Math.PI) * 7;
    } else if (p < 0.22) {
      // Manifesto → entrada do vault
      const t = (p - 0.10) / 0.12;
      tmp.pos.set(
        Math.sin(t * Math.PI) * 0.6,
        Math.cos(t * Math.PI) * 0.4,
        THREE.MathUtils.lerp(-2, -75, t)
      );
      tmp.look.set(0, 0, THREE.MathUtils.lerp(-12, -85, t));
      basePos = tmp.pos.clone();
      baseLook = tmp.look.clone();
    } else if (p < 0.88) {
      // VAULT — interpola entre poses dos cristais
      const vt = (p - 0.22) / 0.66; // 0..1 ao longo do vault
      const N = poses.length;
      // Float index — começa no entry, passa pelas N poses, vai pro exit
      const totalSegments = N + 1; // entry→pose0, pose0→pose1, ..., poseN-1→exit
      const f = vt * totalSegments;
      const segIdx = Math.floor(f);
      const segT = f - segIdx;

      const A: Pose = segIdx === 0 ? entryPose : poses[Math.min(segIdx - 1, N - 1)];
      const B: Pose = segIdx >= N ? exitPose : poses[Math.min(segIdx, N - 1)];

      // Hold: 35% do segmento permanece NA pose alvo (B), 65% transitando.
      // Isso dá tempo do usuário absorver cada cristal antes do próximo.
      let alpha: number;
      if (segIdx === 0) {
        // Primeiro segmento: entrada acelerada (sem hold)
        alpha = segT;
      } else if (segIdx >= N) {
        // Saída
        alpha = segT;
      } else {
        // Hold no início (no cristal A) então transita rapidamente
        alpha = THREE.MathUtils.smoothstep(segT, 0.35, 1.0);
      }
      blendPose(tmp, A, B, alpha);
      basePos = tmp.pos.clone();
      baseLook = tmp.look.clone();
    } else {
      // Saída
      const t = (p - 0.88) / 0.12;
      tmp.pos.set(0, 0, THREE.MathUtils.lerp(-245, -285, t));
      tmp.look.set(0, 0, THREE.MathUtils.lerp(-255, -300, t));
      basePos = tmp.pos.clone();
      baseLook = tmp.look.clone();
    }

    // Dolly override (click no cristal): zoom suave em direção ao cristal/holograma
    if (dolly >= 0 && dolly < poses.length) {
      const c = CRYSTALS[dolly];
      if (!dollyState.current || dollyState.current.id !== dolly) {
        dollyState.current = { id: dolly, t: 0 };
      }
      dollyState.current.t += delta;
      const raw = Math.min(dollyState.current.t / 1.4, 1);
      const eased = 1 - Math.pow(1 - raw, 3); // cubic out

      const dollyPos = new THREE.Vector3(
        c.offset[0] * 0.4,
        c.offset[1] * 0.25 + 0.4,
        c.z + DOLLY_DISTANCE
      );
      const dollyLook = new THREE.Vector3(c.offset[0], c.offset[1], c.z);

      basePos.lerp(dollyPos, eased);
      baseLook.lerp(dollyLook, eased);
      fovBase = THREE.MathUtils.lerp(fovBase, FOV_DOLLY, eased);

      // Auto-reset apenas se o overlay NÃO está aberto neste cristal
      if (opened !== dolly && dollyState.current.t > 2.6) {
        useImmersive.getState().setDollyTarget(-1);
        dollyState.current = null;
      }
    } else {
      dollyState.current = null;
    }

    targetPos.current.copy(basePos);
    targetLook.current.copy(baseLook);
    fovTarget.current = fovBase;

    // Smooth lerp final
    camera.position.lerp(targetPos.current, 0.12);
    // LookAt suave — aplica matriz com vetor smoothado
    camera.lookAt(targetLook.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      const next = THREE.MathUtils.lerp(camera.fov, fovTarget.current, 0.10);
      if (Math.abs(next - camera.fov) > 0.05) {
        camera.fov = next;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
