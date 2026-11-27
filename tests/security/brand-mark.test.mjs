import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { markArcPath, markGeometry } from "../../lib/brand-mark.ts";

const root = new URL("../../", import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), "utf8");
const { c, brick } = markGeometry;

test("the arc path is derived from the C geometry", () => {
  const mouth = (c.mouthDeg * Math.PI) / 180;
  const x = (c.cx + c.r * Math.cos(mouth)).toFixed(2);
  const y1 = (c.cy - c.r * Math.sin(mouth)).toFixed(2);
  const y2 = (c.cy + c.r * Math.sin(mouth)).toFixed(2);
  assert.equal(markArcPath, `M${x} ${y1}A${c.r} ${c.r} 0 1 0 ${x} ${y2}`);
});

test("the favicon is the same mark as the component", () => {
  const svg = read("public/icon.svg");
  assert.ok(svg.includes(markArcPath), "favicon uses the shared arc path");
  assert.ok(svg.includes(`stroke-width="${c.stroke}"`) || svg.includes(`stroke-width:${c.stroke}`), "stroke width matches");
  assert.ok(svg.includes(`width="${brick.w}"`) && svg.includes(`height="${brick.h}"`), "brick size matches");
  assert.ok(svg.includes(`rotate(${brick.rotDeg} ${brick.cx} ${brick.cy})`), "brick rotation matches");
  assert.ok(svg.includes("prefers-color-scheme"), "favicon adapts to a dark tab bar");
});

test("the liquid logo masks the same geometry as the SVG mark", () => {
  const gl = read("lib/liquid-logo-gl.ts");
  assert.ok(gl.includes('from "./brand-mark"'), "shares lib/brand-mark.ts, no copied constants");
  assert.ok(gl.includes("new Path2D(markArcPath)"), "C is the shared arc path");
  assert.ok(gl.includes("markGeometry") && gl.includes("brick.rotDeg") && gl.includes("brick.rx"), "brick comes from the shared geometry");
});

test("the liquid shader keeps its MIT attribution", () => {
  const gl = read("lib/liquid-logo-gl.ts");
  assert.ok(gl.includes("collidingScopes/liquid-logo") && gl.includes("Alan Ang") && gl.includes("MIT"), "header credits the source");
  const licence = read("licenses/liquid-logo.MIT.txt");
  assert.match(licence, /MIT License/);
  assert.match(licence, /Copyright \(c\) 2025 Alan Ang/);
  assert.match(licence, /Permission is hereby granted/);
});

test("the live mark degrades safely", () => {
  const component = read("components/liquid-logo.tsx");
  assert.ok(component.includes("saveData"), "Save-Data keeps the poster");
  assert.ok(component.includes("prefers-reduced-motion"), "reduced motion gets a still frame");
  assert.ok(component.includes("IntersectionObserver"), "the context exists only near the viewport");
  assert.ok(component.includes("document.hidden"), "the loop pauses in a hidden tab");
  assert.ok(component.includes("Math.min(window.devicePixelRatio"), "pixel ratio is capped");
  assert.ok(component.includes("<BrandMark") && component.includes("/brand/mark-liquid-"), "poster or flat SVG stays underneath as the fallback");
  const gl = read("lib/liquid-logo-gl.ts");
  assert.ok(gl.includes("return null"), "a missing WebGL context returns null instead of throwing");
  assert.ok(gl.includes("loseContext"), "the GL context is released on dispose");
  assert.ok(gl.includes("webglcontextlost"), "a lost context hands control back to the poster");
  assert.ok(!gl.includes("tanh("), "tanh is computed through a clamped exp (no NaN on small plasma values)");
});

test("the pre-rendered header stills exist and are valid PNGs", () => {
  for (const tone of ["light", "dark"]) {
    const path = join(root, `public/brand/mark-liquid-${tone}.png`);
    assert.ok(existsSync(path), `${tone} still exists`);
    const bytes = readFileSync(path);
    assert.deepEqual([...bytes.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], "PNG signature");
    assert.equal(bytes.readUInt32BE(16), 128, "width");
    assert.equal(bytes.readUInt32BE(20), 128, "height");
    assert.ok(statSync(path).size < 40_000, "small enough for a header image");
  }
});

test("the mark is original: not the old hexagon", () => {
  for (const file of ["components/brand-mark.tsx", "public/icon.svg", "lib/liquid-logo-gl.ts"]) {
    assert.ok(!/hexagon|<polygon/i.test(read(file)), `${file} has no hexagon`);
  }
});
