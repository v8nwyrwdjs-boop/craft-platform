import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const story = readFileSync(new URL("../../components/craft-scroll-story.tsx", import.meta.url), "utf8");
const scene = readFileSync(new URL("../../components/craft-scroll-story-scene.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../../app/craft-theme.css", import.meta.url), "utf8");
const home = readFileSync(new URL("../../app/(legacy)/page.tsx", import.meta.url), "utf8");
const masterSpec = readFileSync(new URL("../../docs/CRAFT-MASTER-SPEC.md", import.meta.url), "utf8");

test("homepage replaces the disconnected sphere and carousel with one scroll story", () => {
  assert.match(home, /CraftScrollStory/);
  assert.doesNotMatch(home, /ProductShowcase|CraftHeroScene/);
  assert.match(story, /binary|ПРОГРАММИРОВАНИЕ/);
  assert.match(story, /ЦИФРОВЫЕ ПРОДУКТЫ/);
  assert.match(story, /цифровой актив|цифровые активы/);
  assert.match(story, /ПРОГРАММИРОВАНИЕ/);
  assert.match(story, /КРИПТОВАЛЮТА/);
  assert.match(story, /КАТАЛОГ CRAFT/);
  assert.match(story, /ЭКОСИСТЕМА/);
});

test("all narrative copy remains available in accessible DOM", () => {
  assert.match(story, /aria-live="polite"/);
  assert.match(story, /aria-label="Этапы создания цифрового продукта/);
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

const layoutSource = readFileSync(new URL("../../lib/craft-story-layout.ts", import.meta.url), "utf8");

test("3D story uses a bounded GPU budget, demand rendering and a handful of instanced families", () => {
  assert.match(scene, /frameloop="demand"/);
  assert.match(scene, /dpr=\{\[1, quality === "high" \? 1\.5 : 1\.15\]\}/);
  assert.match(scene, /powerPreference: "low-power"/);
  assert.match(scene, /<instancedMesh/);
  assert.match(scene, /DynamicDrawUsage/);
  assert.match(scene, /instanceMatrix\.needsUpdate = true/);
  assert.match(scene, /instanceColor\.needsUpdate = true/);
  assert.match(scene, /function detectQuality/);
  assert.match(scene, /frustumCulled=\{false\}/);
  assert.match(scene, /webglcontextlost/);
});

test("scene releases GPU resources and honours reduced motion for pointer interaction", () => {
  assert.match(scene, /geometries\[family\]\.dispose\(\)/);
  assert.match(scene, /materials\[family\]\.dispose\(\)/);
  assert.match(scene, /target\.dispose\(\)/);
  assert.match(scene, /if \(reducedMotion\) return;/);
  assert.match(scene, /event\.pointerType === "touch"/);
  assert.match(scene, /passive: true/);
  assert.match(scene, /removeEventListener\("pointermove"/);
});

test("legacy point-cloud morph and generic cube instances are gone from the active scene", () => {
  assert.doesNotMatch(scene, /MorphingParticles/);
  assert.doesNotMatch(scene, /<points\b/);
  assert.doesNotMatch(scene, /gl_PointSize/);
  assert.doesNotMatch(scene, /COMPONENT_COUNT/);
  assert.match(scene, /function Assembly/);
});

test("scene consumes the pure authored layout module instead of embedding layout maths", () => {
  assert.match(scene, /from "\.\.\/lib\/craft-story-layout"/);
  assert.match(scene, /sampleStory\(layout, progress/);
  assert.match(scene, /sampleCamera\(progress, aspect/);
  assert.match(scene, /progressRef\.current/);
  assert.match(layoutSource, /There is no randomness|no randomness/);
  assert.doesNotMatch(layoutSource, /Math\.random\(/);
  assert.doesNotMatch(layoutSource, /from "three"/);
});

test("binary typography is real ASCII for CRAFT and the catalogue resolves into three authored panels", () => {
  assert.match(layoutSource, /"CRAFT" in 8-bit ASCII/);
  assert.match(layoutSource, /0x43, 0x52, 0x41, 0x46, 0x54/);
  assert.match(layoutSource, /function buildCatalogue/);
  assert.match(layoutSource, /const cards = \[/);
});

test("studio environment, per-family material response and instanced colour remain part of the scene", () => {
  assert.match(scene, /MeshStandardMaterial/);
  assert.match(scene, /PMREMGenerator/);
  assert.match(scene, /material\.envMap = target\.texture/);
  assert.match(scene, /toneMapped: false/);
  assert.match(scene, /setColorAt/);
});

test("dark visual system covers mobile and reduced-motion layouts", () => {
  assert.match(css, /--craft-bg:\s*#08090b/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /@media\s*\(max-width:\s*390px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /craft-story-archive/);
});

test("master specification is indexed and records the no-particle architecture", () => {
  assert.match(masterSpec, /Continuous component-to-component transformation/);
  assert.match(masterSpec, /replace the particle-cloud model/i);
  assert.match(masterSpec, /Mobile-first delivery/);
});
