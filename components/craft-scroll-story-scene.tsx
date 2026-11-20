"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import {
  ARC_STEPS,
  ARC_WIDTH,
  CAMERA_FOV,
  FAMILIES,
  buildStoryLayout,
  sampleCamera,
  sampleStory,
} from "../lib/craft-story-layout";
import type { CameraPose, Family, Quality } from "../lib/craft-story-layout";

type SceneProps = {
  progressRef: MutableRefObject<number>;
  invalidateRef: MutableRefObject<(() => void) | null>;
  reducedMotion?: boolean;
};

/** Rendering policy: one scene, a handful of instanced component families, demand rendering. */
function detectQuality(): Quality {
  if (typeof window === "undefined") return "low";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const compact = window.innerWidth < 760;
  const lowMemory = (nav.deviceMemory ?? 8) <= 4;
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;
  return coarse || compact || lowMemory || fewCores ? "low" : "high";
}

/* ---------------------------------------------------------------- geometry */

function createArcGeometry(quality: Quality) {
  // One piece of a thin ring (radius 1, width ARC_WIDTH) spanning 360° / ARC_STEPS and 1 deep.
  // The piece origin sits at its own centroid (the ring centre is at local x = -1), so an instance's
  // position is a point ON the ring and its rotation about Z is the ring angle.
  const half = (Math.PI / ARC_STEPS) * 1.05;
  const inner = 1 - ARC_WIDTH / 2;
  const outer = 1 + ARC_WIDTH / 2;
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outer, -half, half, false);
  shape.absarc(0, 0, inner, half, -half, true);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false, curveSegments: quality === "high" ? 6 : 4 });
  geometry.translate(-1, 0, -0.5);
  return geometry;
}

function createGeometries(quality: Quality): Record<Family, THREE.BufferGeometry> {
  const hi = quality === "high";
  return {
    slab: new THREE.BoxGeometry(1, 1, 1),
    bar: new RoundedBoxGeometry(1, 1, 1, hi ? 2 : 1, 0.14),
    arc: createArcGeometry(quality),
    cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, hi ? 32 : 20, 1),
    orb: new THREE.IcosahedronGeometry(0.5, hi ? 3 : 2),
    pix: new THREE.BoxGeometry(1, 1, 1),
  };
}

function createMaterials(): Record<Family, THREE.Material> {
  const metal = (metalness: number, roughness: number) =>
    new THREE.MeshStandardMaterial({ color: "#ffffff", metalness, roughness, envMapIntensity: 1.3 });
  return {
    slab: metal(0.6, 0.25),
    bar: metal(1, 0.3),
    arc: metal(1, 0.26),
    cyl: metal(1, 0.24),
    orb: metal(0.55, 0.2),
    // lit components: unlit, true colour, never tone-mapped down
    pix: new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false }),
  };
}

/* ------------------------------------------------------------- environment */

/** A dark photo studio: softboxes, strip lights and a lime bounce, baked once into a PMREM cube. */
function createStudioTexture(renderer: THREE.WebGLRenderer) {
  const studio = new THREE.Scene();
  const disposables: { dispose: () => void }[] = [];
  const panel = (w: number, h: number, position: [number, number, number], color: string, intensity: number) => {
    const geometry = new THREE.PlaneGeometry(w, h);
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.lookAt(0, 0, 0);
    studio.add(mesh);
    disposables.push(geometry, material);
  };
  const room = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: "#0e1013", side: THREE.BackSide }));
  studio.add(room);
  disposables.push(room.geometry, room.material as THREE.Material);
  panel(9, 5, [-2, 9, 5], "#ffffff", 6); // key softbox, top front
  panel(16, 9, [0, 1, 11], "#f2f5f7", 0.5); // broad front fill: flat faces read as polished metal
  panel(3, 12, [7, 3, 8], "#ffffff", 7); // hard strip: gradient sweep across tilted faces
  panel(2.4, 12, [-10, 1, 2], "#e8f0ff", 5); // left strip
  panel(2, 10, [10, 2, -4], "#ffffff", 6); // right rim strip
  panel(7, 1.6, [0, -3, 9], "#c9f36a", 0.7); // lime floor bounce, front low
  panel(14, 8, [0, -9, 2], "#cfd6dc", 0.9); // soft floor card
  panel(10, 2, [0, 2, -11], "#9fb3c8", 2.2); // back kicker
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(studio, 0.02);
  pmrem.dispose();
  disposables.forEach((item) => item.dispose());
  return target;
}

function StudioEnvironment({ materials }: { materials: Record<Family, THREE.Material> }) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const target = createStudioTexture(gl);
    FAMILIES.forEach((family) => {
      const material = materials[family] as THREE.MeshStandardMaterial;
      if ("envMap" in material && family !== "pix") {
        material.envMap = target.texture;
        material.needsUpdate = true;
      }
    });
    invalidate();
    return () => {
      FAMILIES.forEach((family) => {
        const material = materials[family] as THREE.MeshStandardMaterial;
        if ("envMap" in material && family !== "pix") material.envMap = null;
      });
      target.dispose();
    };
  }, [gl, invalidate, materials]);
  return null;
}

/* ---------------------------------------------------------------- assembly */

type Pointer = { x: number; y: number; tx: number; ty: number };

function Assembly({ progressRef, invalidateRef, quality, reducedMotion }: SceneProps & { quality: Quality }) {
  const invalidate = useThree((state) => state.invalidate);
  const gl = useThree((state) => state.gl);
  const layout = useMemo(() => buildStoryLayout(quality), [quality]);
  const geometries = useMemo(() => createGeometries(quality), [quality]);
  const materials = useMemo(() => createMaterials(), []);
  const meshes = useRef<Partial<Record<Family, THREE.InstancedMesh>>>({});
  const buffers = useRef<{ matrices: Record<Family, Float32Array>; colors: Record<Family, Float32Array> } | null>(null);
  const light = useRef<THREE.PointLight>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, tx: 0, ty: 0 });
  const last = useRef({ progress: -1, px: 99, py: 99 });
  const pose = useMemo<CameraPose>(() => ({ position: [0, 0, 7], target: [0, 0, 0] }), []);

  useLayoutEffect(() => {
    const matrices = {} as Record<Family, Float32Array>;
    const colors = {} as Record<Family, Float32Array>;
    FAMILIES.forEach((family) => {
      const mesh = meshes.current[family];
      if (!mesh) return;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.setColorAt(0, new THREE.Color(1, 1, 1));
      mesh.instanceColor?.setUsage(THREE.DynamicDrawUsage);
      matrices[family] = mesh.instanceMatrix.array as Float32Array;
      colors[family] = mesh.instanceColor?.array as Float32Array;
    });
    buffers.current = { matrices, colors };
    last.current.progress = -1;
    invalidate();
  }, [invalidate, layout]);

  useEffect(() => {
    invalidateRef.current = invalidate;
    invalidate();
    return () => {
      if (invalidateRef.current === invalidate) invalidateRef.current = null;
      FAMILIES.forEach((family) => {
        geometries[family].dispose();
        materials[family].dispose();
      });
    };
  }, [geometries, invalidate, invalidateRef, materials]);

  // Pointer parallax: mouse/pen only, never touch, never while reduced motion is requested.
  useEffect(() => {
    if (reducedMotion) return;
    const element = gl.domElement;
    const state = pointer.current;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = element.getBoundingClientRect();
      state.tx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      state.ty = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      invalidate();
    };
    const onLeave = () => {
      state.tx = 0;
      state.ty = 0;
      invalidate();
    };
    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      state.tx = 0;
      state.ty = 0;
    };
  }, [gl, invalidate, reducedMotion]);

  useFrame((state) => {
    const store = buffers.current;
    if (!store) return;
    const p = pointer.current;
    p.x += (p.tx - p.x) * 0.1;
    p.y += (p.ty - p.y) * 0.1;
    const settling = Math.abs(p.tx - p.x) > 0.002 || Math.abs(p.ty - p.y) > 0.002;
    const progress = THREE.MathUtils.clamp(progressRef.current, 0, 1);

    if (progress !== last.current.progress) {
      sampleStory(layout, progress, store.matrices, store.colors);
      FAMILIES.forEach((family) => {
        const mesh = meshes.current[family];
        if (!mesh) return;
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      });
      last.current.progress = progress;
    }

    const aspect = state.size.width / Math.max(state.size.height, 1);
    sampleCamera(progress, aspect, p.x, p.y, pose);
    state.camera.position.set(pose.position[0], pose.position[1], pose.position[2]);
    state.camera.lookAt(pose.target[0], pose.target[1], pose.target[2]);
    // accent light rests low-left and follows the pointer across the object
    if (light.current) light.current.position.set(-2.4 + p.x * 3.4, -1.6 - p.y * 2.2, 2.6);
    if (settling) state.invalidate();
  });

  return (
    <>
      <pointLight ref={light} intensity={3} distance={8} decay={2} color="#d6f58f" position={[-2.4, -1.6, 2.6]} />
      {FAMILIES.map((family) =>
        layout.counts[family] > 0 ? (
          <instancedMesh
            key={family + quality}
            ref={(mesh: THREE.InstancedMesh | null) => {
              if (mesh) meshes.current[family] = mesh;
              else delete meshes.current[family];
            }}
            args={[geometries[family], materials[family], layout.counts[family]]}
            frustumCulled={false}
          />
        ) : null,
      )}
      <StudioEnvironment materials={materials} />
    </>
  );
}

export function CraftScrollStoryScene({ progressRef, invalidateRef, reducedMotion = false }: SceneProps) {
  const [quality] = useState<Quality>(() => detectQuality());
  const [lost, setLost] = useState(false);

  if (lost) return <div className="craft-story-fallback" />;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, quality === "high" ? 1.5 : 1.15]}
      camera={{ position: [0, 0, 7], fov: CAMERA_FOV, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power", stencil: false }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          setLost(true);
        });
      }}
      fallback={<div className="craft-story-fallback" />}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-4, 1, -3]} intensity={0.9} color="#aab5c0" />
      <Assembly progressRef={progressRef} invalidateRef={invalidateRef} quality={quality} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
