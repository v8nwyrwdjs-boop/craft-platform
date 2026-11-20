/**
 * CRAFT scroll story — authored component model.
 *
 * Five forms (binary code → monitor → coin → ecosystem → catalogue) are assembled from the SAME
 * set of instanced components. Every component slot has an authored transform, colour and
 * visibility in every stage; scroll progress interpolates between neighbouring stages along a
 * deterministic, reversible path. There is no randomness: every "jitter" is a hash of the slot.
 *
 * This module is pure data + math (no three.js import) so it can be unit-tested in Node.
 * Geometry constants (ARC_STEPS, ARC_WIDTH) are shared with the renderer.
 */

export type Quality = "high" | "low";
export type Family = "slab" | "bar" | "arc" | "cyl" | "orb" | "pix";

export const FAMILIES: readonly Family[] = ["slab", "bar", "arc", "cyl", "orb", "pix"];
export const STAGE_COUNT = 5;
/** An `arc` instance spans 360° / ARC_STEPS of a ring of radius 1 (scaled uniformly in XY). */
export const ARC_STEPS = 24;
/** Radial width of an `arc` piece relative to its radius. */
export const ARC_WIDTH = 0.12;
export const CAMERA_FOV = 34;

type V3 = [number, number, number];
type Q4 = [number, number, number, number];
type Part = { p: V3; q: Q4; s: V3; c: V3; key: number };
type StageParts = Record<Family, Part[][]>;

const GROUPS = 3;
const TAU = Math.PI * 2;
const QI: Q4 = [0, 0, 0, 1];

/* ------------------------------------------------------------------ colour */

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
const hex = (h: string): V3 => [
  toLinear(parseInt(h.slice(1, 3), 16) / 255),
  toLinear(parseInt(h.slice(3, 5), 16) / 255),
  toLinear(parseInt(h.slice(5, 7), 16) / 255),
];

const C = {
  silver: hex("#d3d8db"),
  steel: hex("#8e969b"),
  graphite: hex("#2c3034"),
  carbon: hex("#15171a"),
  obsidian: hex("#0a0b0d"),
  lime: hex("#c9f36a"),
  limeDeep: hex("#8cb23e"),
  porcelain: hex("#f3f2ed"),
  ash: hex("#7b827e"),
  pitch: hex("#0f1214"),
  panel: hex("#171b1d"),
  nav: hex("#1b2023"),
  dot: hex("#22262a"),
};

/* -------------------------------------------------------------------- math */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const vadd = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

function qAxis(x: number, y: number, z: number, angle: number): Q4 {
  const half = angle / 2;
  const s = Math.sin(half);
  const l = Math.hypot(x, y, z) || 1;
  return [(x / l) * s, (y / l) * s, (z / l) * s, Math.cos(half)];
}

function qMul(a: Q4, b: Q4): Q4 {
  return [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ];
}

/** Rotation that takes +Y onto `dir`. */
function qFromY(dir: V3): Q4 {
  const l = Math.hypot(dir[0], dir[1], dir[2]) || 1;
  const x = dir[0] / l;
  const y = dir[1] / l;
  const z = dir[2] / l;
  if (y < -0.99999) return [1, 0, 0, 0];
  const w = 1 + y;
  const n = Math.hypot(z, x, w);
  return [z / n, 0, -x / n, w / n];
}

function rotateV(q: Q4, v: V3): V3 {
  const [x, y, z, w] = q;
  const tx = 2 * (y * v[2] - z * v[1]);
  const ty = 2 * (z * v[0] - x * v[2]);
  const tz = 2 * (x * v[1] - y * v[0]);
  return [
    v[0] + w * tx + (y * tz - z * ty),
    v[1] + w * ty + (z * tx - x * tz),
    v[2] + w * tz + (x * ty - y * tx),
  ];
}

/** Clockwise-from-12-o'clock ordering key for an angle measured counter-clockwise from +X. */
const angKey = (theta: number) => {
  const t = (Math.PI / 2 - theta) / TAU;
  return t - Math.floor(t);
};

const hash01 = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/* --------------------------------------------------------------- collector */

function createStage(): StageParts {
  const stage = {} as StageParts;
  FAMILIES.forEach((family) => {
    stage[family] = Array.from({ length: GROUPS }, () => [] as Part[]);
  });
  return stage;
}

function add(st: StageParts, family: Family, group: number, key: number, p: V3, s: V3, q: Q4 = QI, c: V3 = C.silver) {
  st[family][group].push({ p, q, s, c, key });
}

/** A ring of ARC_STEPS arc pieces in the local XY plane of `rot`, centred on `center`. */
function addRing(
  st: StageParts,
  group: number,
  keyBase: number,
  center: V3,
  rot: Q4,
  radius: number,
  depth: number,
  color: V3,
  zOffset = 0,
) {
  for (let k = 0; k < ARC_STEPS; k += 1) {
    const theta = (k / ARC_STEPS) * TAU;
    const local: V3 = [radius * Math.cos(theta), radius * Math.sin(theta), zOffset];
    add(st, "arc", group, keyBase + angKey(theta), vadd(center, rotateV(rot, local)), [radius, radius, depth], qMul(rot, qAxis(0, 0, 1, theta)), color);
  }
}

const ROT_Z_AXIS_TO_Y = qAxis(1, 0, 0, Math.PI / 2); // cylinder (axis Y) → axis Z

/* ------------------------------------------------------------ stage 0: code */

function buildCode(st: StageParts) {
  const WORD = [0x43, 0x52, 0x41, 0x46, 0x54]; // "CRAFT" in 8-bit ASCII
  const cols = 8;
  const rows = 5;
  const pitchX = 0.44;
  const pitchY = 0.7;
  const wall = 5.2; // gentle convex wall so the digits read as a physical object, not a flat sign
  const th = 0.07;
  const dz = 0.1;
  const hw = 0.15;
  const hh = 0.26;
  const cc = 0.07;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const bit = (WORD[r] >> (7 - c)) & 1;
      const phi = ((c - (cols - 1) / 2) * pitchX) / wall;
      const base = qAxis(0, 1, 0, phi);
      const origin: V3 = [wall * Math.sin(phi), (2 - r) * pitchY, wall * (Math.cos(phi) - 1)];
      const key = (r * cols + c) / (rows * cols);
      const color = bit ? C.lime : C.silver;
      let n = 0;
      const stroke = (ax: number, ay: number, bx: number, by: number) => {
        const dx = bx - ax;
        const dy = by - ay;
        const len = Math.hypot(dx, dy) + th * 0.5;
        const p = vadd(origin, rotateV(base, [(ax + bx) / 2, (ay + by) / 2, 0]));
        n += 1;
        add(st, "bar", 0, key + n * 1e-4, p, [len, th, dz], qMul(base, qAxis(0, 0, 1, Math.atan2(dy, dx))), color);
      };
      if (bit) {
        stroke(0.03, -hh, 0.03, hh);
        stroke(-0.12, 0.12, 0.03, hh);
        stroke(-0.12, -hh, 0.18, -hh);
      } else {
        const pts: [number, number][] = [
          [-hw + cc, hh], [hw - cc, hh], [hw, hh - cc], [hw, -hh + cc],
          [hw - cc, -hh], [-hw + cc, -hh], [-hw, -hh + cc], [-hw, hh - cc], [-hw + cc, hh],
        ];
        for (let i = 0; i < 8; i += 1) stroke(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
      }
      // bit-index LED under every digit
      add(st, "pix", 1, key, vadd(origin, rotateV(base, [0, -0.39, 0.02])), [0.16, 0.016, 0.02], base, bit ? C.lime : C.ash);
    }
  }
  // eight panel columns form the curved backplate
  for (let c = 0; c < cols; c += 1) {
    const phi = ((c - (cols - 1) / 2) * pitchX) / wall;
    const base = qAxis(0, 1, 0, phi);
    const origin: V3 = [wall * Math.sin(phi), 0, wall * (Math.cos(phi) - 1)];
    add(st, "slab", 0, c / cols, vadd(origin, rotateV(base, [0, 0, -0.1])), [pitchX * 0.97, 3.78, 0.03], base, C.carbon);
  }
  // fasteners at every panel seam, top and bottom
  for (let e = 0; e <= cols; e += 1) {
    const phi = ((e - cols / 2) * pitchX) / wall;
    const base = qAxis(0, 1, 0, phi);
    const origin: V3 = [wall * Math.sin(phi), 0, wall * (Math.cos(phi) - 1)];
    for (let side = 0; side < 2; side += 1) {
      const y = side === 0 ? 1.9 : -1.9;
      add(st, "cyl", 1, (e + side * 0.5) / (cols + 1) / 2 + side * 0.5, vadd(origin, rotateV(base, [0, y, -0.06])), [0.07, 0.03, 0.07], qMul(base, ROT_Z_AXIS_TO_Y), C.steel);
    }
  }
}

/* --------------------------------------------------------- stage 1: monitor */

const MON = { W: 3.12, H: 1.96, b: 0.09, rc: 0.12, cy: 0.28, depth: 0.14 };

function uiColor(u: number, v: number): V3 {
  const nav = v < 0.085;
  if (nav) {
    if (u >= 0.04 && u < 0.12) return C.lime;
    if ((u >= 0.62 && u < 0.7) || (u >= 0.74 && u < 0.82) || (u >= 0.86 && u < 0.94)) return C.ash;
    return C.nav;
  }
  if (u >= 0.05 && u < 0.5) {
    if (v >= 0.2 && v < 0.275) return C.porcelain;
    if (v >= 0.3 && v < 0.375 && u < 0.4) return C.porcelain;
    if (v >= 0.46 && v < 0.52 && u < 0.46) return C.ash;
    if (v >= 0.54 && v < 0.6 && u < 0.36) return C.ash;
    if (v >= 0.68 && v < 0.78 && u < 0.22) return C.lime;
  }
  if (u >= 0.56 && u < 0.95 && v >= 0.18 && v < 0.8) {
    const bars: [number, number, number][] = [[0.6, 0.65, 0.3], [0.68, 0.73, 0.45], [0.76, 0.81, 0.36], [0.84, 0.89, 0.58]];
    for (let i = 0; i < bars.length; i += 1) {
      const [u0, u1, h] = bars[i];
      if (u >= u0 && u < u1 && v >= 0.74 - h && v < 0.74) return i === 3 ? C.lime : C.steel;
    }
    return C.panel;
  }
  if (v >= 0.86 && v < 0.97) {
    if ((u >= 0.05 && u < 0.33) || (u >= 0.36 && u < 0.64) || (u >= 0.67 && u < 0.95)) return v < 0.885 ? C.limeDeep : C.panel;
  }
  return C.pitch;
}

function buildMonitor(st: StageParts, hi: boolean) {
  const { W, H, b, rc, cy, depth } = MON;
  const hx = W / 2;
  const hy = H / 2;
  const runX = W - 2 * rc;
  const runY = H - 2 * rc;
  const gap = 0.012;
  const ang = (x: number, y: number) => angKey(Math.atan2(y - cy, x));

  // bezel: straight runs with machined seams + chamfered corners
  for (let i = 0; i < 6; i += 1) {
    const len = runX / 6;
    const x = -runX / 2 + len * (i + 0.5);
    add(st, "bar", 0, ang(x, cy + hy), [x, cy + hy - b / 2, 0], [len - gap, b, depth], QI, C.silver);
    add(st, "bar", 0, ang(x, cy - hy), [x, cy - hy + b / 2, 0], [len - gap, b, depth], QI, C.silver);
  }
  for (let i = 0; i < 4; i += 1) {
    const len = runY / 4;
    const y = -runY / 2 + len * (i + 0.5);
    add(st, "bar", 0, ang(hx, cy + y), [hx - b / 2, cy + y, 0], [b, len - gap, depth], QI, C.silver);
    add(st, "bar", 0, ang(-hx, cy + y), [-hx + b / 2, cy + y, 0], [b, len - gap, depth], QI, C.silver);
  }
  const corners: [number, number, number][] = [[1, 1, 0], [-1, 1, Math.PI / 2], [-1, -1, Math.PI], [1, -1, (Math.PI * 3) / 2]];
  corners.forEach(([sx, sy, a0]) => {
    for (let k = 0; k < 3; k += 1) {
      const theta = a0 + (k + 0.5) * (Math.PI / 6);
      const rr = rc - b / 2;
      const x = sx * (hx - rc) + rr * Math.cos(theta);
      const y = cy + sy * (hy - rc) + rr * Math.sin(theta);
      add(st, "bar", 0, ang(x, y), [x, y, 0], [0.066, b, depth], qAxis(0, 0, 1, theta + Math.PI / 2), C.silver);
    }
  });
  // inner lip around the glass
  const lipT = 0.014;
  for (let i = 0; i < 6; i += 1) {
    const len = (W - 2 * b) / 6;
    const x = -(W - 2 * b) / 2 + len * (i + 0.5);
    add(st, "bar", 1, ang(x, cy + hy), [x, cy + hy - b - lipT / 2, 0.066], [len - 0.01, lipT, 0.016], QI, C.obsidian);
    add(st, "bar", 1, ang(x, cy - hy), [x, cy - hy + b + lipT / 2, 0.066], [len - 0.01, lipT, 0.016], QI, C.obsidian);
  }
  for (let i = 0; i < 4; i += 1) {
    const len = (H - 2 * b) / 4;
    const y = -(H - 2 * b) / 2 + len * (i + 0.5);
    add(st, "bar", 1, ang(hx, cy + y), [hx - b - lipT / 2, cy + y, 0.066], [lipT, len - 0.01, 0.016], QI, C.obsidian);
    add(st, "bar", 1, ang(-hx, cy + y), [-hx + b + lipT / 2, cy + y, 0.066], [lipT, len - 0.01, 0.016], QI, C.obsidian);
  }
  // internal board traces behind the glass (visible while the monitor assembles and disassembles)
  for (let row = 0; row < 12; row += 1) {
    for (let col = 0; col < 2; col += 1) {
      const x = (col - 0.5) * 1.5;
      const y = cy - 0.8 + row * 0.145;
      add(st, "bar", 2, ang(x, y), [x, y, -0.06], [0.62 + (row % 3) * 0.2, 0.012, 0.012], QI, row % 4 === 0 ? C.limeDeep : C.steel);
    }
  }

  // housing, glass, neck and hinge
  add(st, "slab", 0, 0.1, [0, cy, -0.11], [W - 0.06, H - 0.06, 0.12], QI, C.carbon);
  add(st, "slab", 0, 0.3, [0, cy, 0.0], [W - 2 * b + 0.01, H - 2 * b + 0.01, 0.02], QI, C.obsidian);
  add(st, "slab", 0, 0.6, [0, -0.88, -0.2], [0.36, 0.66, 0.07], QI, C.silver);
  add(st, "slab", 0, 0.8, [0, -0.6, -0.18], [0.8, 0.14, 0.11], QI, C.steel);

  // screen: a tile grid lights up as a small product UI
  const cols = hi ? 24 : 16;
  const rows = hi ? 14 : 10;
  const sw = W - 2 * b;
  const sh = H - 2 * b;
  const pxw = sw / cols;
  const pxh = sh / rows;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const u = (c + 0.5) / cols;
      const v = (r + 0.5) / rows;
      add(st, "pix", 0, (r * cols + c) / (rows * cols), [-sw / 2 + pxw * (c + 0.5), cy + sh / 2 - pxh * (r + 0.5), 0.03], [pxw * 0.84, pxh * 0.84, 0.02], QI, uiColor(u, v));
    }
  }

  // stand foot, engraved rings, fasteners, indicator + camera
  add(st, "cyl", 0, 0.5, [0, -1.24, -0.18], [1.24, 0.05, 1.24], QI, C.silver);
  const foot: V3 = [0, -1.24 + 0.027, -0.18];
  const flat = qAxis(1, 0, 0, -Math.PI / 2);
  [0.18, 0.32, 0.46].forEach((r, i) => addRing(st, 0, i, foot, flat, r, 0.012, C.graphite));
  addRing(st, 1, 0, [0, -0.6, -0.12], QI, 0.075, 0.012, C.steel);
  for (let i = 0; i < 8; i += 1) {
    const sx = i % 2 === 0 ? -1 : 1;
    const sy = i < 4 ? 1 : -1;
    add(st, "cyl", 1, i / 12, [sx * (hx - 0.18) * (i % 4 < 2 ? 1 : 0.55), cy + sy * (hy - 0.18), -0.17], [0.055, 0.02, 0.055], ROT_Z_AXIS_TO_Y, C.steel);
  }
  add(st, "cyl", 1, 0.9, [-0.3, -0.6, -0.125], [0.05, 0.02, 0.05], ROT_Z_AXIS_TO_Y, C.steel);
  add(st, "cyl", 1, 0.95, [0.3, -0.6, -0.125], [0.05, 0.02, 0.05], ROT_Z_AXIS_TO_Y, C.steel);
  add(st, "orb", 1, 0.1, [0, cy - hy + b / 2, 0.076], [0.04, 0.04, 0.04], QI, C.lime);
  add(st, "orb", 1, 0.6, [0, cy + hy - b / 2, 0.076], [0.045, 0.045, 0.045], QI, C.obsidian);
}

/* ------------------------------------------------------------ stage 2: coin */

function buildCoin(st: StageParts, hi: boolean) {
  const R = 1.1;
  const T = 0.15;
  const teeth = hi ? 120 : 72;
  const ticks = hi ? 72 : 36;
  add(st, "cyl", 0, 0.5, [0, 0, 0], [2 * R, T, 2 * R], ROT_Z_AXIS_TO_Y, C.silver);
  add(st, "cyl", 1, 0.2, [0, 0, 0.082], [1.7, 0.02, 1.7], ROT_Z_AXIS_TO_Y, C.steel);
  add(st, "cyl", 1, 0.8, [0, 0, 0.1], [0.34, 0.04, 0.34], ROT_Z_AXIS_TO_Y, C.graphite);

  // milled edge
  for (let k = 0; k < teeth; k += 1) {
    const theta = (k / teeth) * TAU;
    add(st, "bar", 0, angKey(theta), [(R + 0.004) * Math.cos(theta), (R + 0.004) * Math.sin(theta), 0], [(TAU * R) / teeth * 0.55, 0.026, T], qAxis(0, 0, 1, theta - Math.PI / 2), k % 2 === 0 ? C.silver : C.steel);
  }
  // minute ticks on the face
  for (let k = 0; k < ticks; k += 1) {
    const theta = (k / ticks) * TAU;
    const long = k % 6 === 0;
    const r = 0.93;
    add(st, "bar", 1, angKey(theta), [r * Math.cos(theta), r * Math.sin(theta), 0.09], [0.014, long ? 0.075 : 0.045, 0.014], qAxis(0, 0, 1, theta - Math.PI / 2), long ? C.lime : C.graphite);
  }
  // raised rim + concentric machining
  addRing(st, 0, 0, [0, 0, 0], QI, 1.045, 0.045, C.silver, 0.088);
  const rings: [number, V3][] = [[0.985, C.graphite], [0.8, C.graphite], [0.66, C.steel], [0.52, C.graphite], [0.4, C.steel], [0.26, C.limeDeep], [0.2, C.graphite]];
  rings.forEach(([r, color], i) => addRing(st, 1, i + 1, [0, 0, 0], QI, r, 0.012, color, 0.082));
  // emblem: hexagon of six struts joined by six rivets and six spokes around a core
  for (let k = 0; k < 6; k += 1) {
    const a0 = Math.PI / 2 + (k / 6) * TAU;
    const a1 = Math.PI / 2 + ((k + 1) / 6) * TAU;
    const r = 0.34;
    const p0: V3 = [r * Math.cos(a0), r * Math.sin(a0), 0];
    const p1: V3 = [r * Math.cos(a1), r * Math.sin(a1), 0];
    add(st, "bar", 2, angKey((a0 + a1) / 2), [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, 0.112], [r + 0.03, 0.036, 0.03], qAxis(0, 0, 1, (a0 + a1) / 2 + Math.PI / 2), C.lime);
    add(st, "bar", 2, angKey(a0) + 0.01, [0.17 * Math.cos(a0), 0.17 * Math.sin(a0), 0.112], [0.26, 0.022, 0.026], qAxis(0, 0, 1, a0), C.limeDeep);
    add(st, "orb", 1, angKey(a0), [r * Math.cos(a0), r * Math.sin(a0), 0.118], [0.075, 0.075, 0.075], QI, C.silver);
  }
  add(st, "orb", 0, 0.5, [0, 0, 0.13], [0.16, 0.16, 0.16], QI, C.lime);
  // guilloché dot rings between the engraved rings
  [0.31, 0.46, 0.59, 0.73, 0.87].forEach((r, i) => {
    const n = Math.round((TAU * r) / (hi ? 0.075 : 0.11));
    for (let k = 0; k < n; k += 1) {
      const theta = (k / n) * TAU + i * 0.07;
      add(st, "pix", 0, i + angKey(theta), [r * Math.cos(theta), r * Math.sin(theta), 0.088], [0.03, 0.03, 0.012], qAxis(0, 0, 1, theta), k % 9 === 0 ? C.lime : C.dot);
    }
  });
}

/* ------------------------------------------------------- stage 3: ecosystem */

function buildEcosystem(st: StageParts, hi: boolean) {
  const o: V3 = [0, 0, 0];
  const orbits: { rot: Q4; r: number; color: V3 }[] = [
    { rot: qMul(qAxis(0, 0, 1, 0.18), qAxis(1, 0, 0, 0.42)), r: 1.42, color: C.silver },
    { rot: qMul(qAxis(0, 0, 1, -0.7), qAxis(1, 0, 0, 1.18)), r: 1.06, color: C.steel },
    { rot: qMul(qAxis(0, 1, 0, 0.95), qAxis(1, 0, 0, 0.5)), r: 0.76, color: C.graphite },
  ];
  const at = (orbit: number, theta: number): V3 => rotateV(orbits[orbit].rot, [orbits[orbit].r * Math.cos(theta), orbits[orbit].r * Math.sin(theta), 0]);

  orbits.forEach((orbit, i) => addRing(st, i === 0 ? 0 : 1, i, o, orbit.rot, orbit.r, i === 0 ? 0.04 : 0.028, orbit.color));

  // core: hub plate, inner ring, glowing core
  add(st, "cyl", 0, 0.5, o, [0.62, 0.05, 0.62], ROT_Z_AXIS_TO_Y, C.graphite);
  addRing(st, 1, 3, [0, 0, 0.03], QI, 0.34, 0.02, C.silver);
  add(st, "orb", 0, 0.5, o, [0.26, 0.26, 0.26], QI, C.lime);

  // hubs on the orbits
  const nodes: { orbit: number; theta: number; size: number; color: V3 }[] = [
    { orbit: 0, theta: 0.5, size: 0.19, color: C.lime },
    { orbit: 0, theta: 2.6, size: 0.15, color: C.silver },
    { orbit: 0, theta: 4.7, size: 0.15, color: C.silver },
    { orbit: 1, theta: 1.2, size: 0.15, color: C.lime },
    { orbit: 1, theta: 3.6, size: 0.13, color: C.silver },
    { orbit: 2, theta: 0.2, size: 0.12, color: C.silver },
    { orbit: 2, theta: 2.0, size: 0.12, color: C.lime },
    { orbit: 2, theta: 4.1, size: 0.12, color: C.silver },
  ];
  const pts = nodes.map((n) => at(n.orbit, n.theta));
  nodes.forEach((n, i) => {
    add(st, "orb", 1, angKey(n.theta) + n.orbit, pts[i], [n.size, n.size, n.size], QI, n.color);
    // halos on the primary hubs
    if (i === 0 || i === 1 || i === 3 || i === 5) addRing(st, 1, 4 + i, pts[i], QI, n.size * 1.45, 0.014, C.silver);
    // bracket ticks
    for (let k = 0; k < 4; k += 1) {
      const a = (k / 4) * TAU + Math.PI / 4;
      const rr = n.size * 1.0 + 0.07;
      add(st, "bar", 1, i / 8 + k * 0.01, vadd(pts[i], [rr * Math.cos(a), rr * Math.sin(a), 0]), [0.05, 0.016, 0.016], qAxis(0, 0, 1, a + Math.PI / 2), C.lime);
    }
  });

  // links: spokes + cross links
  const links: [number, number, boolean][] = [[-1, 0, true], [-1, 1, false], [-1, 2, false], [-1, 3, true], [-1, 4, false], [-1, 5, false], [-1, 6, true], [-1, 7, false],
    [0, 3, false], [1, 5, false], [2, 4, false], [3, 6, false], [4, 7, false], [5, 1, false]];
  links.forEach(([from, to, strong], i) => {
    const a: V3 = from < 0 ? o : pts[from];
    const b = pts[to];
    const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const len = Math.hypot(d[0], d[1], d[2]);
    add(st, "cyl", 1, i / links.length, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], [strong ? 0.03 : 0.02, len, strong ? 0.03 : 0.02], qFromY(d), strong ? C.silver : C.steel);
  });
  // satellites on the orbits
  const sats = hi ? 18 : 10;
  for (let k = 0; k < sats; k += 1) {
    const orbit = k % 3;
    const theta = 0.35 + k * 0.97;
    add(st, "orb", 2, k / sats, at(orbit, theta), [0.05, 0.05, 0.05], QI, k % 5 === 0 ? C.lime : C.silver);
  }
  // scale ticks around the outer orbit
  const ticks = hi ? 96 : 48;
  for (let k = 0; k < ticks; k += 1) {
    const theta = (k / ticks) * TAU;
    const rr = orbits[0].r + 0.12;
    const local: V3 = [rr * Math.cos(theta), rr * Math.sin(theta), 0];
    add(st, "bar", 0, angKey(theta), rotateV(orbits[0].rot, local), [0.012, k % 4 === 0 ? 0.07 : 0.04, 0.012], qMul(orbits[0].rot, qAxis(0, 0, 1, theta - Math.PI / 2)), k % 4 === 0 ? C.lime : C.graphite);
  }
  // data packets: along links and orbit rings
  let packet = 0;
  links.forEach(([from, to], i) => {
    const a: V3 = from < 0 ? o : pts[from];
    const b = pts[to];
    for (let k = 1; k <= (hi ? 6 : 3); k += 1) {
      const t = k / ((hi ? 6 : 3) + 1);
      add(st, "pix", 0, i + t * 0.01, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t], [0.034, 0.034, 0.034], QI, packet % 3 === 0 ? C.lime : C.porcelain);
      packet += 1;
    }
  });
  [[0, hi ? 56 : 28], [1, hi ? 60 : 30], [2, hi ? 48 : 24]].forEach(([orbit, n]) => {
    for (let k = 0; k < n; k += 1) {
      const theta = ((k + 0.5) / n) * TAU;
      add(st, "pix", 0, 20 + orbit + angKey(theta) * 0.9, at(orbit, theta), [0.026, 0.026, 0.026], QI, k % 7 === 0 ? C.lime : C.ash);
    }
  });
}

/* ----------------------------------------------------- stage 4: catalogue */

function buildCatalogue(st: StageParts, hi: boolean) {
  const cards = [
    { x: -1.34, z: -0.12, yaw: 0.26, k: 1 },
    { x: 0, z: 0.12, yaw: 0, k: 1.08 },
    { x: 1.34, z: -0.12, yaw: -0.26, k: 1 },
  ];
  const cw = 1.15;
  const ch = 1.62;
  const cy = 0.12;
  const cols = hi ? 8 : 6;
  const rows = hi ? 11 : 8;

  const cardColor = (card: number, u: number, v: number): V3 => {
    if (v >= 0.05 && v < 0.12 && u >= 0.1 && u < 0.4) return C.lime;
    if (v >= 0.18 && v < 0.25 && u >= 0.1 && u < 0.85) return C.porcelain;
    if (v >= 0.28 && v < 0.34 && u >= 0.1 && u < 0.62) return C.ash;
    if (v >= 0.4 && v < 0.72) {
      if (card === 0) {
        const d = Math.hypot((u - 0.5) * 1.15, (v - 0.56) * 1.62);
        if (d > 0.2 && d < 0.34) return u > 0.5 ? C.lime : C.steel;
      } else if (card === 1) {
        if (u > 0.2 && u < 0.8 && v > 0.44 && v < 0.68) return u > 0.4 && u < 0.6 && v > 0.52 && v < 0.6 ? C.lime : C.steel;
      } else {
        const rowsList: [number, number, number][] = [[0.42, 0.49, 0.8], [0.54, 0.61, 0.62], [0.66, 0.72, 0.45]];
        for (let i = 0; i < rowsList.length; i += 1) if (v >= rowsList[i][0] && v < rowsList[i][1] && u > 0.15 && u < 0.15 + rowsList[i][2] * 0.7) return i === 0 ? C.lime : C.steel;
      }
    }
    if (v >= 0.84 && v < 0.91 && u >= 0.1 && u < 0.55) return C.ash;
    if (v >= 0.84 && v < 0.91 && u >= 0.78 && u < 0.9) return C.lime;
    return C.panel;
  };

  cards.forEach((card, ci) => {
    const base = qAxis(0, 1, 0, card.yaw);
    const origin: V3 = [card.x, cy, card.z];
    const place = (l: V3): V3 => vadd(origin, rotateV(base, [l[0] * card.k, l[1] * card.k, l[2]]));
    add(st, "slab", 0, ci / 3, place([0, 0, 0]), [cw * card.k, ch * card.k, 0.05], base, C.carbon);
    // frame
    const th = 0.022;
    for (let i = 0; i < 3; i += 1) {
      const len = (cw - 0.05) / 3;
      const x = -(cw - 0.05) / 2 + len * (i + 0.5);
      add(st, "bar", 0, ci / 3 + i * 0.01, place([x, ch / 2 - th / 2, 0.03]), [len * card.k - 0.01, th * card.k, 0.025], base, ci === 1 ? C.silver : C.steel);
      add(st, "bar", 0, ci / 3 + 0.2 + i * 0.01, place([x, -ch / 2 + th / 2, 0.03]), [len * card.k - 0.01, th * card.k, 0.025], base, ci === 1 ? C.silver : C.steel);
    }
    for (let i = 0; i < 4; i += 1) {
      const len = (ch - 0.05) / 4;
      const y = -(ch - 0.05) / 2 + len * (i + 0.5);
      add(st, "bar", 0, ci / 3 + 0.4 + i * 0.01, place([cw / 2 - th / 2, y, 0.03]), [th * card.k, len * card.k - 0.01, 0.025], base, ci === 1 ? C.silver : C.steel);
      add(st, "bar", 0, ci / 3 + 0.6 + i * 0.01, place([-cw / 2 + th / 2, y, 0.03]), [th * card.k, len * card.k - 0.01, 0.025], base, ci === 1 ? C.silver : C.steel);
    }
    // dividers + corner accents
    add(st, "bar", 1, ci / 3, place([0, ch * 0.28, 0.035]), [(cw - 0.2) * card.k, 0.012 * card.k, 0.014], base, C.graphite);
    add(st, "bar", 1, ci / 3 + 0.1, place([0, -ch * 0.3, 0.035]), [(cw - 0.2) * card.k, 0.012 * card.k, 0.014], base, C.graphite);
    [[-1, 1], [1, 1], [1, -1], [-1, -1]].forEach(([sx, sy], i) => {
      add(st, "bar", 1, ci / 3 + 0.2 + i * 0.01, place([sx * (cw / 2 - 0.05), sy * (ch / 2 - 0.05), 0.04]), [0.06 * card.k, 0.016 * card.k, 0.016], qMul(base, qAxis(0, 0, 1, i % 2 === 0 ? 0 : Math.PI / 2)), C.lime);
    });
    // status ring in the card header (two concentric rings)
    const ringCenter = place([cw / 2 - 0.2, ch / 2 - 0.16, 0.04]);
    addRing(st, 1, ci * 2, ringCenter, base, 0.07 * card.k, 0.014, ci === 1 ? C.lime : C.silver);
    addRing(st, 1, ci * 2 + 1, ringCenter, base, 0.115 * card.k, 0.012, C.steel);
    // content pixels
    const pw = (cw - 0.2) / cols;
    const ph = (ch - 0.2) / rows;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const color = cardColor(ci, (c + 0.5) / cols, (r + 0.5) / rows);
        add(st, "pix", 0, (ci * rows * cols + r * cols + c) / (3 * rows * cols), place([-(cw - 0.2) / 2 + pw * (c + 0.5), (ch - 0.2) / 2 - ph * (r + 0.5), 0.04]), [pw * 0.82 * card.k, ph * 0.82 * card.k, 0.016], base, color);
      }
    }
    // standoffs
    [-1, 1].forEach((side, i) => add(st, "cyl", 1, ci / 3 + i * 0.1, place([side * 0.32, 0.5, -0.07]), [0.05, 0.1, 0.05], qMul(base, ROT_Z_AXIS_TO_Y), C.steel));
    if (ci === 1) add(st, "orb", 0, 0.5, place([0, ch / 2 + 0.16, 0.02]), [0.12, 0.12, 0.12], QI, C.lime);
    else add(st, "orb", 1, ci / 3, place([0, ch / 2 + 0.12, 0.02]), [0.07, 0.07, 0.07], QI, C.silver);
  });
  // spine linking the cards + plinth
  add(st, "cyl", 1, 0.5, [-0.67, cy + 0.5, -0.17], [0.022, 1.2, 0.022], qAxis(0, 0, 1, Math.PI / 2), C.silver);
  add(st, "cyl", 1, 0.55, [0.67, cy + 0.5, -0.17], [0.022, 1.2, 0.022], qAxis(0, 0, 1, Math.PI / 2), C.silver);
  add(st, "cyl", 0, 0.5, [0, -0.98, 0], [2.7, 0.05, 2.7], QI, C.carbon);
  addRing(st, 0, 0, [0, -0.98 + 0.027, 0], qAxis(1, 0, 0, -Math.PI / 2), 1.35, 0.02, C.silver);
}

/* ---------------------------------------------------------------- layout */

export interface StoryLayout {
  quality: Quality;
  counts: Record<Family, number>;
  present: Record<Family, Uint8Array[]>;
  pos: Record<Family, Float32Array[]>;
  quat: Record<Family, Float32Array[]>;
  scl: Record<Family, Float32Array[]>;
  col: Record<Family, Float32Array[]>;
  delay: Record<Family, Float32Array[]>;
  bend: Record<Family, Float32Array[]>;
}

function perFamily<T>(make: (family: Family) => T): Record<Family, T> {
  const out = {} as Record<Family, T>;
  FAMILIES.forEach((family) => {
    out[family] = make(family);
  });
  return out;
}

function finalize(stages: StageParts[], quality: Quality): StoryLayout {
  const caps = perFamily((family) => Array.from({ length: GROUPS }, (_, g) => Math.max(...stages.map((s) => s[family][g].length))));
  const offsets = perFamily((family) => {
    let sum = 0;
    return caps[family].map((cap) => {
      const start = sum;
      sum += cap;
      return start;
    });
  });
  const counts = perFamily((family) => caps[family].reduce((a, b) => a + b, 0));
  const stageArrays = <T,>(make: (n: number) => T, per: (family: Family) => number = (f) => counts[f], length = STAGE_COUNT) =>
    perFamily((family) => Array.from({ length }, () => make(per(family))));

  const layout: StoryLayout = {
    quality,
    counts,
    present: stageArrays((n) => new Uint8Array(n)),
    pos: stageArrays((n) => new Float32Array(n * 3)),
    quat: stageArrays((n) => new Float32Array(n * 4)),
    scl: stageArrays((n) => new Float32Array(n * 3)),
    col: stageArrays((n) => new Float32Array(n * 3)),
    delay: stageArrays((n) => new Float32Array(n), undefined, STAGE_COUNT - 1),
    bend: stageArrays((n) => new Float32Array(n * 3), undefined, STAGE_COUNT - 1),
  };
  const rank = perFamily((family) => new Float32Array(counts[family]));

  stages.forEach((stage, s) => {
    FAMILIES.forEach((family) => {
      for (let g = 0; g < GROUPS; g += 1) {
        const list = stage[family][g].slice().sort((a, b) => a.key - b.key);
        const cap = caps[family][g];
        const m = list.length;
        for (let j = 0; j < m; j += 1) {
          const local = Math.floor(((j + 0.5) * cap) / m);
          const slot = offsets[family][g] + local;
          const part = list[j];
          layout.present[family][s][slot] = 1;
          layout.pos[family][s].set(part.p, slot * 3);
          layout.quat[family][s].set(part.q, slot * 4);
          layout.scl[family][s].set(part.s, slot * 3);
          layout.col[family][s].set(part.c, slot * 3);
          rank[family][slot] = (local + 0.5) / cap;
        }
      }
    });
  });

  // Anchor absent slots: they stay where the nearest present stage puts them and only scale (grow/retract in place).
  FAMILIES.forEach((family) => {
    for (let i = 0; i < counts[family]; i += 1) {
      for (let s = 0; s < STAGE_COUNT; s += 1) {
        if (layout.present[family][s][i]) continue;
        let source = -1;
        for (let d = 1; d < STAGE_COUNT && source < 0; d += 1) {
          if (s + d < STAGE_COUNT && layout.present[family][s + d][i]) source = s + d;
          else if (s - d >= 0 && layout.present[family][s - d][i]) source = s - d;
        }
        if (source < 0) {
          layout.quat[family][s][i * 4 + 3] = 1;
          continue;
        }
        layout.pos[family][s].set(layout.pos[family][source].subarray(i * 3, i * 3 + 3), i * 3);
        layout.quat[family][s].set(layout.quat[family][source].subarray(i * 4, i * 4 + 4), i * 4);
        layout.col[family][s].set(layout.col[family][source].subarray(i * 3, i * 3 + 3), i * 3);
      }
    }
  });

  // Per-segment stagger and curved path (deterministic, reversible).
  FAMILIES.forEach((family) => {
    const f = FAMILIES.indexOf(family);
    for (let a = 0; a < STAGE_COUNT - 1; a += 1) {
      const P0 = layout.pos[family][a];
      const P1 = layout.pos[family][a + 1];
      for (let i = 0; i < counts[family]; i += 1) {
        const here = layout.present[family][a][i] === 1;
        const next = layout.present[family][a + 1][i] === 1;
        let d = 0.7 * rank[family][i] + 0.3 * hash01(i * 7 + f * 131 + a * 17);
        if (here && !next) d *= 0.5;
        else if (!here && next) d = 0.5 + 0.5 * d;
        layout.delay[family][a][i] = d;
        const dx = P1[i * 3] - P0[i * 3];
        const dy = P1[i * 3 + 1] - P0[i * 3 + 1];
        const dz = P1[i * 3 + 2] - P0[i * 3 + 2];
        const len = Math.hypot(dx, dy, dz);
        if (len < 1e-5) continue;
        const sign = hash01(i * 3 + f * 53 + a * 11) > 0.5 ? 1 : -1;
        const px = (-dy / (Math.hypot(dx, dy) || 1)) * 0.12 * len * sign;
        const py = (dx / (Math.hypot(dx, dy) || 1)) * 0.12 * len * sign;
        const cap = Math.min(0.6, 0.12 * len);
        layout.bend[family][a][i * 3] = px;
        layout.bend[family][a][i * 3 + 1] = py;
        layout.bend[family][a][i * 3 + 2] = cap;
      }
    }
  });
  return layout;
}

const cache: { [quality: string]: StoryLayout } = {};

export function buildStoryLayout(quality: Quality): StoryLayout {
  if (cache[quality]) return cache[quality];
  const hi = quality === "high";
  const stages = Array.from({ length: STAGE_COUNT }, () => createStage());
  buildCode(stages[0]);
  buildMonitor(stages[1], hi);
  buildCoin(stages[2], hi);
  buildEcosystem(stages[3], hi);
  buildCatalogue(stages[4], hi);
  cache[quality] = finalize(stages, quality);
  return cache[quality];
}

/** Number of visibly present components in a stage (scale > 0). */
export function presentCount(layout: StoryLayout, stage: number): number {
  let n = 0;
  FAMILIES.forEach((family) => {
    for (let i = 0; i < layout.counts[family]; i += 1) n += layout.present[family][stage][i];
  });
  return n;
}

/* --------------------------------------------------------------- sampling */

const SPREAD = 0.36;

/**
 * Writes instance matrices (column-major, 16 floats per instance) and linear colours (3 floats)
 * for the given story progress (0..1). A pure function of `progress`: scrubbing is reversible.
 */
export function sampleStory(
  layout: StoryLayout,
  progress: number,
  matrices: Record<Family, Float32Array>,
  colors: Record<Family, Float32Array>,
): void {
  const x = clamp01(progress) * (STAGE_COUNT - 1);
  const a = Math.min(STAGE_COUNT - 2, Math.floor(x));
  const t = x - a;
  FAMILIES.forEach((family) => {
    const n = layout.counts[family];
    if (!n) return;
    const P0 = layout.pos[family][a];
    const P1 = layout.pos[family][a + 1];
    const Q0 = layout.quat[family][a];
    const Q1 = layout.quat[family][a + 1];
    const S0 = layout.scl[family][a];
    const S1 = layout.scl[family][a + 1];
    const K0 = layout.col[family][a];
    const K1 = layout.col[family][a + 1];
    const D = layout.delay[family][a];
    const B = layout.bend[family][a];
    const M = matrices[family];
    const K = colors[family];
    for (let i = 0; i < n; i += 1) {
      const u = clamp01((t - D[i] * SPREAD) / (1 - SPREAD));
      const e = u * u * u * (u * (u * 6 - 15) + 10);
      const arc = Math.sin(Math.PI * e);
      const i3 = i * 3;
      const i4 = i * 4;
      const px = P0[i3] + (P1[i3] - P0[i3]) * e + B[i3] * arc;
      const py = P0[i3 + 1] + (P1[i3 + 1] - P0[i3 + 1]) * e + B[i3 + 1] * arc;
      const pz = P0[i3 + 2] + (P1[i3 + 2] - P0[i3 + 2]) * e + B[i3 + 2] * arc;
      // growing dimensions arrive late, shrinking ones leave early: large solids never sit half-formed on screen
      const eg = e * e;
      const es = 1 - (1 - e) * (1 - e);
      const sx = S0[i3] + (S1[i3] - S0[i3]) * (S1[i3] >= S0[i3] ? eg : es);
      const sy = S0[i3 + 1] + (S1[i3 + 1] - S0[i3 + 1]) * (S1[i3 + 1] >= S0[i3 + 1] ? eg : es);
      const sz = S0[i3 + 2] + (S1[i3 + 2] - S0[i3 + 2]) * (S1[i3 + 2] >= S0[i3 + 2] ? eg : es);
      // shortest-path slerp
      let ax = Q0[i4];
      let ay = Q0[i4 + 1];
      let az = Q0[i4 + 2];
      let aw = Q0[i4 + 3];
      let bx = Q1[i4];
      let by = Q1[i4 + 1];
      let bz = Q1[i4 + 2];
      let bw = Q1[i4 + 3];
      let dot = ax * bx + ay * by + az * bz + aw * bw;
      if (dot < 0) {
        bx = -bx; by = -by; bz = -bz; bw = -bw; dot = -dot;
      }
      let ka: number;
      let kb: number;
      if (dot > 0.9995) {
        ka = 1 - e;
        kb = e;
      } else {
        const theta = Math.acos(dot);
        const sin = Math.sin(theta);
        ka = Math.sin((1 - e) * theta) / sin;
        kb = Math.sin(e * theta) / sin;
      }
      let qx = ka * ax + kb * bx;
      let qy = ka * ay + kb * by;
      let qz = ka * az + kb * bz;
      let qw = ka * aw + kb * bw;
      const ql = Math.hypot(qx, qy, qz, qw) || 1;
      qx /= ql; qy /= ql; qz /= ql; qw /= ql;
      const x2 = qx + qx;
      const y2 = qy + qy;
      const z2 = qz + qz;
      const xx = qx * x2;
      const xy = qx * y2;
      const xz = qx * z2;
      const yy = qy * y2;
      const yz = qy * z2;
      const zz = qz * z2;
      const wx = qw * x2;
      const wy = qw * y2;
      const wz = qw * z2;
      const o = i * 16;
      M[o] = (1 - (yy + zz)) * sx;
      M[o + 1] = (xy + wz) * sx;
      M[o + 2] = (xz - wy) * sx;
      M[o + 3] = 0;
      M[o + 4] = (xy - wz) * sy;
      M[o + 5] = (1 - (xx + zz)) * sy;
      M[o + 6] = (yz + wx) * sy;
      M[o + 7] = 0;
      M[o + 8] = (xz + wy) * sz;
      M[o + 9] = (yz - wx) * sz;
      M[o + 10] = (1 - (xx + yy)) * sz;
      M[o + 11] = 0;
      M[o + 12] = px;
      M[o + 13] = py;
      M[o + 14] = pz;
      M[o + 15] = 1;
      K[i3] = K0[i3] + (K1[i3] - K0[i3]) * e;
      K[i3 + 1] = K0[i3 + 1] + (K1[i3 + 1] - K0[i3 + 1]) * e;
      K[i3 + 2] = K0[i3 + 2] + (K1[i3 + 2] - K0[i3 + 2]) * e;
    }
  });
}

/* ----------------------------------------------------------------- camera */

type View = { cx: number; cy: number; halfW: number; halfH: number; az: number; el: number; shift: number };

/** One authored view per chapter. `shift` slides the object across the frame (fraction of halfW). */
const VIEWS: View[] = [
  { cx: 0, cy: 0, halfW: 2.05, halfH: 1.98, az: -0.2, el: 0.05, shift: 0 },
  { cx: 0, cy: -0.2, halfW: 1.78, halfH: 1.58, az: 0.3, el: 0.14, shift: -0.06 },
  { cx: 0, cy: 0, halfW: 1.5, halfH: 1.46, az: -0.5, el: 0.22, shift: 0.04 },
  { cx: 0, cy: 0, halfW: 1.85, halfH: 1.68, az: 0.5, el: 0.3, shift: -0.04 },
  { cx: 0, cy: -0.12, halfW: 2.0, halfH: 1.5, az: 0.04, el: 0.15, shift: 0 },
];

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
}

export function sampleCamera(progress: number, aspect: number, pointerX: number, pointerY: number, out: CameraPose): void {
  const x = clamp01(progress) * (STAGE_COUNT - 1);
  const a = Math.min(STAGE_COUNT - 2, Math.floor(x));
  const t = x - a;
  const e = t * t * (3 - 2 * t);
  const A = VIEWS[a];
  const B = VIEWS[a + 1];
  const mix = (k: keyof View) => A[k] + (B[k] - A[k]) * e;
  const halfW = mix("halfW");
  const halfH = mix("halfH");
  const az = mix("az") + pointerX * 0.14;
  const el = mix("el") - pointerY * 0.08;
  const tanHalf = Math.tan((CAMERA_FOV * Math.PI) / 360);
  const dist = Math.max(halfH / tanHalf, halfW / (tanHalf * Math.max(aspect, 0.2))) * 1.05;
  const shift = mix("shift") * halfW;
  const cx = mix("cx") - shift * Math.cos(az);
  const cz = shift * Math.sin(az);
  const cy = mix("cy");
  out.target = [cx, cy, cz];
  out.position = [cx + dist * Math.sin(az) * Math.cos(el), cy + dist * Math.sin(el), cz + dist * Math.cos(az) * Math.cos(el)];
}
