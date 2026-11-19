"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

const liquidVertexShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float swell = sin(position.y * 3.1 + uTime * 0.42) * 0.026
      + sin(position.x * 4.2 - uTime * 0.28) * 0.018
      + sin((position.x + position.z) * 5.0 + uTime * 0.2) * 0.012;
    vec3 displaced = position + normal * swell;
    vNormal = normalize(normalMatrix * normal);
    vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.0);
    vPosition = viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const liquidFragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(-vPosition);
    vec3 lightA = normalize(vec3(-0.65, 0.82, 0.72));
    vec3 lightB = normalize(vec3(0.8, -0.25, 0.5));
    float diffuseA = max(dot(normal, lightA), 0.0);
    float diffuseB = max(dot(normal, lightB), 0.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.35);
    float bands = sin(vUv.y * 18.0 + sin(vUv.x * 9.0 + uTime * 0.18) * 1.5);
    float reflection = pow(max(dot(reflect(-lightA, normal), viewDirection), 0.0), 22.0);
    vec3 graphite = vec3(0.075, 0.09, 0.075);
    vec3 silver = vec3(0.72, 0.77, 0.69);
    vec3 lime = vec3(0.68, 0.88, 0.34);
    vec3 metal = mix(graphite, silver, clamp(diffuseA * 0.7 + diffuseB * 0.18 + bands * 0.08 + 0.18, 0.0, 1.0));
    metal = mix(metal, lime, fresnel * 0.34 + max(bands, 0.0) * 0.055);
    metal += vec3(0.8, 0.86, 0.72) * reflection * 0.75;
    metal += vec3(0.13, 0.17, 0.1) * fresnel;
    gl_FragColor = vec4(metal, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const atmosphereVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float radius = length(p * vec2(1.0, 0.82));
    float halo = smoothstep(0.62, 0.04, radius);
    float drift = sin(vUv.x * 5.2 + uTime * 0.09) * cos(vUv.y * 4.4 - uTime * 0.07);
    vec3 base = vec3(0.88, 0.91, 0.85);
    vec3 glow = vec3(0.77, 0.88, 0.61);
    vec3 color = mix(base, glow, halo * 0.34 + max(drift, 0.0) * 0.035);
    float vignette = smoothstep(0.82, 0.2, radius);
    color *= 0.94 + vignette * 0.06;
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Atmosphere({ reducedMotion }: { reducedMotion: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  useFrame((state) => {
    if (material.current && !reducedMotion) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  return (
    <mesh position={[0, 0, -2.2]} scale={[8, 8, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        depthWrite={false}
      />
    </mesh>
  );
}

function ObjectField({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.ShaderMaterial>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (core.current && !reducedMotion) core.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (!group.current || reducedMotion) return;
    const targetX = state.pointer.y * 0.12;
    const targetY = state.pointer.x * 0.2;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY + state.clock.elapsedTime * 0.075, 3, delta);
    if (ring.current) ring.current.rotation.z += delta * 0.1;
  });

  return (
    <group ref={group} rotation={[0.12, -0.3, -0.12]}>
      <mesh castShadow>
        <sphereGeometry args={[1.04, 112, 112]} />
        <shaderMaterial
          ref={core}
          uniforms={{ uTime: { value: 0 } }}
          vertexShader={liquidVertexShader}
          fragmentShader={liquidFragmentShader}
          metalness={0.95}
          roughness={0.16}
        />
      </mesh>
      <mesh ref={ring} rotation={[1.1, 0.25, 0.2]}>
        <torusGeometry args={[1.48, 0.018, 12, 180]} />
        <meshStandardMaterial color="#c8f169" metalness={0.78} roughness={0.22} emissive="#789c37" emissiveIntensity={0.18} />
      </mesh>
      <mesh rotation={[0.3, 0.7, 1.05]}>
        <torusGeometry args={[1.72, 0.009, 8, 180]} />
        <meshStandardMaterial color="#eef0e7" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.65, 0.72, 0.15]}>
        <sphereGeometry args={[0.085, 24, 24]} />
        <meshStandardMaterial color="#c8f169" emissive="#c8f169" emissiveIntensity={0.42} />
      </mesh>
      <mesh position={[-1.55, -0.65, -0.25]}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshStandardMaterial color="#f4f3ed" metalness={0.9} roughness={0.16} />
      </mesh>
    </group>
  );
}

export function CraftHeroScene() {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div className="craft-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.35]}
        camera={{ position: [0, 0, 5.4], fov: 36 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power", stencil: false }}
        fallback={<div className="craft-scene-fallback" />}
      >
        <color attach="background" args={["#e4eadc"]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 4, 4]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-3, -2, 2]} intensity={11} distance={8} color="#c8f169" />
        <pointLight position={[2, 1, -3]} intensity={15} distance={7} color="#d8e2d0" />
        <Atmosphere reducedMotion={reducedMotion} />
        <ObjectField reducedMotion={reducedMotion} />
      </Canvas>
      {reducedMotion ? <span className="craft-scene-static-label">CRAFT / LIQUID METAL OBJECT 001</span> : null}
    </div>
  );
}
