"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { useEffect, useRef } from "react";

type Props = { animate: boolean; pixelDensity: number; onReady: () => void; onSlow: () => void };

/**
 * Paces the render loop: the library's canvas draws at display rate, a slow colour field needs about 30 fps.
 * Nothing is drawn while the tab is hidden or when animation is off. If frames come slower than ~20 fps the
 * parent is told to freeze the gradient on its current frame.
 */
function Governor({ animate, onReady, onSlow }: Pick<Props, "animate" | "onReady" | "onSlow">) {
  const invalidate = useThree((state) => state.invalidate);
  const setFrameloop = useThree((state) => state.setFrameloop);
  const frames = useRef({ count: 0, sum: 0, told: false, ready: false });

  useEffect(() => {
    setFrameloop("demand");
    invalidate();
  }, [setFrameloop, invalidate]);

  useEffect(() => {
    if (!animate) {
      invalidate();
      return;
    }
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || now - last < 33) return;
      last = now;
      invalidate();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, invalidate]);

  useFrame((_, delta) => {
    const state = frames.current;
    if (!state.ready) {
      state.ready = true;
      onReady();
    }
    if (!animate || state.told) return;
    state.count += 1;
    if (state.count <= 12) return; // warm-up: shader compile, texture upload
    state.sum += Math.min(delta, 0.5);
    if (state.count === 72) {
      if (state.sum / 60 > 0.05) {
        state.told = true;
        onSlow();
      }
      state.sum = 0;
      state.count = 12;
    }
  });
  return null;
}

/**
 * Light foundry palette: a cool steel mist with a warm ember edge. The mesh is the ShaderGradient library's own.
 * The library's lighting greys out pale colours and burns out above brightness ~1.4, so the colours are
 * mid-tone and the layer is laid over white paper at half opacity (.f-backdrop in v2.css). That keeps the
 * darkest pixel light enough for every text colour on paper (checked by script, see docs).
 */
export default function SiteBackdropCanvas({ animate, pixelDensity, onReady, onSlow }: Props) {
  return (
    <ShaderGradientCanvas pixelDensity={pixelDensity} fov={45} pointerEvents="none" lazyLoad={false} powerPreference="low-power" style={{ position: "absolute", inset: 0 }}>
      <Governor animate={animate} onReady={onReady} onSlow={onSlow} />
      <ShaderGradient
        control="props"
        type="plane"
        animate={animate ? "on" : "off"}
        uTime={0}
        uSpeed={0.1}
        uStrength={1.4}
        uDensity={1.1}
        uFrequency={5.5}
        uAmplitude={1}
        color1="#f4f7fb"
        color2="#bccbe0"
        color3="#ffa878"
        grain="off"
        lightType="3d"
        brightness={1.15}
        reflection={0.05}
        cAzimuthAngle={180}
        cPolarAngle={90}
        cDistance={3.6}
        cameraZoom={1}
        positionX={-1.4}
        positionY={0}
        positionZ={0}
        rotationX={0}
        rotationY={10}
        rotationZ={50}
        enableTransition={false}
      />
    </ShaderGradientCanvas>
  );
}
