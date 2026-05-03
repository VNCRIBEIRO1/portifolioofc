"use client";

/**
 * CrystalFragments.tsx
 *
 * Shatter + orbita + restauracao para um cristal.
 *
 * Modelo conceitual (do brief):
 *   1. Pedra solida (state inicial)
 *   2. Hover: a pedra se despedaça (fragmentos sobressaem da malha)
 *   3. Fragmentos orbitam o centro abrindo um espaco vazio
 *   4. Card holografico aparece no centro
 *   5. Unhover: fragmentos retornam mate maticamente, pedra restaura
 *
 * Como nao temos voronoi-fracture em tempo real no client (mesh-splitting
 * e caro/instavel), implementamos shatter PROCEDURAL via N pequenos
 * fragmentos sobrepostos a casca do cristal:
 *   - 14 fragmentos icosaedrais com tamanho/posicao/eixo aleatorios
 *     (seedados pelo slug → deterministico)
 *   - progress 0..1 controla:
 *       expansao radial (multiplicada por info.size * 1.6)
 *       rotacao em eixo proprio + orbita ao redor do centro
 *       jitter de noise no raio (organico)
 *   - acima de progress > 0.06, a malha original do cristal fica
 *     INVISIVEL (visible=false). Abaixo, fragmentos invisiveis.
 *     Resultado: nenhum "seam" aparente no estado solido.
 *
 * Hookup com CrystalShowcase: o componente recebe `progress` (0..1)
 * derivado de focusedCrystal/dolly/opened states e a `shellGroupRef`
 * do cristal (p/ ocultar a malha durante shatter).
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type FragSpec = {
  dir: THREE.Vector3;       // direcao radial unitaria
  axis: THREE.Vector3;      // eixo de rotacao proprio
  orbitAxis: THREE.Vector3; // eixo da orbita coletiva
  scale: number;            // escala individual
  spinSpeed: number;
  orbitSpeed: number;
  phase: number;            // offset temporal
  noiseFreq: number;        // ruido no raio
  rad: number;              // distancia base ao centro
};

function seededRand(slug: string, idx: number): () => number {
  // Mulberry32 com seed derivada do slug+idx — deterministico
  let h = 0;
  const s = `${slug}#${idx}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return function () {
    h = (h + 0x6D2B79F5) | 0;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FRAG_COUNT = 14;

type Props = {
  /** Slug do cristal (seed deterministico p/ posicoes dos fragmentos). */
  slug: string;
  /** Tamanho base do cristal — afeta escala + raio dos fragmentos. */
  size: number;
  /** Cor base p/ os fragmentos (combina com gemColor). */
  color: THREE.Color;
  /** Cor emissiva (acento) p/ glow nas bordas dos fragmentos. */
  emissive: THREE.Color;
  /** Ref ao group/scene da casca original — visible toggled durante shatter. */
  shellRef: React.RefObject<THREE.Object3D>;
  /** Funcao chamada a cada frame; retorna progress 0..1 (1 = totalmente quebrado). */
  getProgress: () => number;
};

export function CrystalFragments({
  slug,
  size,
  color,
  emissive,
  shellRef,
  getProgress,
}: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRefs = useRef<THREE.Mesh[]>([]);

  const specs = useMemo<FragSpec[]>(() => {
    const rand = seededRand(slug, 0);
    const arr: FragSpec[] = [];
    for (let i = 0; i < FRAG_COUNT; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(rand() * 2 - 1);
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );
      const axis = new THREE.Vector3(
        rand() - 0.5, rand() - 0.5, rand() - 0.5
      ).normalize();
      const orbitAxis = new THREE.Vector3(
        rand() - 0.5, rand() - 0.5 + 0.3, rand() - 0.5
      ).normalize();
      arr.push({
        dir,
        axis,
        orbitAxis,
        scale: size * (0.18 + rand() * 0.18),
        spinSpeed: 0.6 + rand() * 1.4,
        orbitSpeed: 0.18 + rand() * 0.32,
        phase: rand() * Math.PI * 2,
        noiseFreq: 0.5 + rand() * 1.4,
        rad: size * (0.7 + rand() * 0.4),
      });
    }
    return arr;
  }, [slug, size]);

  // Geometria compartilhada p/ todos os fragmentos
  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, 0);
    // Distorce levemente p/ cada um parecer "lascado" — aplicado por
    // mesh via scale unico. Aqui mantemos shape simples.
    return g;
  }, []);

  // Material PBR — recebe a luz da scene + emissive nas bordas
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color.clone(),
        emissive: emissive.clone(),
        emissiveIntensity: 0.4,
        roughness: 0.45,
        metalness: 0.25,
        transparent: true,
        opacity: 0,
      }),
    [color, emissive]
  );

  useFrame((state) => {
    const p = THREE.MathUtils.clamp(getProgress(), 0, 1);
    const t = state.clock.elapsedTime;

    // Toggle visibilidade da casca original (zero seams no estado solido)
    if (shellRef.current) {
      shellRef.current.visible = p < 0.06;
    }

    // Material opacity ramp + suaviza pulse de emissive
    material.opacity = THREE.MathUtils.smoothstep(p, 0.04, 0.5);
    material.emissiveIntensity = 0.35 + p * 1.1;

    if (!groupRef.current) return;
    groupRef.current.visible = p > 0.001;

    for (let i = 0; i < specs.length; i++) {
      const m = meshRefs.current[i];
      if (!m) continue;
      const s = specs[i];

      // Distancia radial: 0 (encolhido no centro) → s.rad * 1.6 (orbita)
      const expand = THREE.MathUtils.smoothstep(p, 0, 0.45);
      const orbit = THREE.MathUtils.smoothstep(p, 0.35, 1);

      const baseR = s.rad * (0.05 + 1.55 * expand);
      // Ruido organico no raio (nao parecer mecanico)
      const noise = Math.sin(t * s.noiseFreq + s.phase) * 0.18 * orbit;
      const r = baseR + noise * s.rad;

      // Direcao: rotaciona em torno de orbitAxis para dar sensacao de orbita
      const angle = orbit * (t * s.orbitSpeed + s.phase);
      const dir = s.dir.clone().applyAxisAngle(s.orbitAxis, angle);
      m.position.copy(dir.multiplyScalar(r));

      // Spin proprio
      m.rotation.x += 0.012 * s.spinSpeed * (0.5 + p);
      m.rotation.y += 0.014 * s.spinSpeed * (0.5 + p);

      // Escala: cresce com expand, encolhe perto do centro no estado solido
      const sc = s.scale * (0.4 + 0.6 * expand);
      m.scale.setScalar(sc);
    }
  });

  return (
    <group ref={groupRef}>
      {specs.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
          geometry={geo}
          material={material}
          castShadow={false}
        />
      ))}
    </group>
  );
}
