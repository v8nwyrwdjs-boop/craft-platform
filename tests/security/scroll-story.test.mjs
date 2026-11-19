import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const story = readFileSync(new URL("../../components/craft-scroll-story.tsx", import.meta.url), "utf8");
const scene = readFileSync(new URL("../../components/craft-scroll-story-scene.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../../app/craft-theme.css", import.meta.url), "utf8");
const home = readFileSync(new URL("../../app/page.tsx", import.meta.url), "utf8");

test("homepage replaces the disconnected sphere and carousel with one scroll story", () => {
  assert.match(home, /CraftScrollStory/);
  assert.doesNotMatch(home, /ProductShowcase|CraftHeroScene/);
  assert.match(story, /binary|КОД/);
  assert.match(story, /КОМПЬЮТЕР/);
  assert.match(story, /цифровой актив/);
  assert.match(story, /ЭКОСИСТЕМА/);
});

test("all narrative copy remains available in accessible DOM", () => {
  assert.match(story, /aria-live="polite"/);
  assert.match(story, /aria-label="Этапы создания цифрового продукта"/);
  assert.match(story, /craft-story-archive/);
  assert.match(story, /prefers-reduced-motion/);
});

test("scroll progress uses passive native scrolling and cleans up listeners", () => {
  assert.match(story, /addEventListener\("scroll", updateProgress, \{ passive: true \}\)/);
  assert.match(story, /removeEventListener\("scroll", updateProgress\)/);
  assert.match(story, /cancelAnimationFrame/);
  assert.doesNotMatch(story, /preventDefault\(/);
  assert.doesNotMatch(story, /wheel|touchmove/);
});

test("3D morph uses one demand-rendered scene with a mobile GPU budget", () => {
  assert.match(scene, /frameloop="demand"/);
  assert.match(scene, /dpr=\{\[1, 1\.15\]\}/);
  assert.match(scene, /powerPreference: "low-power"/);
  assert.match(scene, /aBinary/);
  assert.match(scene, /aMonitor/);
  assert.match(scene, /aAsset/);
  assert.match(scene, /aSystem/);
  assert.match(scene, /lineSegments/);
  assert.match(scene, /dispose\(\)/);
});

test("dark visual system covers mobile and reduced-motion layouts", () => {
  assert.match(css, /--craft-bg:\s*#08090b/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /@media\s*\(max-width:\s*390px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /craft-story-archive/);
});

test("scroll stages include physical monitor, metallic asset, and spatial ecosystem models", () => {
  assert.match(scene, /function PhysicalProductObjects/);
  assert.match(scene, /boxGeometry args=\{\[3\.2, 2\.02, 0\.18\]\}/);
  assert.match(scene, /cylinderGeometry args=\{\[1\.12, 1\.12, 0\.2, 96\]\}/);
  assert.match(scene, /icosahedronGeometry/);
  assert.match(scene, /torusGeometry/);
  assert.match(scene, /monitorTarget/);
  assert.match(scene, /coinTarget/);
  assert.match(scene, /ecosystemTarget/);
});

test("physical 3D objects respect demand rendering outside active stages", () => {
  assert.match(scene, /if \(transitioning \|\| coinTarget > 0\.02 \|\| ecosystemTarget > 0\.02\) invalidate\(\)/);
  assert.match(scene, /group\.visible = next > 0\.008/);
});
