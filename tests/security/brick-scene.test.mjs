import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { markGeometry } from "../../lib/brand-mark.ts";
import { STATES, TEX_W, TIERS, bricksFor, buildBrickData, inMark } from "../../lib/brick-shapes.ts";
import { CHAPTERS, frameAt } from "../../lib/brick-timeline.ts";

const root = new URL("../../", import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), "utf8");

test("brick data: exact counts, finite, deterministic, one brick per rank in every state", () => {
  const a = buildBrickData(8, markGeometry);
  const b = buildBrickData(8, markGeometry);
  assert.equal(a.n, bricksFor(8));
  assert.equal(a.states.length, STATES.length * 2 * a.rows * TEX_W * 4);
  assert.ok(a.states.every(Number.isFinite), "no NaN in the state texture");
  assert.deepEqual(Buffer.from(a.states.buffer), Buffer.from(b.states.buffer), "same count, same bricks");
  assert.equal(a.seed.length, a.n);
  assert.equal(a.stage.length, a.n);
  for (let tier = 0; tier < TIERS; tier++) assert.ok(a.stage.includes(tier), `tier ${tier} has bricks`);
  assert.ok(a.stage.every((value) => Number.isInteger(value) && value >= 0 && value < TIERS));
});

test("brick data: quaternions are unit length and the coin carries hot emblem bricks", () => {
  const data = buildBrickData(8, markGeometry);
  let hot = 0;
  for (let state = 0; state < STATES.length; state++) {
    for (let i = 0; i < data.n; i += 37) {
      const row = Math.floor(i / TEX_W);
      const col = (i % TEX_W) * 4;
      const q = ((state * 2 + 1) * data.rows + row) * TEX_W * 4 + col;
      const length = Math.hypot(data.states[q], data.states[q + 1], data.states[q + 2], data.states[q + 3]);
      assert.ok(Math.abs(length - 1) < 1e-4, `state ${state} brick ${i}`);
    }
  }
  const coin = STATES.indexOf("coin");
  for (let i = 0; i < data.n; i++) hot += data.states[(coin * 2 * data.rows + Math.floor(i / TEX_W)) * TEX_W * 4 + (i % TEX_W) * 4 + 3];
  assert.ok(hot > 20, "the CRAFT mark is raised from the coin in heat colour");
});

test("coin emblem follows the shared mark geometry", () => {
  const { c, brick, box } = markGeometry;
  const u = (x) => (x - box / 2) / (box / 2);
  const v = (y) => -(y - box / 2) / (box / 2);
  assert.equal(inMark(markGeometry, u(c.cx - c.r), v(c.cy)), true, "left side of the C");
  assert.equal(inMark(markGeometry, u(brick.cx), v(brick.cy)), true, "the brick in the mouth");
  assert.equal(inMark(markGeometry, u(c.cx), v(c.cy)), false, "inside the hole of the C");
  assert.equal(inMark(markGeometry, -0.95, 0.95), false, "far corner");
});

test("timeline: continuous, finite, ends on the coin, rests in the honest chapter", () => {
  const weights = (t, wide) => {
    const f = frameAt(t, wide);
    const w = new Array(STATES.length).fill(0);
    w[f.a] += 1 - f.mix;
    w[f.b] += f.mix;
    return w;
  };
  for (const wide of [true, false]) {
    let previous = weights(0, wide);
    for (let t = 0.002; t <= CHAPTERS; t += 0.002) {
      const w = weights(t, wide);
      const jump = Math.max(...w.map((value, i) => Math.abs(value - previous[i])));
      assert.ok(jump < 0.05, `state blend jumps ${jump.toFixed(3)} at t=${t.toFixed(3)} (wide=${wide})`);
      previous = w;
      const f = frameAt(t, wide);
      for (const key of ["x", "y", "scale", "spin", "dark", "ink", "idle", "flash", "mix"]) assert.ok(Number.isFinite(f[key]), `${key} at ${t}`);
      assert.ok(f.scale > 0);
    }
  }
  assert.equal(frameAt(0, true).b, 1);
  assert.equal(frameAt(0, true).mix, 0);
  const end = frameAt(CHAPTERS, true);
  assert.equal(end.b, STATES.indexOf("coin"));
  assert.equal(end.mix, 1);
  assert.equal(frameAt(5.5, true).idle, 0, "the object is still in the honest chapter");
  assert.ok(frameAt(3.5, true).ink > 0.9, "silhouette in the products chapter");
  assert.ok(frameAt(6.6, true).flash > 0 && frameAt(6.6, true).flash < 1, "one metallic flash while the coin closes");
});

test("3D scene: React Three Fiber, paced, hidden-aware, lazy, decorative, same-origin", () => {
  const canvas = read("components/brick-scene-canvas.tsx");
  const wrapper = read("components/brick-scene.tsx");
  assert.match(canvas, /from "@react-three\/fiber"/);
  assert.match(canvas, /frameloop="demand"/);
  assert.match(canvas, /document\.hidden/);
  assert.match(canvas, /webglcontextlost/);
  assert.match(canvas, /InstancedBufferAttribute/);
  assert.match(wrapper, /ssr: false/);
  assert.match(wrapper, /canAffordWebGL\(\)/);
  assert.match(wrapper, /requestIdleCallback/);
  assert.match(wrapper, /aria-hidden="true"/);
  assert.match(wrapper, /componentDidCatch/);
  assert.match(wrapper, /useMotion\(\)/);
  assert.match(wrapper, /passive: true/);
  for (const source of [canvas, wrapper]) assert.doesNotMatch(source, /https?:\/\//, "no external loads");
});

test("home: seven chapters, no prices, headline and headings within the copy rules", () => {
  const page = read("app/(site)/page.tsx");
  assert.match(page, /<BrickScene \/>/);
  assert.equal((page.match(/data-chapter/g) ?? []).length, 7);
  assert.doesNotMatch(page, /₽|руб|RUB/i, "the homepage shows no prices");
  const words = (text) => text.trim().split(/\s+/).length;
  const h1 = page.match(/className="f-display f-h1">\s*([^<]+?)\s*<\/h1>/)?.[1] ?? "";
  assert.ok(h1 && words(h1) <= 7, `headline has ${words(h1)} words`);
  assert.doesNotMatch(h1, /\bне\b[^.]*,\s*а\b/i, "no negate-and-replace headline");
  for (const match of page.matchAll(/className="f-display f-h2">\s*([^<]+?)\s*<\/h2>/g)) assert.ok(words(match[1]) <= 6, `"${match[1]}" is longer than six words`);
});
