import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

// Owner decision 2026-11-26: ShaderGradient (site ground), liquid-logo (animated logo), React Three Fiber (3D object).
// These checks keep the three of them cheap, same-origin and optional. They read sources; they are not visual approval.

const root = new URL("../../", import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), "utf8");
const pkg = JSON.parse(read("package.json"));

test("the three libraries are installed; the new ones are pinned or compatible with React 19", () => {
  assert.equal(pkg.dependencies["@shadergradient/react"], "2.4.20", "ShaderGradient is pinned to the version that was tested");
  assert.match(pkg.dependencies["@react-three/fiber"], /^\^9/, "React Three Fiber 9 matches React 19");
  assert.ok(pkg.dependencies["three"], "three");
  assert.ok(pkg.dependencies["three-stdlib"] && pkg.dependencies["camera-controls"], "peer packages of ShaderGradient");
  assert.ok(!Object.keys(pkg.dependencies).some((name) => /paper-design|liquid-logo/.test(name)), "liquid-logo is ported with its MIT notice, not installed as a package");
});

test("the gradient ground loads nothing from other origins and does not block the page", () => {
  const canvas = read("components/site-backdrop-canvas.tsx");
  assert.ok(canvas.includes('lightType="3d"'), "built-in lights, no HDR download");
  assert.ok(!/lightType="env"|envPreset|envBasePath|https?:\/\//.test(canvas), "no environment map or URL");
  assert.ok(canvas.includes('pointerEvents="none"'), "the canvas never takes pointer events");
  assert.ok(canvas.includes('setFrameloop("demand")') && canvas.includes("document.hidden"), "paced loop that pauses in a hidden tab");
  assert.ok(canvas.includes("onSlow"), "slow frames freeze the gradient");
  const backdrop = read("components/site-backdrop.tsx");
  assert.ok(/dynamic\(\(\) => import\("\.\/site-backdrop-canvas"\), \{ ssr: false \}\)/.test(backdrop), "lazy, client only");
  assert.ok(backdrop.includes("canAffordWebGL()") && backdrop.includes("requestIdleCallback"), "mounts after idle, only where affordable");
  assert.ok(backdrop.includes('aria-hidden="true"') && backdrop.includes("componentDidCatch"), "decorative and failure-tolerant");
  const layout = read("app/(site)/layout.tsx");
  assert.ok(layout.includes("<SiteBackdrop />"), "mounted once in the site layout, so navigation does not rebuild it");
});

test("heavy visuals respect Save-Data, slow networks, weak devices and the motion switch", () => {
  const motion = read("lib/motion.ts");
  for (const needle of ["saveData", "2g", "deviceMemory", "prefers-reduced-data", "prefers-reduced-motion", "WEBGL_lose_context"]) {
    assert.ok(motion.includes(needle), needle);
  }
  assert.ok(/try \{[\s\S]*localStorage[\s\S]*\} catch/.test(motion), "storage access is guarded");
  const footer = read("components/site-footer.tsx");
  assert.ok(footer.includes("<MotionToggle />"), "visible motion switch");
  const toggle = read("components/motion-toggle.tsx");
  assert.ok(toggle.includes('role="switch"') && toggle.includes("aria-checked"), "a real switch");
});

test("the ground is a veil over white paper, not a replacement for it", () => {
  const css = read("app/v2.css");
  assert.match(css, /\.f-backdrop \{[^}]*position: fixed[^}]*pointer-events: none/);
  assert.match(css, /\.f-backdrop\[data-ready="true"\] \{ opacity: 0\.42; \}/, "reduced backdrop opacity keeps text contrast independent of the shader");
  assert.match(css, /\.f-ground-paper \{ background: transparent/, "paper sections let the ground show through");
  assert.match(css, /html \{[^}]*background: var\(--ground-paper\)/, "without WebGL the page is plain white paper");
});
