import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");

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
