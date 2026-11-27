"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useState } from "react";
import { canAffordWebGL, useMotion, useSceneLive } from "@/lib/motion";

const BackdropCanvas = dynamic(() => import("./site-backdrop-canvas"), { ssr: false });

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
 * The gradient ground of the site: the ShaderGradient library on a fixed canvas behind the content.
 * The page is complete without it (plain white paper), so it mounts after idle, only where WebGL and the
 * connection allow it, and it vanishes quietly on any failure.
 */
export function SiteBackdrop() {
  const motion = useMotion();
  const sceneLive = useSceneLive();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    if (!canAffordWebGL()) return;
    setCoarse(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 700);
    const win = window as Window & { requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setMounted(true), { timeout: 1800 });
      return () => win.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setMounted(true), 400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="f-backdrop" aria-hidden="true" data-ready={ready}>
      {mounted ? (
        <Boundary onFail={() => setMounted(false)}>
          <BackdropCanvas animate={motion && !slow && !(sceneLive && coarse)} pixelDensity={coarse ? 0.55 : 0.8} onReady={() => setReady(true)} onSlow={() => setSlow(true)} />
        </Boundary>
      ) : null}
    </div>
  );
}
