"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { BoxGeometry, DataTexture, FloatType, InstancedBufferAttribute, type InstancedMesh, NearestFilter, RGBAFormat, ShaderMaterial, Vector3 } from "three";
import { markGeometry } from "@/lib/brand-mark";
import { BRICK, buildBrickData, TEX_W } from "@/lib/brick-shapes";
import { frameAt } from "@/lib/brick-timeline";
import { progress } from "@/lib/scene-progress";

type Props = { nx: number; dpr: number; lite: boolean; onReady: () => void; onSlow: () => void; onLost: () => void };

/* Every brick reads its place in two states from one float texture and blends between them on the GPU:
   the CPU only sets a handful of uniforms per frame. Chrome is an analytic studio environment, no image is loaded. */
const VERT = /* glsl */ `
uniform sampler2D uStates;
uniform vec3 uBrick;
uniform float uA, uB, uMix, uSpread, uStageMode, uTime, uIdle;
attribute float aSeed;
attribute float aStage;
varying vec3 vView;
varying vec3 vLocal;
varying vec3 vFace;
varying vec3 vX;
varying vec3 vY;
varying vec3 vZ;
varying vec3 vObj;
varying float vHeat;
varying float vSeed;

vec4 texAt(float state, float layer, float i) {
  float row = (state * 2.0 + layer) * ROWS + floor(i / TEXW);
  return texelFetch(uStates, ivec2(int(mod(i, TEXW)), int(row)), 0);
}
vec3 qrot(vec4 q, vec3 v) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
float h1(float n) { return fract(sin(n * 91.3458) * 47453.5453); }

void main() {
  float i = float(gl_InstanceID);
  vec4 pa = texAt(uA, 0.0, i);
  vec4 pb = texAt(uB, 0.0, i);
  vec4 qa = texAt(uA, 1.0, i);
  vec4 qb = texAt(uB, 1.0, i);
  float delay = mix(aSeed, aStage / 5.0, uStageMode) * uSpread;
  float m = clamp((uMix - delay) / max(1.0 - uSpread, 0.001), 0.0, 1.0);
  float e = m * m * (3.0 - 2.0 * m);
  vec3 side = vec3(h1(i + 1.0), h1(i + 2.0), h1(i + 3.0)) - 0.5;
  vec3 p = mix(pa.xyz, pb.xyz, e) + side * sin(3.14159265 * e) * 1.4 * (1.0 - uStageMode);
  if (dot(qa, qb) < 0.0) qa = -qa;
  vec4 q = normalize(mix(qa, qb, e));
  float ph = aSeed * 6.2831;
  p += uIdle * 0.014 * vec3(sin(uTime * 0.9 + ph), cos(uTime * 0.7 + ph * 1.3), sin(uTime * 0.8 + ph * 0.7));
  float fromScatter = step(uA, 0.5);
  float size = mix(1.0, 0.6, (1.0 - e) * fromScatter); // scattered bricks are small and grow as they arrive
  size *= 1.0 - (1.0 - step(aSeed, 0.42)) * fromScatter * (1.0 - smoothstep(0.05, 0.6, e)); // only ~42% of the cloud is visible at rest
  vec3 obj = p + qrot(q, position * uBrick * size);
  vec4 mv = modelViewMatrix * vec4(obj, 1.0);
  gl_Position = projectionMatrix * mv;
  mat3 mn = mat3(modelViewMatrix);
  vView = mv.xyz;
  vObj = obj;
  vLocal = position;
  vFace = normal;
  vX = mn * qrot(q, vec3(1.0, 0.0, 0.0));
  vY = mn * qrot(q, vec3(0.0, 1.0, 0.0));
  vZ = mn * qrot(q, vec3(0.0, 0.0, 1.0));
  vHeat = mix(pa.w, pb.w, e);
  vSeed = aSeed;
}
`;

const FRAG = /* glsl */ `
uniform vec3 uBrick;
uniform float uDark, uInk, uFlash;
varying vec3 vView;
varying vec3 vLocal;
varying vec3 vFace;
varying vec3 vX;
varying vec3 vY;
varying vec3 vZ;
varying vec3 vObj;
varying float vHeat;
varying float vSeed;

vec3 env(vec3 r) {
  float up = r.y * 0.5 + 0.5;
  vec3 light = mix(vec3(0.22, 0.26, 0.33), vec3(0.62, 0.67, 0.76), up);
  vec3 dark = mix(vec3(0.02, 0.025, 0.05), vec3(0.22, 0.28, 0.42), up);
  vec3 c = mix(light, dark, uDark);
  float s1 = smoothstep(0.55, 0.9, dot(r, normalize(vec3(-0.6, 0.7, 0.55))));
  float s2 = smoothstep(0.6, 0.95, dot(r, normalize(vec3(0.75, 0.25, 0.6))));
  c += (s1 * 1.1 + s2 * 0.7) * mix(vec3(1.0), vec3(0.75, 0.85, 1.0), uDark);
  float k = smoothstep(0.3, 0.9, dot(r, normalize(vec3(0.2, -0.8, 0.4))));
  return c + k * vec3(1.0, 0.42, 0.18) * 0.45;
}

void main() {
  vec3 edge = (vec3(0.5) - abs(vLocal)) * uBrick;
  vec3 tilt = sign(vLocal) * (1.0 - smoothstep(0.0, 0.007, edge)) * (1.0 - abs(vFace));
  vec3 nl = normalize(vFace + tilt * 1.1);
  vec3 n = normalize(vX * nl.x + vY * nl.y + vZ * nl.z);
  vec3 v = normalize(vView);
  vec3 r = reflect(v, n);
  float fres = pow(1.0 - max(dot(n, -v), 0.0), 3.0);
  vec3 steel = env(r) * (0.93 + 0.14 * fract(vSeed * 7.31)) + fres * 0.12;
  vec3 heatCol = mix(vec3(1.0, 0.42, 0.16) * 0.85, env(r) * vec3(1.0, 0.8, 0.6), 0.45);
  float heat = clamp(vHeat, 0.0, 1.0);
  vec3 col = mix(steel, heatCol, heat);
  vec3 inkCol = mix(vec3(0.74, 0.78, 0.84), vec3(0.95, 0.62, 0.45), heat) * (0.92 + 0.12 * fract(vSeed * 3.7));
  col = mix(col, inkCol, uInk);
  float d = (vObj.x * 0.8 + vObj.y * 0.6 - mix(-2.2, 2.2, uFlash)) * 4.5;
  col += vec3(1.0, 0.93, 0.82) * exp(-d * d) * sin(3.14159265 * uFlash) * 0.55;
  col = 1.0 - exp(-col * 1.6);
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Renders only while something moves (scroll, pointer, idle drift); capped fps on small devices; nothing while the tab is hidden. */
function Governor({ fps }: { fps: number }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    progress.wake = () => invalidate();
    invalidate();
    let raf = 0;
    let last = 0;
    const gap = 1000 / fps - 2;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || !progress.busy || now - last < gap) return;
      last = now;
      invalidate();
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      progress.wake = () => {};
    };
  }, [fps, invalidate]);
  return null;
}

function Bricks({ nx, onReady, onSlow }: Pick<Props, "nx" | "onReady" | "onSlow">) {
  const mesh = useRef<InstancedMesh>(null);
  const run = useRef({ cur: 0, time: 0, elapsed: 0, tx: 0, ty: 0, ready: false, prevBusy: false, count: 0, sum: 0, told: false });
  const scene = useMemo(() => {
    const data = buildBrickData(nx, markGeometry);
    const texture = new DataTexture(data.states, TEX_W, data.textureHeight, RGBAFormat, FloatType);
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    const geometry = new BoxGeometry(1, 1, 1);
    geometry.setAttribute("aSeed", new InstancedBufferAttribute(data.seed, 1));
    geometry.setAttribute("aStage", new InstancedBufferAttribute(data.stage, 1));
    const material = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      defines: { TEXW: TEX_W.toFixed(1), ROWS: data.rows.toFixed(1) },
      uniforms: {
        uStates: { value: texture },
        uBrick: { value: new Vector3(BRICK.w, BRICK.h, BRICK.d) },
        uA: { value: 0 },
        uB: { value: 1 },
        uMix: { value: 0 },
        uSpread: { value: 0.55 },
        uStageMode: { value: 0 },
        uTime: { value: 0 },
        uIdle: { value: 1 },
        uDark: { value: 0 },
        uInk: { value: 0 },
        uFlash: { value: 0 },
      },
    });
    return { n: data.n, texture, geometry, material };
  }, [nx]);

  useEffect(
    () => () => {
      scene.texture.dispose();
      scene.geometry.dispose();
      scene.material.dispose();
    },
    [scene],
  );

  useFrame((state, delta) => {
    const target = mesh.current;
    if (!target) return;
    const r = run.current;
    const dt = Math.min(delta, 0.1);
    const wide = state.size.width / state.size.height >= 1.05;
    r.elapsed += dt;
    r.cur += (progress.t - r.cur) * (1 - Math.exp(-dt * 7));
    r.tx += (progress.px - r.tx) * (1 - Math.exp(-dt * 5));
    r.ty += (progress.py - r.ty) * (1 - Math.exp(-dt * 5));
    const f = frameAt(r.cur, wide);
    // first screen: the bricks fly in on their own before the first scroll
    if (f.a === 0) f.mix = Math.max(f.mix, (1 - Math.pow(1 - Math.min(1, r.elapsed / 3.4), 3)) * 0.42);
    r.time += dt * f.idle;
    const u = scene.material.uniforms;
    u.uA.value = f.a;
    u.uB.value = f.b;
    u.uMix.value = f.mix;
    u.uSpread.value = f.spread;
    u.uStageMode.value = f.stageMode;
    u.uTime.value = r.time;
    u.uIdle.value = f.idle;
    u.uDark.value = f.dark;
    u.uInk.value = f.ink;
    u.uFlash.value = f.flash;
    const { width, height } = state.viewport;
    const unit = Math.min(width * (wide ? 0.44 : 0.8), height * (wide ? 0.8 : 0.4)) / 2.6;
    target.position.set(f.x * width * 0.5, f.y * height * 0.5, 0);
    target.scale.setScalar(unit * f.scale);
    target.rotation.set(-r.ty * 0.1, f.spin + r.tx * 0.16, 0);
    const moving = Math.abs(progress.t - r.cur) > 4e-4 || Math.abs(progress.px - r.tx) > 1e-3 || Math.abs(progress.py - r.ty) > 1e-3 || f.idle > 0.01 || r.elapsed < 3.5;
    if (!r.ready) {
      r.ready = true;
      onReady();
    }
    // adaptive: if the loop runs under ~20 fps the parent lowers the resolution, then switches the scene off
    if (r.prevBusy && !r.told && ++r.count > 12) {
      r.sum += Math.min(delta, 0.5);
      if (r.count === 72) {
        if (r.sum / 60 > 0.05) {
          r.told = true;
          onSlow();
        }
        r.sum = 0;
        r.count = 12;
      }
    }
    r.prevBusy = moving;
    progress.busy = moving;
  });

  return <instancedMesh ref={mesh} args={[scene.geometry, scene.material, scene.n]} frustumCulled={false} />;
}

export default function BrickSceneCanvas({ nx, dpr, lite, onReady, onSlow, onLost }: Props) {
  return (
    <Canvas
      flat
      linear
      dpr={dpr}
      frameloop="demand"
      gl={{ antialias: !lite, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 40 }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) =>
        gl.domElement.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          onLost();
        })
      }
    >
      <Governor fps={lite ? 30 : 60} />
      <Bricks nx={nx} onReady={onReady} onSlow={onSlow} />
    </Canvas>
  );
}
