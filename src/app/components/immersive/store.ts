"use client";

import { create } from "zustand";

export type ImmersiveState = {
  /** 0..1 scroll global */
  progress: number;
  /** ato corrente (0..3) */
  act: number;
  /** índice do crystal em foco (hover) (-1 = nenhum) */
  focusedCrystal: number;
  /** crystal selecionado para dolly zoom (-1 = nenhum) */
  dollyTarget: number;
  /** crystal aberto em modo card (mockup full) (-1 = nenhum) */
  openedCrystal: number;
  /** modo simplificado (mobile / reduced-motion) */
  reducedMotion: boolean;
  viewport: { w: number; h: number; dpr: number };
  setProgress: (v: number) => void;
  setFocusedCrystal: (i: number) => void;
  setDollyTarget: (i: number) => void;
  setOpenedCrystal: (i: number) => void;
  setReducedMotion: (v: boolean) => void;
  setViewport: (v: { w: number; h: number; dpr: number }) => void;
};

export const useImmersive = create<ImmersiveState>((set) => ({
  progress: 0,
  act: 0,
  focusedCrystal: -1,
  dollyTarget: -1,
  openedCrystal: -1,
  reducedMotion: false,
  viewport: { w: 1920, h: 1080, dpr: 1 },
  setProgress: (progress) => set({ progress, act: actFromProgress(progress) }),
  setFocusedCrystal: (focusedCrystal) => set({ focusedCrystal }),
  setDollyTarget: (dollyTarget) => set({ dollyTarget }),
  setOpenedCrystal: (openedCrystal) => set({ openedCrystal }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setViewport: (viewport) => set({ viewport }),
}));

function actFromProgress(p: number) {
  if (p < 0.12) return 0;
  if (p < 0.22) return 1;
  if (p < 0.88) return 2;
  return 3;
}
