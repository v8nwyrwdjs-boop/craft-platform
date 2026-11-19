"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useRef } from "react";
import * as THREE from "three";

function ObjectField() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const reducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    const targetX = state.pointer.y * 0.12;
    const targetY = state.pointer.x * 0.2;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY + state.clock.elapsedTime * 0.08, 3, delta);
    if (core.current) core.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.07;
    if (ring.current) ring.current.rotation.z += delta * 0.12;
  });

  return (
    <group ref={group} rotation={[0.12, -0.3, -0.12]}>
      <mesh ref={core} castShadow>
        <icosahedronGeometry args={[1.05, 5]} />
        <meshPhysicalMaterial color="#aeb6a5" metalness={0.92} roughness={0.19} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      <mesh ref={ring} rotation={[1.1, 0.25, 0.2]}>
        <torusGeometry args={[1.48, 0.018, 12, 180]} />
        <meshStandardMaterial color="#c8f169" metalness={0.7} roughness={0.28} emissive="#789c37" emissiveIntensity={0.22} />
      </mesh>
      <mesh rotation={[0.3, 0.7, 1.05]}>
        <torusGeometry args={[1.72, 0.009, 8, 180]} />
        <meshStandardMaterial color="#eef0e7" metalness={0.85} roughness={0.24} />
      </mesh>
      <mesh position={[1.65, 0.72, 0.15]}>
        <sphereGeometry args={[0.085, 24, 24]} />
        <meshStandardMaterial color="#c8f169" emissive="#c8f169" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-1.55, -0.65, -0.25]}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshStandardMaterial color="#f4f3ed" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function CraftHeroScene() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="craft-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.4], fov: 36 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        fallback={<div className="craft-scene-fallback" />}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 4, 4]} intensity={2.1} color="#ffffff" />
        <pointLight position={[-3, -2, 2]} intensity={14} distance={8} color="#c8f169" />
        <pointLight position={[2, 1, -3]} intensity={18} distance={7} color="#aab6c4" />
        <ObjectField />
      </Canvas>
      {reducedMotion ? <span className="craft-scene-static-label">CRAFT / OBJECT 001</span> : null}
    </div>
  );
}
