"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

type SceneProps = {
  progressRef: MutableRefObject<number>;
  invalidateRef: MutableRefObject<(() => void) | null>;
};

const COMPONENT_COUNT = 640;
const BINARY_GLYPHS = [
  ["01110","10001","10011","10101","11001","10001","01110"],
  ["00100","01100","00100","00100","00100","00100","01110"],
  ["11110","00001","00001","01110","10000","10000","11111"],
  ["11110","00001","00001","01110","00001","00001","11110"],
  ["10010","10010","10010","11111","00010","00010","00010"],
  ["11111","10000","10000","11110","00001","00001","11110"],
  ["01110","10000","10000","11110","10001","10001","01110"],
  ["11111","00001","00010","00100","01000","01000","01000"],
] as const;

type StageLayout = {
  positions: Float32Array;
  rotations: Float32Array;
  scales: Float32Array;
};

function createLayout(): StageLayout[] {
  const layouts = Array.from({ length: 5 }, () => ({
    positions: new Float32Array(COMPONENT_COUNT * 3),
    rotations: new Float32Array(COMPONENT_COUNT * 3),
    scales: new Float32Array(COMPONENT_COUNT * 3),
  }));

  const write = (stage: number, index: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, rx = 0, ry = 0, rz = 0) => {
    const item = layouts[stage];
    const offset = index * 3;
    item.positions.set([x, y, z], offset);
    item.scales.set([sx, sy, sz], offset);
    item.rotations.set([rx, ry, rz], offset);
  };

  // 01 — readable binary typography. Every active block belongs to a glyph.
  for (let index = 0; index < COMPONENT_COUNT; index += 1) {
    const glyph = Math.floor(index / 35);
    const cell = index % 35;
    const row = Math.floor(cell / 5);
    const column = cell % 5;
    const active = glyph < BINARY_GLYPHS.length && BINARY_GLYPHS[glyph][row][column] === "1";
    const x = (glyph - 3.5) * 0.68 + (column - 2) * 0.105;
    const y = (3 - row) * 0.105;
    write(0, index, active ? x : 0, active ? y : 0, 0, active ? 0.078 : 0, active ? 0.078 : 0, active ? 0.035 : 0);
  }

  // 02 — monitor: continuous bezel, pixel-like screen tiles, stand and base.
  for (let index = 0; index < COMPONENT_COUNT; index += 1) {
    let x = 0; let y = 0; let z = 0.03; let sx = 0.035; let sy = 0.035; let sz = 0.035;
    if (index < 180) {
      const edge = index % 4;
      const t = Math.floor(index / 4) / 44.75;
      if (edge < 2) { x = (t - 0.5) * 3.45; y = edge === 0 ? -1.03 : 1.03; sx = 0.034; sy = 0.055; }
      else { x = edge === 2 ? -1.72 : 1.72; y = (t - 0.5) * 2.06; sx = 0.055; sy = 0.034; }
      z = 0.12;
    } else if (index < 570) {
      const tile = index - 180;
      const column = tile % 30;
      const row = Math.floor(tile / 30);
      x = (column - 14.5) * 0.102;
      y = 0.82 - row * 0.102;
      z = 0.17 + ((row + column) % 5) * 0.003;
      sx = 0.043; sy = 0.043; sz = 0.018;
    } else if (index < 610) {
      const part = index - 570;
      x = (part % 4 - 1.5) * 0.075;
      y = -1.28 - Math.floor(part / 4) * 0.032;
      z = 0.02; sx = 0.032; sy = 0.025; sz = 0.035;
    } else {
      const part = index - 610;
      x = (part - 14.5) * 0.075;
      y = -1.58; z = 0.02; sx = 0.034; sy = 0.055; sz = 0.11;
    }
    write(1, index, x, y, z, sx, sy, sz);
  }

  // 03 — coin: 384 milled edge segments plus concentric face engraving.
  for (let index = 0; index < COMPONENT_COUNT; index += 1) {
    let x = 0; let y = 0; let z = 0.12; let sx = 0.022; let sy = 0.035; let sz = 0.025; let rz = 0;
    if (index < 384) {
      const angle = (index / 384) * Math.PI * 2;
      x = Math.cos(angle) * 1.12; y = Math.sin(angle) * 1.12; z = 0;
      sx = 0.018; sy = 0.026; sz = 0.105; rz = angle;
    } else {
      const detail = index - 384;
      const ring = Math.floor(detail / 64);
      const segment = detail % 64;
      const angle = (segment / 64) * Math.PI * 2 + ring * 0.045;
      const radius = 0.28 + ring * 0.105;
      x = Math.cos(angle) * radius; y = Math.sin(angle) * radius;
      z = 0.135 + (ring % 2) * 0.012;
      sx = 0.018; sy = 0.055 + (segment % 8 === 0 ? 0.025 : 0); sz = 0.018;
      rz = angle;
    }
    write(2, index, x, y, z, sx, sy, sz, 0, 0, rz);
  }

  // 04 — ecosystem: authored hub clusters and components along deliberate links.
  const nodes: [number, number, number][] = [
    [0, 0.92, 0], [0.88, 0.46, 0.12], [0.92, -0.48, 0.08], [0, -0.92, 0],
    [-0.9, -0.45, -0.08], [-0.92, 0.48, -0.1], [0.05, 0.02, 0.78], [-0.05, -0.02, -0.78],
  ];
  const links = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[2,6],[4,7],[5,7],[6,7]];
  for (let index = 0; index < COMPONENT_COUNT; index += 1) {
    if (index < 176) {
      const nodeIndex = index % nodes.length;
      const node = nodes[nodeIndex];
      const local = Math.floor(index / nodes.length);
      const angle = (local / 22) * Math.PI * 2;
      const radius = 0.075 + (local % 3) * 0.018;
      write(3, index, node[0] + Math.cos(angle) * radius, node[1] + Math.sin(angle) * radius, node[2] + Math.sin(angle * 2) * radius, 0.025, 0.025, 0.025, angle * 0.2, angle * 0.25, angle);
    } else {
      const linkIndex = (index - 176) % links.length;
      const step = Math.floor((index - 176) / links.length);
      const [from, to] = links[linkIndex];
      const a = nodes[from]; const b = nodes[to];
      const t = step / 43;
      const x = THREE.MathUtils.lerp(a[0], b[0], t);
      const y = THREE.MathUtils.lerp(a[1], b[1], t);
      const z = THREE.MathUtils.lerp(a[2], b[2], t);
      const dx = b[0] - a[0]; const dy = b[1] - a[1];
      write(3, index, x, y, z, 0.018, Math.max(0.012, Math.hypot(dx, dy) / 46), 0.018, 0, 0, -Math.atan2(dx, dy));
    }
  }

  // 05 — three catalogue panels, each assembled from a border and structured content grid.
  for (let index = 0; index < COMPONENT_COUNT; index += 1) {
    const card = Math.floor(index / 213);
    const local = index % 213;
    const originX = (card - 1) * 1.18;
    let x = originX; let y = 0; let z = 0.02; let sx = 0.025; let sy = 0.025; let sz = 0.025;
    if (local < 84) {
      const edge = local % 4;
      const t = Math.floor(local / 4) / 20.75;
      if (edge < 2) { x += (t - 0.5) * 0.94; y = edge === 0 ? -0.7 : 0.7; sx = 0.022; sy = 0.035; }
      else { x += edge === 2 ? -0.47 : 0.47; y = (t - 0.5) * 1.4; sx = 0.035; sy = 0.022; }
    } else {
      const tile = local - 84;
      const column = tile % 11;
      const row = Math.floor(tile / 11);
      x += (column - 5) * 0.075;
      y = 0.43 - row * 0.078;
      sx = 0.026; sy = 0.026; sz = 0.016;
    }
    write(4, index, x, y, z, sx, sy, sz);
  }

  return layouts;
}

function ComponentAssembly({ progressRef, invalidateRef }: SceneProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const root = useRef<THREE.Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  const layouts = useMemo(() => createLayout(), []);
  const geometry = useMemo(() => {
    const shape = new THREE.BoxGeometry(1, 1, 1);
    return shape;
  }, []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#c8cdd0",
    metalness: 0.92,
    roughness: 0.26,
    envMapIntensity: 1.25,
  }), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    invalidateRef.current = invalidate;
    invalidate();
    return () => {
      if (invalidateRef.current === invalidate) invalidateRef.current = null;
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material, invalidate, invalidateRef]);

  useFrame((_, delta) => {
    const instance = mesh.current;
    const group = root.current;
    if (!instance || !group) return;
    const target = THREE.MathUtils.clamp(progressRef.current, 0, 1) * 4;
    const stage = Math.min(3, Math.floor(target));
    const segment = target >= 4 ? 1 : target - stage;
    const eased = THREE.MathUtils.smoothstep(segment, 0, 1);
    const from = layouts[stage];
    const to = layouts[Math.min(stage + 1, 4)];
    const tempPosition = new THREE.Vector3();
    const tempScale = new THREE.Vector3();
    const tempRotation = new THREE.Euler();
    const tempQuaternion = new THREE.Quaternion();
    const zeroScale = new THREE.Vector3(0, 0, 0);

    for (let index = 0; index < COMPONENT_COUNT; index += 1) {
      const offset = index * 3;
      tempPosition.set(
        THREE.MathUtils.lerp(from.positions[offset], to.positions[offset], eased),
        THREE.MathUtils.lerp(from.positions[offset + 1], to.positions[offset + 1], eased),
        THREE.MathUtils.lerp(from.positions[offset + 2], to.positions[offset + 2], eased),
      );
      // Components travel on deterministic shallow arcs, never as detached ambient particles.
      const arc = Math.sin(eased * Math.PI) * Math.sin(index * 0.37) * 0.055;
      tempPosition.z += arc;
      tempScale.set(
        THREE.MathUtils.lerp(from.scales[offset], to.scales[offset], eased),
        THREE.MathUtils.lerp(from.scales[offset + 1], to.scales[offset + 1], eased),
        THREE.MathUtils.lerp(from.scales[offset + 2], to.scales[offset + 2], eased),
      );
      if (tempScale.lengthSq() < 0.000001) tempScale.copy(zeroScale);
      tempRotation.set(
        THREE.MathUtils.lerp(from.rotations[offset], to.rotations[offset], eased),
        THREE.MathUtils.lerp(from.rotations[offset + 1], to.rotations[offset + 1], eased),
        THREE.MathUtils.lerp(from.rotations[offset + 2], to.rotations[offset + 2], eased),
      );
      tempQuaternion.setFromEuler(tempRotation);
      dummy.position.copy(tempPosition);
      dummy.quaternion.copy(tempQuaternion);
      dummy.scale.copy(tempScale);
      dummy.updateMatrix();
      instance.setMatrixAt(index, dummy.matrix);
    }
    instance.instanceMatrix.needsUpdate = true;

    const composition = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    group.position.x = Math.sin(composition * Math.PI * 2) * 0.24;
    group.position.y = Math.sin(composition * Math.PI) * 0.12;
    group.rotation.y = THREE.MathUtils.lerp(-0.12, 0.16, composition);
    group.rotation.x = THREE.MathUtils.lerp(0.035, -0.045, composition);
    group.scale.setScalar(THREE.MathUtils.lerp(1, 0.9, Math.sin(composition * Math.PI)));
    invalidate();
  });

  return (
    <group ref={root}>
      <instancedMesh ref={mesh} args={[geometry, material, COMPONENT_COUNT]} frustumCulled={false} />
    </group>
  );
}

function StudioEnvironment() {
  const scene = useThree((state) => state.scene);
  const environment = useMemo(() => {
    const width = 256;
    const height = 128;
    const data = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const u = x / width; const v = y / height;
        const softbox = (u > 0.16 && u < 0.24 && v > 0.2 && v < 0.8) || (u > 0.48 && u < 0.78 && v > 0.12 && v < 0.21);
        const limeBounce = u > 0.34 && u < 0.37 && v > 0.48 && v < 0.72;
        const base = 7 + Math.round((1 - v) * 8);
        const light = softbox ? 235 : base;
        const index = (y * width + x) * 4;
        data[index] = light;
        data[index + 1] = limeBounce ? 205 : light;
        data[index + 2] = limeBounce ? 125 : light;
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
    const previous = scene.environment;
    scene.environment = environment;
    return () => {
      if (scene.environment === environment) scene.environment = previous;
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
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-4, 1, -3]} intensity={1.2} color="#aab5c0" />
      <pointLight position={[-3, -2, 2]} intensity={7} distance={8} color="#c8f169" />
      <StudioEnvironment />
      <ComponentAssembly progressRef={progressRef} invalidateRef={invalidateRef} />
    </Canvas>
  );
}
