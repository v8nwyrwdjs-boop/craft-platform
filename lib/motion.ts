import { useSyncExternalStore } from "react";

/**
 * One switch for decorative motion: the WebGL backdrop, the liquid logo, the 3D scene.
 * Default follows the system setting (reduced motion = off); the footer switch overrides it and the choice
 * is remembered in this browser only. Content never depends on it.
 */
const KEY = "craft-motion";
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "on") return true;
    if (stored === "off") return false;
  } catch {
    /* storage can be blocked; fall through to the system setting */
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getMotion(): boolean {
  return read();
}

export function setMotion(on: boolean) {
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* in-memory only for this page view */
  }
  document.documentElement.dataset.motion = on ? "on" : "off";
  listeners.forEach((listener) => listener());
}

export function subscribeMotion(listener: () => void) {
  listeners.add(listener);
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", listener);
    window.removeEventListener("storage", listener);
  };
}

/** true while decorative motion is allowed; true on the server so the markup matches the default */
export function useMotion(): boolean {
  return useSyncExternalStore(subscribeMotion, getMotion, () => true);
}

/** Cheap checks that keep heavy visuals away from devices and connections that cannot afford them. */
export function canAffordWebGL(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /2g$/.test(nav.connection.effectiveType)) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 2) return false;
  if (window.matchMedia("(prefers-reduced-data: reduce)").matches) return false;
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) return false;
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** Set while the 3D scene is drawing: the page hides its static stand-in and the backdrop stops animating on phones. */
let sceneLive = false;
const sceneListeners = new Set<() => void>();

export function setSceneLive(on: boolean) {
  sceneLive = on;
  if (on) document.documentElement.dataset.scene = "live";
  else delete document.documentElement.dataset.scene;
  sceneListeners.forEach((listener) => listener());
}

export function useSceneLive(): boolean {
  return useSyncExternalStore(
    (listener) => {
      sceneListeners.add(listener);
      return () => {
        sceneListeners.delete(listener);
      };
    },
    () => sceneLive,
    () => false,
  );
}
