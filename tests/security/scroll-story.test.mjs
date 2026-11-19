import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const story = readFileSync(new URL("../../components/craft-scroll-story.tsx", import.meta.url), "utf8");
const scene = readFileSync(new URL("../../components/craft-scroll-story-scene.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../../app/craft-theme.css", import.meta.url), "utf8");
const home = readFileSync(new URL("../../app/page.tsx", import.meta.url), "utf8");
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

test("3D story uses a bounded mobile GPU budget and demand rendering", () => {
  assert.match(scene, /frameloop="demand"/);
  assert.match(scene, /dpr=\{\[1, 1\.15\]\}/);
  assert.match(scene, /powerPreference: "low-power"/);
  assert.match(scene, /<instancedMesh/);
  assert.match(scene, /COMPONENT_COUNT = 640/);
  assert.match(scene, /instance\.instanceMatrix\.needsUpdate = true/);
  assert.match(scene, /dispose\(\)/);
});

test("legacy point-cloud morph is removed from the active scene", () => {
  assert.doesNotMatch(scene, /MorphingParticles/);
  assert.doesNotMatch(scene, /<points\b/);
  assert.doesNotMatch(scene, /gl_PointSize/);
  assert.doesNotMatch(scene, /particleVertexShader|particleFragmentShader/);
  assert.match(scene, /function ComponentAssembly/);
});

test("five authored component layouts provide deterministic reversible morph targets", () => {
  assert.match(scene, /function createLayout/);
  assert.match(scene, /Array\.from\(\{ length: 5 \}/);
  assert.match(scene, /const from = layouts\[stage\]/);
  assert.match(scene, /const to = layouts\[Math\.min\(stage \+ 1, 4\)\]/);
  assert.match(scene, /THREE\.MathUtils\.lerp/);
  assert.match(scene, /progressRef\.current/);
  assert.match(scene, /Components travel on deterministic shallow arcs/);
});

test("binary typography is structured and catalogue resolves into three authored panels", () => {
  assert.match(scene, /BINARY_GLYPHS/);
  assert.match(scene, /readable binary typography/i);
  assert.match(scene, /three catalogue panels/i);
  assert.match(scene, /Math\.min\(2, Math\.floor\(index \/ 214\)\)/);
});

test("studio environment and material response remain part of the scene", () => {
  assert.match(scene, /MeshStandardMaterial/);
  assert.match(scene, /metalness: 0\.92/);
  assert.match(scene, /EquirectangularReflectionMapping/);
  assert.match(scene, /scene\.environment = environment/);
  assert.match(scene, /environment\.dispose\(\)/);
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
