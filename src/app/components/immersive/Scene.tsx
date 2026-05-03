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
import { Cosmos } from "./Cosmos";
import { BlackHole } from "./BlackHole";
import { SpeedStreaks } from "./Streaks";
import { useImmersive } from "./store";

export function Scene() {
  const { setReducedMotion, setViewport, reducedMotion } = useImmersive();

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
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
        camera={{ position: [0, 0, 20], fov: 55, near: 0.1, far: 600 }}
        style={{ background: "#000005" }}
      >
        {/* Background cosmico profundo */}
        <color attach="background" args={["#000005"]} />
        {/* Fog mais distante para preservar estrelas/galaxias no horizonte */}
        <fog attach="fog" args={["#000005", 80, 320]} />

        {/* Iluminacao estelar — temperatura mista */}
        <ambientLight intensity={0.3} color="#9ba3c4" />
        <directionalLight position={[10, 20, 10]} intensity={0.5} color="#e8e8f0" />
        <directionalLight position={[-10, -10, -50]} intensity={0.35} color="#7a82a8" />
        {/* Pulso quente vindo do buraco negro */}
        <pointLight position={[0, 0, -290]} intensity={6} color="#ffd5b8" distance={120} decay={1.5} />

        <Suspense fallback={null}>
          <ScrollCamera />
          {/* AMBIENTE COSMICO */}
          <Cosmos />
          <BlackHole />
          {!reducedMotion && <SpeedStreaks />}
          {/* CONTEUDO */}
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
