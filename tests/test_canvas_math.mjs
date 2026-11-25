import test from "node:test";
import assert from "node:assert/strict";
import { computeStringWavePoints } from "../static/js/stage-canvas.js";

test("computeStringWavePoints pins endpoints and displaces middle when energy > 0", () => {
  const pts = computeStringWavePoints({ x: 100, y: 200 }, { x: 500, y: 200 }, 1.0, Math.PI / 2, 25);
  assert.equal(pts.length, 25);
  assert.equal(pts[0].x, 100);
  assert.equal(pts[0].y, 200);
  assert.equal(pts[24].x, 500);
  assert.equal(pts[24].y, 200);
  assert.ok(Math.abs(pts[12].y - 200) > 5.0, "Midpoint should vibrate perpendicularly");
});

test("computeStringWavePoints has zero displacement when energy is 0", () => {
  const pts = computeStringWavePoints({ x: 50, y: 100 }, { x: 250, y: 300 }, 0, 1.2, 21);
  assert.equal(pts.length, 21);
  // Straight line interpolation at midpoint
  assert.ok(Math.abs(pts[10].x - 150) < 1e-6);
  assert.ok(Math.abs(pts[10].y - 200) < 1e-6);
});
