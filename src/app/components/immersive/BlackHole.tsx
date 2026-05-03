"use client";

/**
 * BlackHole.tsx — Buraco negro com disco de acrescimento e lente gravitacional.
 *
 * Camadas:
 *   1. Event Horizon  — esfera totalmente preta (occluder)
 *   2. Photon Ring    — anel fino brilhante exatamente na borda do horizonte
 *   3. Accretion Disk — disco rotativo com shader de plasma (Doppler beaming)
 *   4. Gravitational Lens — esfera maior com Fresnel intenso simulando lensing
 *   5. Halo           — billboard com flare radial soft
 *
 * Posicao: fundo do abismo z=-300 (substitui HorizonGodRays).
 * Reduce motion: simplifica disco, remove halo.
 */

import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useImmersive } from "./store";

const accretionVS = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const accretionFS = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  // Hash + noise rapido
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    // UV polar: u = angulo, v = raio (geometria ringGeometry)
    vec2 uv = vUv;
    float r = uv.y;             // 0 = borda interna, 1 = borda externa
    float theta = uv.x;          // 0..1

    // Plasma rotativo + radial bands
    float spin = uTime * 0.18;
    float band = fbm(vec2(theta * 30.0 + spin * 6.0, r * 8.0)) ;
    float swirl = fbm(vec2(theta * 8.0 + spin, r * 3.0 - spin * 2.0));
    float plasma = pow(band * 0.6 + swirl * 0.6, 1.5);

    // Doppler beaming: lado se aproximando (theta ~ 0.25) mais brilhante
    float doppler = 0.5 + 0.5 * cos((theta - 0.25) * 6.2831);
    doppler = mix(0.5, 1.6, doppler);

    // Brilho radial: maximo na borda interna, decai
    float radial = pow(1.0 - r, 1.4);

    // Cor: laranja quente perto -> branco -> azul-violeta longe
    vec3 hot = vec3(1.0, 0.55, 0.18);
    vec3 white = vec3(1.0, 0.95, 0.85);
    vec3 cool = vec3(0.62, 0.7, 0.95);
    vec3 col = mix(hot, white, smoothstep(0.0, 0.35, r));
    col = mix(col, cool, smoothstep(0.55, 1.0, r));

    float intensity = plasma * radial * doppler * 1.8;
    float alpha = smoothstep(0.0, 0.1, r) * smoothstep(1.0, 0.85, r) * intensity;
    gl_FragColor = vec4(col * intensity, alpha);
    if (gl_FragColor.a < 0.01) discard;
  }
`;

const lensVS = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const lensFS = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fres = pow(1.0 - clamp(dot(viewDir, vNormal), 0.0, 1.0), 3.0);
    vec3 col = mix(vec3(0.05, 0.07, 0.18), vec3(0.9, 0.85, 1.0), fres);
    float ring = smoothstep(0.85, 1.0, fres);
    col += vec3(1.0, 0.9, 0.7) * ring * 0.6;
    float a = fres * 0.5 + ring * 0.6;
    gl_FragColor = vec4(col, a);
  }
`;

export function BlackHole() {
  const reducedMotion = useImmersive((s) => s.reducedMotion);
  const groupRef = useRef<THREE.Group>(null!);
  const diskMatRef = useRef<THREE.ShaderMaterial>(null!);
  const lensMatRef = useRef<THREE.ShaderMaterial>(null!);
  const haloMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const groupVis = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (diskMatRef.current) diskMatRef.current.uniforms.uTime.value = t;
    if (lensMatRef.current) lensMatRef.current.uniforms.uTime.value = t;

    // Visibilidade cresce conforme camera mergulha (z=-50 -> z=-280)
    const camZ = state.camera.position.z;
    const target = THREE.MathUtils.smoothstep(camZ, -40, -260);
    groupVis.current = THREE.MathUtils.lerp(groupVis.current, target, 0.05);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(Math.max(0.001, groupVis.current));
      // Rotacao lenta no eixo Y para mostrar o disco
      groupRef.current.rotation.z = t * 0.04;
    }
    if (haloMatRef.current) {
      haloMatRef.current.opacity = 0.45 * groupVis.current;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -300]} rotation={[Math.PI * 0.32, 0, 0]} scale={0.001}>
      {/* Event horizon: esfera totalmente preta */}
      <mesh>
        <sphereGeometry args={[6, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Photon ring fino na borda */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.05, 6.4, 128, 1]} />
        <meshBasicMaterial color="#fff5e0" side={THREE.DoubleSide} transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Accretion disk: shader plasma */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.5, 22, reducedMotion ? 96 : 256, 1]} />
        <shaderMaterial
          ref={diskMatRef}
          vertexShader={accretionVS}
          fragmentShader={accretionFS}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>

      {/* Disco secundario inclinado para volume */}
      {!reducedMotion && (
        <mesh rotation={[Math.PI / 2, 0, 0.15]} scale={[1.02, 1.02, 1.02]}>
          <ringGeometry args={[6.6, 20, 192, 1]} />
          <shaderMaterial
            vertexShader={accretionVS}
            fragmentShader={accretionFS}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            uniforms={{ uTime: { value: 0 } }}
          />
        </mesh>
      )}

      {/* Gravitational lens: esfera maior com Fresnel */}
      <mesh>
        <sphereGeometry args={[8.5, 64, 64]} />
        <shaderMaterial
          ref={lensMatRef}
          vertexShader={lensVS}
          fragmentShader={lensFS}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>

      {/* Halo billboard externo (flare radial) */}
      {!reducedMotion && (
        <Billboard>
          <mesh>
            <planeGeometry args={[60, 60]} />
            <meshBasicMaterial
              ref={haloMatRef}
              color="#c5cde8"
              transparent
              opacity={0.0}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              map={makeRadialFlareTexture()}
            />
          </mesh>
        </Billboard>
      )}
    </group>
  );
}

// Cache de textura radial para o flare
let _flareTex: THREE.CanvasTexture | null = null;
function makeRadialFlareTexture(): THREE.CanvasTexture {
  if (_flareTex) return _flareTex;
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture(new Image());
  }
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(255, 245, 224, 0.9)");
  grad.addColorStop(0.15, "rgba(255, 220, 180, 0.55)");
  grad.addColorStop(0.4, "rgba(155, 163, 196, 0.18)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  _flareTex = new THREE.CanvasTexture(c);
  _flareTex.colorSpace = THREE.SRGBColorSpace;
  _flareTex.needsUpdate = true;
  return _flareTex;
}
