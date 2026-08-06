require("./helpers/setup");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const Paddle = require("../public/Paddle.js");

test("move_up decreases y but stops at the top edge (0)", () => {
  const paddle = new Paddle(0, 5, "left");
  paddle.move_up();
  assert.equal(paddle.y, 0); // speed is 10, so it clamps instead of going negative
});

test("move_up decreases y normally when away from the edge", () => {
  const paddle = new Paddle(0, 100, "left");
  paddle.move_up();
  assert.equal(paddle.y, 90);
});

test("move_down increases y but stops at the bottom edge", () => {
  const height = 500;
  const paddle = new Paddle(0, height - paddle_height(), "left");
  paddle.move_down(height);
  assert.equal(paddle.y, height - paddle.height);
});

test("move_down increases y normally when away from the edge", () => {
  const paddle = new Paddle(0, 100, "left");
  paddle.move_down(500);
  assert.equal(paddle.y, 110);
});

test("side is stored so collision logic doesn't need to guess from x", () => {
  const left = new Paddle(0, 0, "left");
  const right = new Paddle(780, 0, "right");
  assert.equal(left.side, "left");
  assert.equal(right.side, "right");
});

test("initYPosition moves the paddle back to its initial y", () => {
  const paddle = new Paddle(0, 100, "left");
  paddle.y = 250;
  paddle.initYPosition();
  assert.equal(paddle.y, 100);
});

function paddle_height() {
  return new Paddle(0, 0).height;
}
