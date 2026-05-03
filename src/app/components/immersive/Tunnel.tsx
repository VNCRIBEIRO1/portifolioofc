"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useImmersive } from "./store";

/** Vertex/Fragment shaders compartilhados para chão e teto. */
const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vWave;

  vec3 gerstner(vec2 pos, vec2 dir, float steepness, float wavelength, float t, inout vec3 tangent, inout vec3 binormal) {
    float k = 6.28318 / wavelength;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(dir);
    float f = k * (dot(d, pos) - c * t);
    float a = steepness / k;
    tangent += vec3(-d.x*d.x*(steepness*sin(f)), d.x*(steepness*cos(f)), -d.x*d.y*(steepness*sin(f)));
    binormal += vec3(-d.x*d.y*(steepness*sin(f)), d.y*(steepness*cos(f)), -d.y*d.y*(steepness*sin(f)));
    return vec3(d.x*a*cos(f), a*sin(f), d.y*a*cos(f));
  }

  void main() {
    vec3 pos = position;
    vec3 t1 = vec3(1.0,0.0,0.0);
    vec3 b1 = vec3(0.0,0.0,1.0);
    pos += gerstner(position.xz, vec2(1.0,0.4), 0.10, 14.0, uTime, t1, b1);
    pos += gerstner(position.xz, vec2(-0.6,1.0), 0.06, 7.0, uTime, t1, b1);
    vNormal = normalize(cross(b1, t1));
    vWave = pos.y;
    vec4 wp = modelMatrix * vec4(pos,1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorBase;
  uniform vec3 uColorRipple;
  uniform vec3 uColorGlow;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vWave;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - clamp(dot(viewDir, vNormal), 0.0, 1.0), 2.0);
    vec3 col = mix(uColorBase, uColorRipple, fresnel);
    float t = uTime * 0.18;
    vec2 uv = vWorldPos.xz * 0.04;
    float c = sin(uv.x + t) * cos(uv.y - t * 0.7) + sin(uv.x * 1.7 - t * 0.5) * cos(uv.y * 1.3 + t * 0.4);
    c = smoothstep(0.5, 1.4, abs(c));
    col += uColorGlow * c * 0.18;
    float crest = smoothstep(0.05, 0.4, vWave);
    col += uColorGlow * crest * 0.18;
    float distFog = smoothstep(20.0, 130.0, length(vWorldPos - cameraPosition));
    col = mix(col, uColorBase * 0.2, distFog);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function useDepthMaterial() {
  const reducedMotion = useImmersive((s) => s.reducedMotion);
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const segments = reducedMotion ? 32 : 96;
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorBase: { value: new THREE.Color("#03030c") },
      uColorRipple: { value: new THREE.Color("#4a5375") },
      uColorGlow: { value: new THREE.Color("#c5cde8") },
    }),
    []
  );
  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return { matRef, segments, uniforms };
}

/** Túnel: chão líquido + teto líquido formando um corredor de mergulho. */
export function DepthTunnel() {
  const floor = useDepthMaterial();
  const ceil = useDepthMaterial();

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, -130]}>
        <planeGeometry args={[160, 540, floor.segments, floor.segments]} />
        <shaderMaterial
          ref={floor.matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={floor.uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 14, -130]}>
        <planeGeometry args={[160, 540, ceil.segments, ceil.segments]} />
        <shaderMaterial
          ref={ceil.matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={ceil.uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

/** Partículas-bolha distribuídas no túnel (sobem). */
export function Bubbles() {
  const reducedMotion = useImmersive((s) => s.reducedMotion);
  const ref = useRef<THREE.Points>(null!);
  const count = reducedMotion ? 200 : 1200;

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = -10 + Math.random() * 22;
      positions[i * 3 + 2] = -20 - Math.random() * 280;
      speeds[i] = 0.04 + Math.random() * 0.10;
    }
    return { positions, speeds };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i];
      if (arr[i * 3 + 1] > 14) {
        arr[i * 3 + 1] = -10;
        arr[i * 3 + 0] = (Math.random() - 0.5) * 60;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#c5cde8" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}
