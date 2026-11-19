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


function PhysicalProductObjects({ progressRef, invalidateRef }: SceneProps) {
  const invalidate = useThree((state) => state.invalidate);
  const monitor = useRef<THREE.Group>(null);
  const coin = useRef<THREE.Group>(null);
  const ecosystem = useRef<THREE.Group>(null);
  const monitorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#171a1d", metalness: 0.88, roughness: 0.24 }), []);
  const screenMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#101820", metalness: 0.35, roughness: 0.18, emissive: "#172a2c", emissiveIntensity: 0.55 }), []);
  const silver = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c7cbd0", metalness: 0.96, roughness: 0.2 }), []);
  const lime = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c8f169", metalness: 0.62, roughness: 0.24, emissive: "#789c37", emissiveIntensity: 0.28 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#24292c", metalness: 0.92, roughness: 0.26 }), []);

  useEffect(() => () => {
    monitorMaterial.dispose(); screenMaterial.dispose(); silver.dispose(); lime.dispose(); dark.dispose();
  }, [monitorMaterial, screenMaterial, silver, lime, dark]);

  useFrame((_, delta) => {
    const stage = THREE.MathUtils.clamp(progressRef.current * 3, 0, 3);
    const reveal = (start: number, end: number) => THREE.MathUtils.smoothstep(stage, start, end);
    const setScale = (group: THREE.Group | null, amount: number) => {
      if (!group) return false;
      const target = THREE.MathUtils.clamp(amount, 0, 1);
      const next = THREE.MathUtils.damp(group.scale.x, target, 9, delta);
      group.scale.setScalar(next);
      group.visible = next > 0.008;
      return Math.abs(target - next) > 0.001;
    };
    const monitorTarget = reveal(0.62, 1.12) * (1 - reveal(1.18, 1.48));
    const coinTarget = reveal(1.62, 2.08) * (1 - reveal(2.18, 2.48));
    const ecosystemTarget = reveal(2.55, 2.96);
    const monitorMoving = setScale(monitor.current, monitorTarget);
    const coinMoving = setScale(coin.current, coinTarget);
    const ecosystemMoving = setScale(ecosystem.current, ecosystemTarget);
    const transitioning = monitorMoving || coinMoving || ecosystemMoving;
    if (monitor.current) monitor.current.rotation.y = THREE.MathUtils.damp(monitor.current.rotation.y, -0.16, 3, delta);
    if (coin.current && coinTarget > 0.02) coin.current.rotation.y += delta * 0.12;
    if (ecosystem.current && ecosystemTarget > 0.02) ecosystem.current.rotation.y += delta * 0.045;
    if (transitioning || coinTarget > 0.02 || ecosystemTarget > 0.02) invalidate();
  });

  return (
    <>
      <group ref={monitor} position={[0, 0, 0.18]} scale={0.001}>
        <mesh position={[0, 0.12, 0]} material={monitorMaterial}><boxGeometry args={[3.2, 2.02, 0.18]} /></mesh>
        <mesh position={[0, 0.12, 0.101]} material={screenMaterial}><planeGeometry args={[2.94, 1.76]} /></mesh>
        <mesh position={[0, -1.08, -0.02]} material={silver}><boxGeometry args={[0.2, 0.42, 0.16]} /></mesh>
        <mesh position={[0, -1.32, 0.02]} material={dark}><boxGeometry args={[1.16, 0.1, 0.62]} /></mesh>
        <mesh position={[0, 0.12, 0.115]} material={lime}><boxGeometry args={[0.44, 0.018, 0.012]} /></mesh>
      </group>
      <group ref={coin} position={[0, 0, 0.12]} scale={0.001}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={silver}><cylinderGeometry args={[1.12, 1.12, 0.2, 96]} /></mesh>
        <mesh material={lime}><torusGeometry args={[0.91, 0.025, 12, 96]} /></mesh>
        <mesh position={[0, 0, 0.13]} material={silver}><torusGeometry args={[0.25, 0.055, 16, 48]} /></mesh>
        <mesh position={[0, 0, 0.13]} material={silver}><boxGeometry args={[0.12, 0.58, 0.055]} /></mesh>
      </group>
      <group ref={ecosystem} position={[0, 0, 0]} scale={0.001}>
        <mesh material={dark}><icosahedronGeometry args={[0.7, 2]} /></mesh>
        <mesh rotation={[0.4, 0.2, 0.1]} material={lime}><torusGeometry args={[1.18, 0.012, 8, 128]} /></mesh>
        <mesh rotation={[1.1, 0.7, 0.4]} material={silver}><torusGeometry args={[1.42, 0.009, 8, 128]} /></mesh>
        {([[0,1.3,0],[1.08,0.62,0.16],[1.2,-0.42,0.14],[0.12,-1.28,0],[-1.08,-0.58,-0.12],[-1.2,0.5,-0.1],[0.18,0.05,1.22],[-0.14,-0.05,-1.22]] as const).map(([x,y,z], index) => (
          <mesh key={index} position={[x,y,z]} material={index % 3 === 0 ? lime : silver}>
            <sphereGeometry args={[index % 3 === 0 ? 0.09 : 0.055, 20, 20]} />
          </mesh>
        ))}
      </group>
    </>
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
      <ambientLight intensity={0.72} />
      <directionalLight position={[3, 4, 5]} intensity={2.1} color="#ffffff" />
      <pointLight position={[-3, -2, 2]} intensity={9} distance={8} color="#c8f169" />
      <MorphingParticles progressRef={progressRef} invalidateRef={invalidateRef} />
      <PhysicalProductObjects progressRef={progressRef} invalidateRef={invalidateRef} />
    </Canvas>
  );
}
