// Brick shapes of the persistent 3D object. Pure and deterministic: the same count always gives the same bricks.
// Every state places exactly n bricks; bricks a shape does not need float around it as dust.
// State order: scatter -> block -> tower (six tiers, one per stage) -> parts (three) -> coin (the CRAFT mark in relief).

export const BRICK = { w: 0.1, h: 0.05, d: 0.05 } as const;
const GAP = 0.006;
const PX = BRICK.w + GAP;
const PY = BRICK.h + GAP;
const PZ = BRICK.d + GAP;

export const TEX_W = 128;
export const STATES = ["scatter", "block", "tower", "parts", "coin"] as const;
export const TIERS = 6;

type Mark = {
  box: number;
  c: { cx: number; cy: number; r: number; stroke: number; mouthDeg: number };
  brick: { cx: number; cy: number; w: number; h: number; rotDeg: number };
};
type Quat = [number, number, number, number];
type Brick = { x: number; y: number; z: number; q: Quat; heat: number; tier: number };
/** at() returns -1 outside, else tier * 2 + heat */
type Shape = { half: [number, number, number]; at: (x: number, y: number, z: number) => number };

/** 4 * nx^3 bricks: a block of nx : 2nx : 2nx bricks has equal sides. */
export const bricksFor = (nx: number) => 4 * nx * nx * nx;

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash3(x: number, y: number, z: number) {
  let h = Math.imul(Math.round(x * 997) | 0, 374761393) ^ Math.imul(Math.round(y * 1999) | 0, 668265263) ^ Math.imul(Math.round(z * 2999) | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function unitVec(r: () => number): [number, number, number] {
  const z = r() * 2 - 1;
  const a = r() * Math.PI * 2;
  const s = Math.sqrt(1 - z * z);
  return [s * Math.cos(a), s * Math.sin(a), z];
}

function randQuat(r: () => number): Quat {
  const u1 = r();
  const u2 = r() * Math.PI * 2;
  const u3 = r() * Math.PI * 2;
  const a = Math.sqrt(1 - u1);
  const b = Math.sqrt(u1);
  return [a * Math.sin(u2), a * Math.cos(u2), b * Math.sin(u3), b * Math.cos(u3)];
}

/** Is the point (u, v in -1..1, v up) inside the CRAFT mark: the C ring or the brick lying in its mouth. */
export function inMark(m: Mark, u: number, v: number) {
  const half = m.box / 2;
  const bx = half + u * half;
  const by = half - v * half;
  const dx = bx - m.c.cx;
  const dy = by - m.c.cy;
  if (Math.abs(Math.hypot(dx, dy) - m.c.r) <= m.c.stroke / 2 && (Math.abs(Math.atan2(-dy, dx)) * 180) / Math.PI >= m.c.mouthDeg) return true;
  const a = (m.brick.rotDeg * Math.PI) / 180;
  const px = bx - m.brick.cx;
  const py = by - m.brick.cy;
  const lx = px * Math.cos(a) + py * Math.sin(a);
  const ly = -px * Math.sin(a) + py * Math.cos(a);
  return Math.abs(lx) <= m.brick.w / 2 && Math.abs(ly) <= m.brick.h / 2;
}

const blockShape = (s: number): Shape => {
  const hx = 0.8 * s;
  const hy = 0.6 * s;
  const hz = 0.6 * s;
  return { half: [hx, hy, hz], at: (x, y, z) => (Math.abs(x) <= hx && Math.abs(y) <= hy && Math.abs(z) <= hz ? (hash3(x, y, z) < 0.035 ? 1 : 0) : -1) };
};

const towerShape = (s: number): Shape => {
  const th = 0.26 * s;
  const hy = (TIERS / 2) * th;
  return {
    half: [0.85 * s, hy, 0.85 * s],
    at: (x, y, z) => {
      const t = Math.floor((y + hy) / th);
      if (t < 0 || t >= TIERS) return -1;
      const w = 0.85 * s * (1 - 0.13 * t);
      if (Math.abs(x) > w || Math.abs(z) > w * 0.9) return -1;
      return t * 2 + (t === TIERS - 1 || hash3(x, y, z) < 0.02 ? 1 : 0);
    },
  };
};

const partsShape = (s: number): Shape => {
  const hx = 0.7 * s;
  const hy = 0.3 * s;
  const hz = 0.45 * s;
  const centres = [
    [-0.3, 0.78],
    [0, 0],
    [0.3, -0.78],
  ];
  return {
    half: [1.0 * s, 1.08 * s, hz],
    at: (x, y, z) => {
      for (let p = 0; p < 3; p++) {
        if (Math.abs(x - centres[p][0] * s) <= hx && Math.abs(y - centres[p][1] * s) <= hy && Math.abs(z) <= hz) return p * 2 + (hash3(x, y, z) < 0.05 ? 1 : 0);
      }
      return -1;
    },
  };
};

const COIN_BODY = 4; // layers k = -4..4
const coinShape =
  (mark: Mark) =>
  (s: number): Shape => {
    const zBody = COIN_BODY * PZ + 1e-6;
    const zRelief = (COIN_BODY + 2) * PZ + 1e-6;
    return {
      half: [s, s, zRelief],
      at: (x, y, z) => {
        const r = Math.hypot(x, y);
        if (r > s || z < -zBody || z > zRelief) return -1;
        if (z <= zBody) return 0;
        if (inMark(mark, x / s, y / s)) return 1;
        return r > 0.9 * s && z <= zBody + PZ ? 0 : -1;
      },
    };
  };

function walk(shape: Shape, visit: (x: number, y: number, z: number, code: number) => void) {
  const [hx, hy, hz] = shape.half;
  const jy = Math.ceil(hy / PY);
  const kz = Math.ceil(hz / PZ);
  const ix = Math.ceil(hx / PX) + 1;
  for (let j = -jy; j <= jy; j++) {
    const off = (j & 1) * 0.5 * PX;
    for (let k = -kz; k <= kz; k++) {
      for (let i = -ix; i <= ix; i++) {
        const x = i * PX + off;
        const y = j * PY;
        const z = k * PZ;
        const code = shape.at(x, y, z);
        if (code >= 0) visit(x, y, z, code);
      }
    }
  }
}

/** The largest shape (running-bond lattice, fixed brick size) that needs at most n bricks, the rest become dust. */
function shapeState(make: (s: number) => Shape, n: number, r: () => number): Brick[] {
  let lo = 0.3;
  let hi = 2.4;
  for (let it = 0; it < 10; it++) {
    const mid = (lo + hi) / 2;
    let count = 0;
    walk(make(mid), () => {
      count++;
    });
    if (count <= n) lo = mid;
    else hi = mid;
  }
  const shape = make(lo);
  const out: Brick[] = [];
  walk(shape, (x, y, z, code) => {
    if (out.length < n) out.push({ x, y, z, q: [0, 0, 0, 1], heat: code & 1, tier: code >> 1 });
  });
  const rad = Math.hypot(shape.half[0], shape.half[1], shape.half[2]);
  while (out.length < n) {
    const d = unitVec(r);
    const k = rad * (1.15 + 0.7 * r());
    out.push({ x: d[0] * k, y: d[1] * k * 0.8, z: d[2] * k * 0.8, q: randQuat(r), heat: r() < 0.3 ? 1 : 0, tier: Math.floor(r() * TIERS) });
  }
  return out;
}

function scatterState(n: number, r: () => number): Brick[] {
  const out: Brick[] = [];
  for (let i = 0; i < n; i++) {
    const d = unitVec(r);
    const k = 0.9 + 1.4 * Math.pow(r(), 0.8);
    out.push({ x: d[0] * k + 0.7, y: d[1] * k * 0.8, z: d[2] * k * 0.6, q: randQuat(r), heat: r() < 0.06 ? 1 : 0, tier: Math.floor(r() * TIERS) });
  }
  return out;
}

/** Same rank = same brick in every state; ordering by height keeps neighbouring bricks neighbours while they travel. */
const byHeight = (a: Brick, b: Brick) => a.y - b.y || Math.atan2(a.z, a.x) - Math.atan2(b.z, b.x);

export function buildBrickData(nx: number, mark: Mark) {
  const n = bricksFor(nx);
  const rows = Math.ceil(n / TEX_W);
  const r = rng(20261126);
  const per = [scatterState(n, r), shapeState(blockShape, n, r), shapeState(towerShape, n, r), shapeState(partsShape, n, r), shapeState(coinShape(mark), n, r)].map((list) => list.sort(byHeight));
  // RGBA32F texture, TEX_W wide: for each state a layer of positions (xyz + heat) and a layer of quaternions
  const states = new Float32Array(STATES.length * 2 * rows * TEX_W * 4);
  per.forEach((list, k) =>
    list.forEach((b, i) => {
      const col = (i % TEX_W) * 4;
      const row = Math.floor(i / TEX_W);
      const p = (k * 2 * rows + row) * TEX_W * 4 + col;
      const q = ((k * 2 + 1) * rows + row) * TEX_W * 4 + col;
      states.set([b.x, b.y, b.z, b.heat], p);
      states.set(b.q, q);
    }),
  );
  const seed = new Float32Array(n);
  const stage = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    seed[i] = r();
    stage[i] = per[2][i].tier;
  }
  return { n, rows, states, seed, stage, textureHeight: STATES.length * 2 * rows };
}
