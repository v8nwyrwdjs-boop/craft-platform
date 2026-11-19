"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

type SceneProps = {
  progressRef: MutableRefObject<number>;
  invalidateRef: MutableRefObject<(() => void) | null>;
};

const PARTICLE_COUNT = 1800;

function createMorphData() {
  const binary = new Float32Array(PARTICLE_COUNT * 3);
  const monitor = new Float32Array(PARTICLE_COUNT * 3);
  const asset = new Float32Array(PARTICLE_COUNT * 3);
  const system = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const zero = [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1];
  const one = [0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1];
  let seed = 9173;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const offset = index * 3;
    const glyphIndex = Math.floor(index / 15);

    if (index < 300) {
      const pointIndex = index % 15;
      const row = Math.floor(pointIndex / 3);
      const column = pointIndex % 3;
      const pattern = glyphIndex % 2 === 0 ? zero : one;
      const visible = pattern[pointIndex] === 1;
      binary[offset] = (glyphIndex - 9.5) * 0.18 + (column - 1) * 0.035;
      binary[offset + 1] = (2 - row) * 0.055;
      binary[offset + 2] = (random() - 0.5) * 0.38 + (visible ? 0.08 : -0.4);
    } else {
      binary[offset] = (random() - 0.5) * 4.4;
      binary[offset + 1] = (random() - 0.5) * 2.7;
      binary[offset + 2] = (random() - 0.5) * 1.8;
    }

    const monitorPoint = index % 6;
    if (monitorPoint === 0) {
      const side = Math.floor(random() * 4);
      const t = random() * 2 - 1;
      monitor[offset] = side < 2 ? t * 1.48 : side === 2 ? -1.48 : 1.48;
      monitor[offset + 1] = side < 2 ? (side === 0 ? -0.83 : 0.83) : t * 0.83;
      monitor[offset + 2] = 0.12 + random() * 0.05;
    } else if (monitorPoint === 1) {
      monitor[offset] = (random() - 0.5) * 0.22;
      monitor[offset + 1] = -1.08 - random() * 0.38;
      monitor[offset + 2] = 0.08;
    } else if (monitorPoint === 2) {
      monitor[offset] = (random() - 0.5) * 0.92;
      monitor[offset + 1] = -1.48;
      monitor[offset + 2] = 0.08;
    } else {
      monitor[offset] = (random() - 0.5) * 2.72;
      monitor[offset + 1] = (random() - 0.5) * 1.4;
      monitor[offset + 2] = 0.05 + random() * 0.035;
    }

    const angle = random() * Math.PI * 2;
    if (index % 5 === 0) {
      asset[offset] = Math.cos(angle) * 0.98;
      asset[offset + 1] = Math.sin(angle) * 0.98;
      asset[offset + 2] = (random() - 0.5) * 0.26;
    } else {
      const radius = Math.sqrt(random()) * 0.9;
      asset[offset] = Math.cos(angle) * radius;
      asset[offset + 1] = Math.sin(angle) * radius;
      asset[offset + 2] = random() > 0.5 ? 0.13 : -0.13;
    }

    if (index % 9 === 0) {
      const nodeIndex = Math.floor(index / 9) % 8;
      const nodes = [
        [0, 1.3, 0], [1.08, 0.62, 0.16], [1.2, -0.42, 0.14], [0.12, -1.28, 0],
        [-1.08, -0.58, -0.12], [-1.2, 0.5, -0.1], [0.18, 0.05, 1.22], [-0.14, -0.05, -1.22],
      ];
      const node = nodes[nodeIndex];
      system[offset] = node[0] + (random() - 0.5) * 0.12;
      system[offset + 1] = node[1] + (random() - 0.5) * 0.12;
      system[offset + 2] = node[2] + (random() - 0.5) * 0.12;
    } else {
      const z = random() * 2 - 1;
      const theta = random() * Math.PI * 2;
      const radius = 1.25 + (random() - 0.5) * 0.1;
      const planar = Math.sqrt(1 - z * z);
      system[offset] = Math.cos(theta) * planar * radius;
      system[offset + 1] = z * radius;
      system[offset + 2] = Math.sin(theta) * planar * radius;
    }

    const accent = random() > 0.83;
    colors[offset] = accent ? 0.76 : 0.7 + random() * 0.18;
    colors[offset + 1] = accent ? 0.96 : 0.73 + random() * 0.18;
    colors[offset + 2] = accent ? 0.38 : 0.7 + random() * 0.2;
  }

  const nodes = [
    [0, 1.3, 0], [1.08, 0.62, 0.16], [1.2, -0.42, 0.14], [0.12, -1.28, 0],
    [-1.08, -0.58, -0.12], [-1.2, 0.5, -0.1], [0.18, 0.05, 1.22], [-0.14, -0.05, -1.22],
  ];
  const pairs = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6], [2, 6], [4, 7], [5, 7], [6, 7]];
  const linePositions = new Float32Array(pairs.length * 6);

  pairs.forEach(([from, to], index) => {
    linePositions.set(nodes[from], index * 6);
    linePositions.set(nodes[to], index * 6 + 3);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(binary, 3));
  geometry.setAttribute("aBinary", new THREE.BufferAttribute(binary, 3));
  geometry.setAttribute("aMonitor", new THREE.BufferAttribute(monitor, 3));
  geometry.setAttribute("aAsset", new THREE.BufferAttribute(asset, 3));
  geometry.setAttribute("aSystem", new THREE.BufferAttribute(system, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

  return { geometry, lineGeometry };
}

const particleVertexShader = [
  "attribute vec3 aBinary;",
  "attribute vec3 aMonitor;",
  "attribute vec3 aAsset;",
  "attribute vec3 aSystem;",
  "attribute vec3 aColor;",
  "uniform float uProgress;",
  "varying vec3 vColor;",
  "varying float vAlpha;",
  "void main() {",
  "  float stage = clamp(uProgress * 3.0, 0.0, 3.0);",
  "  float segment = fract(stage);",
  "  vec3 pointPosition;",
  "  if (stage < 1.0) { pointPosition = mix(aBinary, aMonitor, smoothstep(0.0, 1.0, segment)); }",
  "  else if (stage < 2.0) { pointPosition = mix(aMonitor, aAsset, smoothstep(0.0, 1.0, segment)); }",
  "  else if (stage < 3.0) { pointPosition = mix(aAsset, aSystem, smoothstep(0.0, 1.0, segment)); }",
  "  else { pointPosition = aSystem; }",
  "  vec4 viewPosition = modelViewMatrix * vec4(pointPosition, 1.0);",
  "  gl_Position = projectionMatrix * viewPosition;",
  "  gl_PointSize = clamp(3.2 * (6.5 / max(-viewPosition.z, 1.0)), 1.1, 4.6);",
  "  vColor = aColor;",
  "  vAlpha = 0.9;",
  "}",
].join("\n");

const particleFragmentShader = [
  "varying vec3 vColor;",
  "varying float vAlpha;",
  "void main() {",
  "  float distanceFromCenter = length(gl_PointCoord - vec2(0.5));",
  "  float softPoint = 1.0 - smoothstep(0.28, 0.5, distanceFromCenter);",
  "  if (softPoint < 0.02) discard;",
  "  gl_FragColor = vec4(vColor, softPoint * vAlpha);",
  "  #include <tonemapping_fragment>",
  "  #include <colorspace_fragment>",
  "}",
].join("\n");

const lineVertexShader = [
  "uniform float uProgress;",
  "varying float vAlpha;",
  "void main() {",
  "  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);",
  "  gl_Position = projectionMatrix * viewPosition;",
  "  vAlpha = smoothstep(0.68, 0.92, uProgress) * 0.55;",
  "}",
].join("\n");

const lineFragmentShader = [
  "varying float vAlpha;",
  "void main() {",
  "  gl_FragColor = vec4(0.72, 0.91, 0.45, vAlpha);",
  "  #include <tonemapping_fragment>",
  "  #include <colorspace_fragment>",
  "}",
].join("\n");

function MorphingParticles({ progressRef, invalidateRef }: SceneProps) {
  const invalidate = useThree((state) => state.invalidate);
  const particleMaterial = useRef<THREE.ShaderMaterial>(null);
  const lineMaterial = useRef<THREE.ShaderMaterial>(null);
  const data = useMemo(() => createMorphData(), []);
  const uniforms = useMemo(() => ({ uProgress: { value: 0 } }), []);

  useEffect(() => {
    invalidateRef.current = invalidate;
    invalidate();
    return () => {
      if (invalidateRef.current === invalidate) invalidateRef.current = null;
      data.geometry.dispose();
      data.lineGeometry.dispose();
    };
  }, [data, invalidate, invalidateRef]);

  useFrame((_, delta) => {
    const particle = particleMaterial.current;
    const lines = lineMaterial.current;
    if (!particle || !lines) return;
    const current = particle.uniforms.uProgress.value as number;
    const next = THREE.MathUtils.damp(current, progressRef.current, 7.5, delta);
    particle.uniforms.uProgress.value = next;
    lines.uniforms.uProgress.value = next;
    if (Math.abs(next - progressRef.current) > 0.0008) invalidate();
  });

  return (
    <group rotation={[0.04, -0.12, -0.035]}>
      <points geometry={data.geometry} frustumCulled={false}>
        <shaderMaterial
          ref={particleMaterial}
          uniforms={uniforms}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
          transparent
          depthWrite={false}
        />
      </points>
      <lineSegments geometry={data.lineGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={lineMaterial}
          uniforms={uniforms}
          vertexShader={lineVertexShader}
          fragmentShader={lineFragmentShader}
          transparent
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export function CraftScrollStoryScene({ progressRef, invalidateRef }: SceneProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.15]}
      camera={{ position: [0, 0, 6.5], fov: 36 }}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power", stencil: false }}
      fallback={<div className="craft-story-fallback" />}
    >
      <color attach="background" args={["#08090b"]} />
      <MorphingParticles progressRef={progressRef} invalidateRef={invalidateRef} />
    </Canvas>
  );
}
