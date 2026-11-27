// CRAFT mark: a thick C (liquid metal) with a brick (heat) lying in its mouth.
// The idea in one picture: the learner's own project is the brick, CRAFT is the hand that holds it.
// One geometry, three renderers: this SVG (header, favicon), the live liquid-metal shader
// (lib/liquid-mark-gl.ts, constants mirrored there and checked by tests/security/brand-mark.test.mjs)
// and the pre-rendered still (scripts/brand/render-liquid-mark.mjs).

export const markGeometry = {
  /** Coordinates are in a 64 x 64 box, y down, like the SVG. */
  box: 64,
  /** The C is an arc of radius r drawn with a round-capped stroke; mouthDeg is the half-opening on the right. */
  c: { cx: 30, cy: 32, r: 19, stroke: 10, mouthDeg: 52 },
  /** The brick is a 3:2 rounded rectangle, turned a little, like a brick that has just been laid. */
  brick: { cx: 48, cy: 32, w: 20, h: 13, rx: 2.5, rotDeg: -8 },
} as const;

/** End points of the arc: centre + r * (cos 52deg, -/+ sin 52deg). Large arc, counter-clockwise through the left side. */
export const markArcPath = "M41.70 17.03A19 19 0 1 0 41.70 46.97";
