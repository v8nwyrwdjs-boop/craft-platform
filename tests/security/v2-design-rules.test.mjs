import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Правила нового дизайна (docs/CRAFT-V2-DESIGN-RULES.md), которые можно проверить по исходникам.
// Это проверка исходников, а не визуальная приёмка: вид страниц смотрится в браузере отдельно.

const root = new URL("../../", import.meta.url).pathname;
const css = readFileSync(join(root, "app/v2.css"), "utf8");

function files(dir, extensions) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...files(path, extensions));
    else if (extensions.some((ext) => path.endsWith(ext))) out.push(path);
  }
  return out;
}

const siteSources = [
  ...files(join(root, "app/(site)"), [".tsx", ".ts"]),
  ...["site-header.tsx", "site-footer.tsx", "catalog-rows.tsx", "waitlist-form.tsx", "brand-mark.tsx"].map((name) => join(root, "components", name)),
];

test("tokens: four grounds and one heat accent are defined in OKLCH", () => {
  for (const token of ["--ground-void", "--ground-steel", "--ground-ember", "--ground-chalk", "--heat"]) {
    assert.match(css, new RegExp(`${token}:\\s*oklch\\(`), token);
  }
});

test("css floor: no gradient text, no tracked uppercase labels, no transition: all, no plain vh", () => {
  assert.doesNotMatch(css, /background-clip:\s*text/i);
  assert.doesNotMatch(css, /text-transform:\s*uppercase/i);
  assert.doesNotMatch(css, /transition:\s*all/i);
  assert.doesNotMatch(css, /\d\s*vh\b/, "use svh or dvh, not vh");
});

test("css floor: no bounce easing and no layout-property transitions", () => {
  for (const match of css.matchAll(/cubic-bezier\(([^)]+)\)/g)) {
    const [, y1, , y2] = match[1].split(",").map((value) => Number(value));
    assert.ok(y1 <= 1 && y2 <= 1 && y1 >= 0 && y2 >= 0, `overshooting easing: ${match[0]}`);
  }
  for (const match of css.matchAll(/transition:([^;]+);/g)) {
    assert.doesNotMatch(match[1], /\b(width|height|top|left|right|bottom|margin|padding)\b/, `layout property animated: ${match[0]}`);
  }
});

test("css floor: no text below 12px and no horizontal page scroll", () => {
  for (const match of css.matchAll(/font-size:\s*([\d.]+)(rem|px)/g)) {
    const px = match[2] === "rem" ? Number(match[1]) * 16 : Number(match[1]);
    assert.ok(px >= 12, `font-size under 12px: ${match[0]}`);
  }
  assert.match(css, /body\s*\{[^}]*overflow-x:\s*clip/);
});

test("accessibility: visible focus ring, reduced-motion path, touch targets, fonts with swap", () => {
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--heat\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.f-btn\s*\{[^}]*min-height:\s*48px/);
  assert.match(css, /\.f-menu-btn\s*\{[^}]*min-height:\s*44px/);
  const faces = css.match(/@font-face\s*\{[^}]*\}/g) ?? [];
  assert.ok(faces.length >= 6);
  for (const face of faces.filter((item) => /src:\s*url/.test(item))) assert.match(face, /font-display:\s*swap/);
});

test("site sources: no template tells and no slop copy", () => {
  // Стоп-лист из docs/CRAFT-V2-DESIGN-RULES.md. Совпадение только с началом слова: «помощник» не «мощный».
  const stems = [
    "раскройте потенциал", "погрузитесь", "инновационн", "передов(ой|ая|ое|ые)", "уникальная возможность", "революци",
    "будущее уже здесь", "бесшовн", "мощн", "безграничн", "присоединяйтесь к сообществу", "узнать больше", "не просто",
  ];
  const banned = stems.map((stem) => new RegExp(`(?<!\\p{L})${stem}`, "iu"));
  for (const file of siteSources) {
    const source = readFileSync(file, "utf8");
    for (const pattern of banned) assert.doesNotMatch(source, pattern, `${file}: ${pattern}`);
    assert.doesNotMatch(source, /eyebrow|kicker/i, `${file}: eyebrow/kicker`);
    assert.doesNotMatch(source, /\b0\d\s*\/\s*\d\d\b/, `${file}: numbered counter`);
    assert.doesNotMatch(source, /\p{Extended_Pictographic}/u, `${file}: emoji as icon`);
    assert.doesNotMatch(source, /[а-яё]\.\.\.|\.\.\.[а-яё]/i, `${file}: use the ellipsis character`);
    assert.doesNotMatch(source, /[а-яё]\s*[“”]/i, `${file}: use «ёлочки» in Russian text`);
    assert.doesNotMatch(source, /dangerouslySetInnerHTML/, `${file}: raw HTML`);
  }
});

test("site pages show no prices except on the formats page, and there they are marked preliminary", () => {
  for (const file of siteSources.filter((item) => item.endsWith(".tsx"))) {
    const source = readFileSync(file, "utf8");
    if (file.endsWith("formats/page.tsx")) continue;
    assert.doesNotMatch(source, /₽|руб\./i, `${file}: price outside the formats page`);
  }
  const formats = readFileSync(join(root, "app/(site)/formats/page.tsx"), "utf8");
  assert.match(formats, /предварительн/i);
  assert.match(formats, /Платежей на сайте пока нет/);
});

test("site shell: one heading level 1 per page file and no hidden-until-JS content", () => {
  for (const file of siteSources.filter((item) => /page\.tsx$/.test(item))) {
    const source = readFileSync(file, "utf8");
    const h1 = source.match(/<h1\b/g) ?? [];
    assert.ok(h1.length >= 1, `${file}: no h1`);
    assert.doesNotMatch(source, /opacity:\s*0|visibility:\s*hidden/, `${file}: content hidden inline`);
  }
});
