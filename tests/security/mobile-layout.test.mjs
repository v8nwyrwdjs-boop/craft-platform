import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const showcase = readFileSync(new URL("../../components/product-showcase.tsx", import.meta.url), "utf8");

test("homepage hero stacks on mobile and keeps text separate from artwork", () => {
  assert.match(css, /\.home-page \.hero\s*\{[^}]*grid-template-columns:minmax\(0,1fr\)!important/s);
  assert.match(css, /\.home-page \.hero-copy\s*\{[^}]*min-width:0/s);
  assert.match(css, /\.home-page \.hero-art\s*\{[^}]*grid-column:1/s);
});

test("Russian headings use normal word boundaries without automatic hyphenation", () => {
  assert.match(css, /\.home-page h1[^}]*overflow-wrap:normal/s);
  assert.match(css, /\.home-page h1[^}]*word-break:normal/s);
  assert.match(css, /\.home-page h1[^}]*hyphens:manual/s);
});

test("narrow-phone direction cards use a readable single-column layout", () => {
  assert.match(css, /@media\s*\(max-width:\s*390px\)[\s\S]*?\.home-page \.direction-showcase\s*\{grid-template-columns:minmax\(0,1fr\)\}/);
});

test("carousel controls expose comfortable touch targets", () => {
  assert.match(css, /\.showcase-dots button\s*\{[^}]*min-width:44px/s);
  assert.match(css, /\.showcase-dots button\s*\{[^}]*min-height:44px/s);
  assert.match(css, /\.showcase-arrows button\s*\{[^}]*min-width:44px/s);
  assert.match(css, /\.showcase-arrows button\s*\{[^}]*min-height:44px/s);
});

test("automatic carousel rotation respects reduced-motion preferences", () => {
  assert.match(showcase, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
  assert.match(showcase, /if \(paused \|\| reducedMotion\) return/);
});


test("the signature hero scene keeps WebGL bounded and motion-aware", async () => {
  const scene = readFileSync(new URL("../../components/craft-hero-scene.tsx", import.meta.url), "utf8");
  assert.match(scene, /IntersectionObserver/);
  assert.match(scene, /frameloop=\{reducedMotion \|\| !isVisible \? "demand" : "always"\}/);
  assert.match(scene, /dpr=\{\[1, 1\.25\]\}/);
  assert.match(scene, /powerPreference: "low-power"/);
  assert.match(scene, /fallback=\{<div className="craft-scene-fallback"/);
  assert.match(scene, /liquidFragmentShader/);
  assert.match(scene, /atmosphereFragmentShader/);

  assert.match(scene, /craft-liquid-filter/);
  assert.match(scene, /craft-liquid-wordmark/);

});


test("CRAFT homepage keeps its primary navigation reachable on mobile", async () => {
  const theme = readFileSync(new URL("../../app/craft-theme.css", import.meta.url), "utf8");
  assert.match(theme, /@media \(max-width: 760px\)[\s\S]*?\.craft-nav\s*\{[^}]*display:\s*flex/s);
  assert.match(theme, /@media \(max-width: 760px\)[\s\S]*?\.craft-nav\s*\{[^}]*overflow-x:\s*auto/s);
  assert.match(theme, /@media \(max-width: 760px\)[\s\S]*?\.craft-nav a\s*\{[^}]*min-height:\s*44px/s);
  assert.match(theme, /@media \(max-width: 760px\)[\s\S]*?\.craft-header-inner\s*\{[^}]*min-height:\s*104px/s);
  assert.match(theme, /@media \(max-width: 760px\)[\s\S]*?\.craft-story-pin\s*\{[^}]*top:\s*104px/s);
});
