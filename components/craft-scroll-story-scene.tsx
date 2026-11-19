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

function createCoinSurfaceTexture() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  let seed = 48271;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const fineGrain = (random() - 0.5) * 42;
      const brushedGrain = Math.sin(y * 0.44 + x * 0.012) * 7;
      const hairline = ((x * 17 + y * 31) % 127 === 0) ? -24 : 0;
      const value = THREE.MathUtils.clamp(190 + fineGrain + brushedGrain + hairline, 112, 244);
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
      data[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function createCoinBodyGeometry() {
  const geometry = new THREE.CylinderGeometry(1.12, 1.12, 0.2, 384, 1, false);
  const positions = geometry.getAttribute("position");
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const z = positions.getZ(index);
    const radius = Math.hypot(x, z);
    if (radius < 1.1) continue;
    const angle = Math.atan2(z, x);
    const milledRadius = radius + Math.cos(angle * 96) * 0.0055;
    positions.setXYZ(index, (x / radius) * milledRadius, positions.getY(index), (z / radius) * milledRadius);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function createCoinEngravingGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0.34, 0.48);
  shape.lineTo(0.13, 0.59);
  shape.lineTo(-0.16, 0.5);
  shape.lineTo(-0.34, 0.24);
  shape.lineTo(-0.34, -0.24);
  shape.lineTo(-0.16, -0.5);
  shape.lineTo(0.13, -0.59);
  shape.lineTo(0.34, -0.48);
  shape.lineTo(0.22, -0.3);
  shape.lineTo(0.08, -0.39);
  shape.lineTo(-0.08, -0.33);
  shape.lineTo(-0.19, -0.15);
  shape.lineTo(-0.19, 0.15);
  shape.lineTo(-0.08, 0.33);
  shape.lineTo(0.08, 0.39);
  shape.lineTo(0.22, 0.3);
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.012,
    bevelThickness: 0.012,
    curveSegments: 12,
  });
}

function createCoinEtchingGeometry() {
  const positions: number[] = [];
  const divisions = 144;
  for (let index = 0; index < divisions; index += 1) {
    const angle = (index / divisions) * Math.PI * 2;
    const longMark = index % 6 === 0;
    const innerRadius = longMark ? 0.955 : 0.978;
    const outerRadius = 1.025;
    positions.push(
      Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius, 0.139,
      Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius, 0.139,
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function createMorphData() {
  const binary = new Float32Array(PARTICLE_COUNT * 3);
  const monitor = new Float32Array(PARTICLE_COUNT * 3);
  const asset = new Float32Array(PARTICLE_COUNT * 3);
  const system = new Float32Array(PARTICLE_COUNT * 3);
  const catalog = new Float32Array(PARTICLE_COUNT * 3);
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

    const catalogCard = index % 3;
    const catalogX = (catalogCard - 1) * 1.08;
    const catalogBorder = random() > 0.62;
    const catalogEdge = Math.floor(random() * 4);
    const catalogT = random() * 2 - 1;
    catalog[offset] = catalogBorder
      ? catalogX + (catalogEdge < 2 ? catalogT * 0.42 : catalogEdge === 2 ? -0.42 : 0.42)
      : catalogX + (random() - 0.5) * 0.76;
    catalog[offset + 1] = catalogBorder
      ? (catalogEdge < 2 ? (catalogEdge === 0 ? -0.58 : 0.58) : catalogT * 0.58)
      : (random() - 0.5) * 1.02;
    catalog[offset + 2] = (random() - 0.5) * 0.18 + catalogCard * 0.035;

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
  geometry.setAttribute("aCatalog", new THREE.BufferAttribute(catalog, 3));
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
  "attribute vec3 aCatalog;",
  "attribute vec3 aColor;",
  "uniform float uProgress;",
  "varying vec3 vColor;",
  "varying float vAlpha;",
  "void main() {",
  "  float stage = clamp(uProgress * 4.0, 0.0, 4.0);",
  "  float segment = fract(stage);",
  "  vec3 pointPosition;",
  "  if (stage < 1.0) { pointPosition = mix(aBinary, aMonitor, smoothstep(0.0, 1.0, segment)); }",
  "  else if (stage < 2.0) { pointPosition = mix(aMonitor, aAsset, smoothstep(0.0, 1.0, segment)); }",
  "  else if (stage < 3.0) { pointPosition = mix(aAsset, aSystem, smoothstep(0.0, 1.0, segment)); }",
  "  else if (stage < 4.0) { pointPosition = mix(aSystem, aCatalog, smoothstep(0.0, 1.0, segment)); }",
  "  else { pointPosition = aCatalog; }",
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


function PhysicalProductObjects({ progressRef }: SceneProps) {
  const invalidate = useThree((state) => state.invalidate);
  const monitor = useRef<THREE.Group>(null);
  const coin = useRef<THREE.Group>(null);
  const ecosystem = useRef<THREE.Group>(null);
  const monitorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#171a1d", metalness: 0.88, roughness: 0.24 }), []);
  const screenMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#101820", metalness: 0.35, roughness: 0.18, emissive: "#172a2c", emissiveIntensity: 0.55 }), []);
  const silver = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c7cbd0", metalness: 0.96, roughness: 0.2 }), []);
  const coinSurfaceTexture = useMemo(() => createCoinSurfaceTexture(), []);
  const coinSilver = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#d1d5d8",
    metalness: 1,
    roughness: 0.24,
    roughnessMap: coinSurfaceTexture,
    bumpMap: coinSurfaceTexture,
    bumpScale: 0.014,
  }), [coinSurfaceTexture]);
  const coinDetailMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: "#596166", transparent: true, opacity: 0.9 }), []);
  const coinBodyGeometry = useMemo(() => createCoinBodyGeometry(), []);
  const coinEngravingGeometry = useMemo(() => createCoinEngravingGeometry(), []);
  const coinEtchingGeometry = useMemo(() => createCoinEtchingGeometry(), []);
  const lime = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c8f169", metalness: 0.62, roughness: 0.24, emissive: "#789c37", emissiveIntensity: 0.28 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#24292c", metalness: 0.92, roughness: 0.26 }), []);
  const networkMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: "#b9dc78", transparent: true, opacity: 0.72 }), []);
  const ecosystemLinksGeometry = useMemo(() => {
    const nodes = [
      [0, 1.3, 0], [1.08, 0.62, 0.16], [1.2, -0.42, 0.14], [0.12, -1.28, 0],
      [-1.08, -0.58, -0.12], [-1.2, 0.5, -0.1], [0.18, 0.05, 1.22], [-0.14, -0.05, -1.22],
    ];
    const pairs = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6], [2, 6], [4, 7], [5, 7], [6, 7]];
    const positions = new Float32Array(pairs.length * 6);
    pairs.forEach(([from, to], index) => {
      positions.set(nodes[from], index * 6);
      positions.set(nodes[to], index * 6 + 3);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);
  const monitorFrameGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const width = 3.2;
    const height = 2.02;
    const radius = 0.13;
    shape.moveTo(-width / 2 + radius, -height / 2);
    shape.lineTo(width / 2 - radius, -height / 2);
    shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
    shape.lineTo(width / 2, height / 2 - radius);
    shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
    shape.lineTo(-width / 2 + radius, height / 2);
    shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
    shape.lineTo(-width / 2, -height / 2 + radius);
    shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.035, bevelThickness: 0.035, curveSegments: 8 });
  }, []);

  useEffect(() => () => {
    monitorFrameGeometry.dispose();
    ecosystemLinksGeometry.dispose();
    coinBodyGeometry.dispose();
    coinEngravingGeometry.dispose();
    coinEtchingGeometry.dispose();
    coinSurfaceTexture.dispose();
    coinDetailMaterial.dispose();
    coinSilver.dispose();
    networkMaterial.dispose();
    monitorMaterial.dispose(); screenMaterial.dispose(); silver.dispose(); lime.dispose(); dark.dispose();
  }, [monitorFrameGeometry, ecosystemLinksGeometry, coinBodyGeometry, coinEngravingGeometry, coinEtchingGeometry, coinSurfaceTexture, coinDetailMaterial, coinSilver, networkMaterial, monitorMaterial, screenMaterial, silver, lime, dark]);

  useFrame((_, delta) => {
    const stage = THREE.MathUtils.clamp(progressRef.current * 4, 0, 4);
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
    const ecosystemTarget = reveal(2.55, 2.96) * (1 - reveal(3.12, 3.55));
    const monitorMoving = setScale(monitor.current, monitorTarget);
    const coinMoving = setScale(coin.current, coinTarget);
    const ecosystemMoving = setScale(ecosystem.current, ecosystemTarget);
    const transitioning = monitorMoving || coinMoving || ecosystemMoving;
    let monitorRotating = false;
    if (monitor.current) {
      const currentRotation = monitor.current.rotation.y;
      monitor.current.rotation.y = THREE.MathUtils.damp(currentRotation, -0.16, 3, delta);
      monitorRotating = Math.abs(monitor.current.rotation.y - -0.16) > 0.001;
    }
    if (coin.current && coinTarget > 0.02) coin.current.rotation.y += delta * 0.12;
    if (ecosystem.current && ecosystemTarget > 0.02) ecosystem.current.rotation.y += delta * 0.045;
    if (transitioning || monitorRotating || coinTarget > 0.02 || ecosystemTarget > 0.02) invalidate();
  });

  return (
    <>
      <group ref={monitor} position={[0, 0, 0.18]} scale={0.001}>
        <mesh position={[0, 0.12, -0.08]} geometry={monitorFrameGeometry} material={monitorMaterial} />
        <mesh position={[0, 0.12, 0.105]} material={screenMaterial}><planeGeometry args={[2.91, 1.72]} /></mesh>
        <mesh position={[-0.78, 0.66, 0.112]} material={silver}><boxGeometry args={[0.34, 0.035, 0.012]} /></mesh>
        <mesh position={[-0.78, 0.51, 0.112]} material={lime}><boxGeometry args={[0.52, 0.018, 0.012]} /></mesh>
        <mesh position={[0.15, 0.53, 0.112]} material={dark}><boxGeometry args={[1.34, 0.018, 0.012]} /></mesh>
        <mesh position={[-0.76, -0.08, 0.112]} material={silver}><boxGeometry args={[0.42, 0.026, 0.012]} /></mesh>
        <mesh position={[-0.76, -0.22, 0.112]} material={dark}><boxGeometry args={[0.68, 0.018, 0.012]} /></mesh>
        <mesh position={[0.56, -0.2, 0.116]} rotation={[0, 0, -0.12]} material={lime}><boxGeometry args={[0.035, 0.72, 0.018]} /></mesh>
        <mesh position={[0, -1.08, -0.02]} material={silver}><boxGeometry args={[0.2, 0.42, 0.16]} /></mesh>
        <mesh position={[0, -1.32, 0.02]} material={dark}><boxGeometry args={[1.16, 0.1, 0.62]} /></mesh>
        <mesh position={[0, 0.12, 0.125]} material={lime}><boxGeometry args={[0.44, 0.018, 0.012]} /></mesh>
      </group>
      <group ref={coin} position={[0, 0, 0.12]} scale={0.001}>
        <mesh geometry={coinBodyGeometry} rotation={[Math.PI / 2, 0, 0]} material={coinSilver} />
        <mesh position={[0, 0, 0.105]} material={dark}><torusGeometry args={[1.083, 0.024, 12, 192]} /></mesh>
        <mesh position={[0, 0, 0.12]} material={lime}><torusGeometry args={[0.91, 0.022, 12, 192]} /></mesh>
        <mesh position={[0, 0, 0.132]} material={dark}><torusGeometry args={[0.84, 0.009, 8, 192]} /></mesh>
        <mesh position={[0, 0, 0.132]} material={silver}><torusGeometry args={[0.77, 0.012, 8, 192]} /></mesh>
        <mesh position={[0, 0, -0.105]} material={dark}><torusGeometry args={[1.083, 0.024, 12, 192]} /></mesh>
        <lineSegments geometry={coinEtchingGeometry} material={coinDetailMaterial} />
        <mesh geometry={coinEngravingGeometry} position={[0, 0, 0.145]} material={lime} />
        {Array.from({ length: 12 }, (_, index) => {
          const angle = (index / 12) * Math.PI * 2;
          return (
            <mesh key={index} position={[Math.cos(angle) * 0.69, Math.sin(angle) * 0.69, 0.145]} material={silver}>
              <sphereGeometry args={[0.018, 10, 10]} />
            </mesh>
          );
        })}
      </group>
      <group ref={ecosystem} position={[0, 0, 0]} scale={0.001}>
        <lineSegments geometry={ecosystemLinksGeometry} material={networkMaterial} />
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

function StudioEnvironment() {
  const scene = useThree((state) => state.scene);
  const environment = useMemo(() => {
    const width = 256;
    const height = 128;
    const data = new Uint8Array(width * height * 4);
    const smooth = (edge0: number, edge1: number, value: number) => {
      const amount = THREE.MathUtils.clamp((value - edge0) / (edge1 - edge0), 0, 1);
      return amount * amount * (3 - 2 * amount);
    };
    const panel = (u: number, v: number, left: number, right: number, top: number, bottom: number) => (
      smooth(left, left + 0.018, u) *
      (1 - smooth(right - 0.018, right, u)) *
      smooth(top, top + 0.025, v) *
      (1 - smooth(bottom - 0.025, bottom, v))
    );

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const u = x / width;
        const v = y / height;
        const verticalSoftbox = panel(u, v, 0.16, 0.235, 0.2, 0.79);
        const overheadSoftbox = panel(u, v, 0.48, 0.78, 0.12, 0.205);
        const sideStrip = panel(u, v, 0.84, 0.875, 0.29, 0.7);
        const limeBounce = panel(u, v, 0.34, 0.365, 0.48, 0.72);
        const base = 0.025 + (1 - v) * 0.035;
        const white = Math.max(verticalSoftbox * 0.94, overheadSoftbox * 0.82, sideStrip * 0.62);
        const lime = limeBounce * 0.48;
        const index = (y * width + x) * 4;
        data[index] = Math.round(THREE.MathUtils.clamp(base * 0.78 + white + lime * 0.62, 0, 1) * 255);
        data[index + 1] = Math.round(THREE.MathUtils.clamp(base * 0.84 + white + lime, 0, 1) * 255);
        data[index + 2] = Math.round(THREE.MathUtils.clamp(base + white + lime * 0.5, 0, 1) * 255);
        data[index + 3] = 255;
      }
    }

    const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, []);

  useEffect(() => {
    const previousEnvironment = scene.environment;
    scene.environment = environment;
    return () => {
      if (scene.environment === environment) scene.environment = previousEnvironment;
      environment.dispose();
    };
  }, [environment, scene]);

  return null;
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
      <StudioEnvironment />
      <MorphingParticles progressRef={progressRef} invalidateRef={invalidateRef} />
      <PhysicalProductObjects progressRef={progressRef} invalidateRef={invalidateRef} />
    </Canvas>
  );
}
