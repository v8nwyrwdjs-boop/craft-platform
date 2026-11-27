"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useState } from "react";
import { canAffordWebGL, setSceneLive, useMotion } from "@/lib/motion";
import { nudge, progress } from "@/lib/scene-progress";

const Canvas3D = dynamic(() => import("./brick-scene-canvas"), { ssr: false });

class Boundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The persistent 3D object (React Three Fiber) behind the home chapters. Scroll position is the timeline:
 * the page writes chapter progress, the canvas reads it. Native scrolling is never touched. The chapters are
 * complete without it, so it mounts after idle, only where WebGL and the connection allow, and steps down
 * (lower resolution, then off) if frames come slowly.
 */
export function BrickScene() {
  const motion = useMotion();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [level, setLevel] = useState(0);
  const [cfg, setCfg] = useState({ nx: 13, dpr: 1.5, lite: false });
  const on = motion && mounted && level < 2;

  useEffect(() => {
    if (!motion || !canAffordWebGL()) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 700;
    setCfg({ nx: coarse ? 10 : 13, dpr: Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2), lite: coarse });
    const win = window as Window & { requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setMounted(true), { timeout: 1500 });
      return () => win.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setMounted(true), 300);
    return () => window.clearTimeout(id);
  }, [motion]);

  useEffect(() => {
    setSceneLive(on && ready);
    return () => setSceneLive(false);
  }, [on, ready]);

  useEffect(() => {
    if (!on) return;
    let tops: number[] = [];
    let ends: number[] = [];
    const measure = () => {
      const y = window.scrollY;
      const rects = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]")).map((el) => el.getBoundingClientRect());
      tops = rects.map((rect) => rect.top + y);
      ends = rects.map((rect) => rect.bottom + y);
    };
    const update = () => {
      if (!tops.length) return;
      const y = window.scrollY;
      const line = y + Math.min(y, window.innerHeight * 0.5); // 0 at the very top, the middle of the screen from half a screen on
      let c = 0;
      for (let i = 0; i < tops.length; i++) if (line >= tops[i]) c = i;
      progress.t = c + Math.min(1, Math.max(0, (line - tops[c]) / Math.max(1, ends[c] - tops[c])));
      nudge();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      progress.px = (event.clientX / window.innerWidth) * 2 - 1;
      progress.py = (event.clientY / window.innerHeight) * 2 - 1;
      nudge();
    };
    const resize = () => {
      measure();
      update();
    };
    measure();
    update();
    const observer = new ResizeObserver(resize);
    observer.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("pointermove", move);
      progress.t = 0;
    };
  }, [on]);

  return (
    <div className="f-stage" aria-hidden="true" data-ready={on && ready}>
      {on ? (
        <Boundary onFail={() => setLevel(2)}>
          <Canvas3D
            nx={cfg.nx}
            dpr={level === 1 ? Math.max(1, cfg.dpr - 0.5) : cfg.dpr}
            lite={cfg.lite}
            onReady={() => setReady(true)}
            onSlow={() => setLevel((value) => Math.min(2, value + 1))}
            onLost={() => setLevel(2)}
          />
        </Boundary>
      ) : null}
    </div>
  );
}
