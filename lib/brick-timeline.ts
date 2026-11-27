// Scroll timeline of the 3D object. t = chapter index + progress through it (0..7); pure, so it is testable.
// Chapters: 0 hero, 1 project, 2 six stages, 3 products (silhouette), 4 help (three parts), 5 honest day (still), 6 start (coin, one flash).

export const CHAPTERS = 7;

export type Frame = {
  a: number;
  b: number;
  mix: number;
  spread: number;
  stageMode: number;
  x: number;
  y: number;
  scale: number;
  spin: number;
  dark: number;
  ink: number;
  idle: number;
  flash: number;
};

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ss = (a: number, b: number, x: number) => {
  const k = clamp((x - a) / (b - a));
  return k * k * (3 - 2 * k);
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

type Key = readonly [x: number, y: number, scale: number];
// anchors at the centre of each chapter: x, y as a fraction of half the viewport, scale relative to the fitted size
const WIDE: Key[] = [
  [0.5, 0, 1.25],
  [0.5, 0, 1.25],
  [0.5, 0, 1.15],
  [0.8, -0.56, 0.36],
  [0.5, 0, 0.95],
  [0.5, 0, 0.95],
  [0.5, 0.12, 0.9],
];
const NARROW: Key[] = [
  [0, 0.52, 0.95],
  [0, 0.52, 0.95],
  [0, 0.52, 0.9],
  [0.64, 0.8, 0.3],
  [0, 0.52, 0.8],
  [0, 0.52, 0.8],
  [0, 0.52, 0.85],
];

function anchor(keys: Key[], t: number): Key {
  const f = clamp(t - 0.5, 0, keys.length - 1);
  const i = Math.min(keys.length - 2, Math.floor(f));
  const k = ss(0, 1, f - i);
  return [lerp(keys[i][0], keys[i + 1][0], k), lerp(keys[i][1], keys[i + 1][1], k), lerp(keys[i][2], keys[i + 1][2], k)];
}

export function frameAt(tIn: number, wide: boolean): Frame {
  const t = clamp(tIn, 0, CHAPTERS);
  let a = 0;
  let b = 1;
  let mix = 0;
  let spread = 0.55;
  let stageMode = 0;
  if (t < 2) {
    mix = ss(0, 1.55, t); // scattered, flying in, then a dense block
  } else if (t < 3) {
    a = 1;
    b = 2;
    mix = t - 2; // one tier of the tower per stage
    spread = 0.8;
    stageMode = 1;
  } else if (t < 4) {
    a = 2;
    b = 2;
  } else if (t < 5) {
    a = 2;
    b = 3;
    mix = ss(4, 4.95, t); // the tower splits into three parts
  } else if (t < 6) {
    a = 3;
    b = 3;
  } else {
    a = 3;
    b = 4;
    mix = ss(6, 6.6, t); // the parts come together as the coin
  }
  const [x, y, scale] = anchor(wide ? WIDE : NARROW, t);
  return {
    a,
    b,
    mix,
    spread,
    stageMode,
    x,
    y,
    scale,
    spin: lerp(0.9 * Math.sin(t * 1.3), 0, ss(5.6, 6.8, t)),
    dark: clamp(ss(0.9, 1.1, t) - ss(1.9, 2.1, t) + ss(3.9, 4.1, t) - ss(4.9, 5.1, t) + ss(5.9, 6.1, t)),
    ink: clamp(ss(2.85, 3.2, t) - ss(3.8, 4.05, t)),
    idle: clamp(1 - ss(4.9, 5.1, t) + ss(5.9, 6.1, t)),
    flash: clamp((t - 6.4) / 0.4),
  };
}
