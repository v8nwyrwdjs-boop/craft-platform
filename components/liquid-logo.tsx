"use client";

import { useEffect, useRef, useState } from "react";
import { createLiquidLogo } from "@/lib/liquid-logo-gl";
import { BrandMark } from "./brand-mark";

/** label="" marks the mark as decorative (a visible wordmark sits next to it). */
type Props = { size?: number; dark?: boolean; label?: string; fps?: number; poster?: boolean };

/**
 * The CRAFT mark as liquid metal (shader adapted from liquid-logo, see lib/liquid-logo-gl.ts).
 * The server-rendered poster is the same shader frozen at its first live frame (public/brand, made by
 * scripts/brand/render_liquid_mark.py); it stays when WebGL is missing, Save-Data is on or the context is lost.
 * Without a poster the flat SVG mark takes that role. Reduced motion gets one still frame. The loop runs only near the viewport and while
 * the tab is visible; the GL context exists only while the mark is near the screen.
 */
export function LiquidLogo({ size = 96, dark = false, label = "CRAFT", fps = 30, poster = true }: Props) {
  const wrap = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [near, setNear] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const holder = wrap.current;
    if (!holder) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: "240px" });
    observer.observe(holder);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = canvas.current;
    const holder = wrap.current;
    if (!near || !element || !holder) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    element.width = Math.max(48, Math.round(size * dpr));
    element.height = element.width;
    let frame = 0;
    const mark = createLiquidLogo(element, dark, () => {
      if (frame) cancelAnimationFrame(frame);
      setLive(false);
    });
    if (!mark) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer: [number, number] = [0, 0];
    const start = performance.now();
    const interval = 1000 / fps;
    let last = 0;

    const draw = (now: number) => mark.draw(reduce.matches ? 3.2 : (now - start) / 1000 + 3.2, pointer);
    const tick = (now: number) => {
      frame = 0;
      if (now - last >= interval) {
        last = now;
        draw(now);
      }
      schedule();
    };
    const schedule = () => {
      if (!frame && !document.hidden && !reduce.matches) frame = requestAnimationFrame(tick);
    };

    draw(performance.now());
    setLive(true);
    schedule();

    const onVisibility = () => schedule();
    const onPointer = (event: PointerEvent) => {
      const box = holder.getBoundingClientRect();
      pointer[0] = Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width - 0.5) * 2));
      pointer[1] = Math.max(-1, Math.min(1, (0.5 - (event.clientY - box.top) / box.height) * 2));
      if (reduce.matches) draw(performance.now());
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      mark.dispose();
      setLive(false);
    };
  }, [near, size, dark, fps]);

  return (
    <span
      ref={wrap}
      className="f-liquid"
      style={{ width: size, height: size }}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {poster ? <img src={`/brand/mark-liquid-${dark ? "dark" : "light"}.png`} width={size} height={size} alt="" decoding="async" /> : <BrandMark size={size} />}
      {near ? <canvas key={`${size}-${dark}`} ref={canvas} aria-hidden="true" data-live={live} /> : null}
    </span>
  );
}
