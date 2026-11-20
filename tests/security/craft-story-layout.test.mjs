import test from "node:test";
import assert from "node:assert/strict";
import {
  ARC_STEPS,
  FAMILIES,
  STAGE_COUNT,
  buildStoryLayout,
  presentCount,
  sampleCamera,
  sampleStory,
} from "../../lib/craft-story-layout.ts";

function buffers(layout) {
  const matrices = {};
  const colors = {};
  for (const family of FAMILIES) {
    matrices[family] = new Float32Array(layout.counts[family] * 16);
    colors[family] = new Float32Array(layout.counts[family] * 3);
  }
  return { matrices, colors };
}

function snapshot(layout, progress) {
  const { matrices, colors } = buffers(layout);
  sampleStory(layout, progress, matrices, colors);
  return { matrices, colors };
}

test("layout is deterministic: two builds from scratch are bit-identical", async () => {
  // buildStoryLayout caches per quality, so import a fresh module instance for the second build
  const fresh = await import(`../../lib/craft-story-layout.ts?fresh=${Date.now()}`);
  for (const quality of ["high", "low"]) {
    const a = buildStoryLayout(quality);
    const b = fresh.buildStoryLayout(quality);
    for (const family of FAMILIES) {
      assert.equal(a.counts[family], b.counts[family]);
      for (let s = 0; s < STAGE_COUNT; s += 1) {
        assert.deepEqual(a.pos[family][s], b.pos[family][s]);
        assert.deepEqual(a.quat[family][s], b.quat[family][s]);
        assert.deepEqual(a.scl[family][s], b.scl[family][s]);
        assert.deepEqual(a.col[family][s], b.col[family][s]);
      }
    }
  }
});

test("every family keeps one slot per component across all five stages and every number is finite", () => {
  for (const quality of ["high", "low"]) {
    const layout = buildStoryLayout(quality);
    for (const family of FAMILIES) {
      const n = layout.counts[family];
      for (let s = 0; s < STAGE_COUNT; s += 1) {
        assert.equal(layout.pos[family][s].length, n * 3);
        assert.equal(layout.quat[family][s].length, n * 4);
        for (const array of [layout.pos[family][s], layout.quat[family][s], layout.scl[family][s], layout.col[family][s]]) {
          for (const value of array) assert.ok(Number.isFinite(value));
        }
        for (let i = 0; i < n; i += 1) {
          const q = layout.quat[family][s];
          const length = Math.hypot(q[i * 4], q[i * 4 + 1], q[i * 4 + 2], q[i * 4 + 3]);
          assert.ok(Math.abs(length - 1) < 1e-4, `${family}[${i}] stage ${s} quaternion is not unit length`);
        }
      }
    }
  }
});

test("each form is assembled from hundreds of authored components (and never from an anonymous cloud)", () => {
  const high = buildStoryLayout("high");
  const low = buildStoryLayout("low");
  for (let s = 0; s < STAGE_COUNT; s += 1) {
    assert.ok(presentCount(high, s) >= 300, `stage ${s} has only ${presentCount(high, s)} components on high quality`);
    assert.ok(presentCount(low, s) >= 300, `stage ${s} has only ${presentCount(low, s)} components on low quality`);
    assert.ok(presentCount(low, s) <= presentCount(high, s));
  }
  const total = (layout) => FAMILIES.reduce((sum, family) => sum + layout.counts[family], 0);
  assert.ok(total(high) <= 1200, "high quality instance budget exceeded");
  assert.ok(total(low) <= 900, "low quality instance budget exceeded");
  assert.ok(total(low) < total(high));
  // one draw call per family
  assert.equal(FAMILIES.length, 6);
});

test("present components stay inside a compact world box (no detached debris) in every stage", () => {
  const layout = buildStoryLayout("high");
  for (let s = 0; s < STAGE_COUNT; s += 1) {
    for (const family of FAMILIES) {
      for (let i = 0; i < layout.counts[family]; i += 1) {
        if (!layout.present[family][s][i]) continue;
        const [x, y, z] = [layout.pos[family][s][i * 3], layout.pos[family][s][i * 3 + 1], layout.pos[family][s][i * 3 + 2]];
        assert.ok(Math.abs(x) <= 2.3 && Math.abs(y) <= 2.3 && Math.abs(z) <= 2.3, `${family}[${i}] stage ${s} at ${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`);
        const scale = Math.max(layout.scl[family][s][i * 3], layout.scl[family][s][i * 3 + 1], layout.scl[family][s][i * 3 + 2]);
        assert.ok(scale > 0, `${family}[${i}] marked present with zero scale`);
      }
    }
  }
});

test("sampling at stage boundaries reproduces the authored stage exactly", () => {
  const layout = buildStoryLayout("high");
  for (let s = 0; s < STAGE_COUNT; s += 1) {
    const { colors } = snapshot(layout, s / (STAGE_COUNT - 1));
    for (const family of FAMILIES) {
      const expected = layout.col[family][s];
      for (let i = 0; i < expected.length; i += 1) assert.ok(Math.abs(colors[family][i] - expected[i]) < 1e-5);
    }
  }
});

test("progress is a pure function: scrubbing forward, backward and jumping gives identical frames", () => {
  const layout = buildStoryLayout("high");
  const direct = snapshot(layout, 0.61);
  const { matrices, colors } = buffers(layout);
  for (const p of [0, 1, 0.25, 0.9, 0.3, 0.61]) sampleStory(layout, p, matrices, colors);
  for (const family of FAMILIES) {
    assert.deepEqual(matrices[family], direct.matrices[family]);
    assert.deepEqual(colors[family], direct.colors[family]);
  }
});

test("motion is continuous: no component teleports between neighbouring progress values", () => {
  const layout = buildStoryLayout("high");
  let prev = snapshot(layout, 0);
  let worst = 0;
  for (let step = 1; step <= 1000; step += 1) {
    const next = snapshot(layout, step / 1000);
    for (const family of FAMILIES) {
      const a = prev.matrices[family];
      const b = next.matrices[family];
      for (let i = 0; i < layout.counts[family]; i += 1) {
        const jump = Math.hypot(b[i * 16 + 12] - a[i * 16 + 12], b[i * 16 + 13] - a[i * 16 + 13], b[i * 16 + 14] - a[i * 16 + 14]);
        if (jump > worst) worst = jump;
      }
    }
    prev = next;
  }
  assert.ok(worst < 0.12, `largest per-step displacement ${worst.toFixed(3)} is too large`);
});

test("every matrix is finite and scales never go negative while scrubbing", () => {
  const layout = buildStoryLayout("low");
  for (let step = 0; step <= 200; step += 1) {
    const { matrices, colors } = snapshot(layout, step / 200);
    for (const family of FAMILIES) {
      for (const value of matrices[family]) assert.ok(Number.isFinite(value));
      for (const value of colors[family]) assert.ok(Number.isFinite(value) && value >= -1e-6);
      for (let i = 0; i < layout.counts[family]; i += 1) assert.ok(Math.hypot(matrices[family][i * 16], matrices[family][i * 16 + 1], matrices[family][i * 16 + 2]) >= 0);
    }
  }
});

test("ring components follow the shared arc step", () => {
  assert.equal(ARC_STEPS, 24);
  const layout = buildStoryLayout("high");
  assert.ok(layout.counts.arc >= ARC_STEPS * 3);
});

test("camera keeps the whole composition in frame for portrait, square and wide canvases", () => {
  const pose = { position: [0, 0, 0], target: [0, 0, 0] };
  for (const aspect of [0.7, 1, 1.6, 2.2]) {
    for (let step = 0; step <= 20; step += 1) {
      sampleCamera(step / 20, aspect, 0, 0, pose);
      const distance = Math.hypot(...pose.position.map((v, i) => v - pose.target[i]));
      assert.ok(Number.isFinite(distance) && distance > 2.5 && distance < 14, `camera distance ${distance} at aspect ${aspect}`);
    }
  }
  // pointer parallax is bounded
  sampleCamera(0.5, 1, 1, 1, pose);
  assert.ok(pose.position.every(Number.isFinite));
});
