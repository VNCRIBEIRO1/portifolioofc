"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { CrystalShowcase } from "./CrystalShowcase";
import { CTAText3D, Manifesto3D } from "./Manifesto3D";
import { Hero3DText } from "./Hero3DText";
import { Post } from "./Post";
import { ScrollCamera } from "./ScrollCamera";
import { Bubbles, DepthTunnel } from "./Tunnel";
import { SpeedStreaks, HorizonGodRays } from "./Streaks";
import { useImmersive } from "./store";

export function Scene() {
  const { setReducedMotion, setViewport, reducedMotion } = useImmersive();

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // V4: NAO desligar imersivo so por largura — o gate principal vive em Immersive.tsx
    setReducedMotion(mqMotion.matches);

    const onResize = () => {
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight,
        dpr: Math.min(window.devicePixelRatio, 1.5),
      });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setReducedMotion, setViewport]);

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 20], fov: 55, near: 0.1, far: 320 }}
        style={{ background: "#03030c" }}
      >
        <color attach="background" args={["#03030c"]} />
        <fog attach="fog" args={["#01010a", 12, 90]} />

        <ambientLight intensity={0.4} color="#c5cde8" />
        <directionalLight position={[10, 20, 10]} intensity={0.7} color="#e8e8f0" />
        <directionalLight position={[-10, -10, -50]} intensity={0.4} color="#9ba3c4" />
        {/* God ray pontual no abismo */}
        <pointLight position={[0, 0, -290]} intensity={4} color="#c5cde8" distance={40} />

        <Suspense fallback={null}>
          <ScrollCamera />
          <DepthTunnel />
          {!reducedMotion && <Bubbles />}
          {!reducedMotion && <SpeedStreaks />}
          <HorizonGodRays />
          <Hero3DText />
          <Manifesto3D />
          <CrystalShowcase />
          <CTAText3D />
          <Post />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
