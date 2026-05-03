"use client";

import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useRef } from "react";
import { Vector2 } from "three";
import { useImmersive } from "./store";
import { glitchClock } from "./glitch";

export function Post() {
  const reducedMotion = useImmersive((s) => s.reducedMotion);
  const offsetRef = useRef(new Vector2(0.0008, 0.0008));

  // Chromatic aberration pulse durante glitch
  useEffect(() => {
    return glitchClock.subscribe((v) => {
      const base = 0.0008;
      offsetRef.current.set(base + v * 0.012, base + v * 0.012);
    });
  }, []);

  if (reducedMotion) return null;

  return (
    <EffectComposer multisampling={2}>
      <Bloom intensity={0.7} luminanceThreshold={0.72} luminanceSmoothing={0.4} mipmapBlur />
      <ChromaticAberration
        offset={offsetRef.current}
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.25} darkness={0.75} />
    </EffectComposer>
  );
}
