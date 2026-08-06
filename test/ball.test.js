require("./helpers/setup");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const Ball = require("../public/Ball.js");
const Paddle = require("../public/Paddle.js");

const SCREEN_HEIGHT = 500;
const SCREEN_WIDTH = 800;

function makeBall(x, y) {
  return new Ball(x, y, SCREEN_HEIGHT, SCREEN_WIDTH);
}

test("edges() bounces the ball off the top", () => {
  const ball = makeBall(400, -5);
  ball.dy = -3;
  ball.edges();
  assert.equal(ball.y, 0);
  assert.equal(ball.dy, 3);
});

test("edges() bounces the ball off the bottom", () => {
  const ball = makeBall(400, SCREEN_HEIGHT);
  ball.dy = 3;
  ball.edges();
  assert.equal(ball.y, SCREEN_HEIGHT - ball.height);
  assert.equal(ball.dy, -3);
});

test("collides() bounces off a left-side paddle by side, not by x position", () => {
  const paddle = new Paddle(0, 100, "left");
  const ball = makeBall(paddle.x + paddle.width - 1, 110);
  ball.dx = -5;
  ball.collides(paddle);
  assert.equal(ball.x, paddle.x + paddle.width);
  assert.ok(ball.dx > 0, "dx should have flipped to positive");
});

test("collides() bounces off a right-side paddle by side, not by x position", () => {
  const paddle = new Paddle(780, 100, "right");
  const ball = makeBall(paddle.x - 1, 110);
  ball.width = 15;
  ball.dx = 5;
  ball.collides(paddle);
  assert.equal(ball.x, paddle.x - ball.width);
  assert.ok(ball.dx < 0, "dx should have flipped to negative");
});

test("collides() does nothing when the ball is out of the paddle's vertical range", () => {
  const paddle = new Paddle(0, 100, "left");
  const ball = makeBall(paddle.x, 400); // far below the paddle
  const dxBefore = ball.dx;
  ball.collides(paddle);
  assert.equal(ball.dx, dxBefore);
});

test("point_scored() is true when the ball crosses either goal line", () => {
  assert.equal(makeBall(0, 100).point_scored(), true);
  assert.equal(makeBall(SCREEN_WIDTH, 100).point_scored(), true);
  assert.equal(makeBall(400, 100).point_scored(), false);
});

test("reset() serves toward the player who did not just win the point", () => {
  const ball = makeBall(400, 250);
  ball.reset("player1");
  assert.equal(ball.x, ball.init_x);
  assert.equal(ball.y, ball.init_y);
  assert.ok(ball.dx < 0, "should serve toward player1 (negative dx)");

  ball.reset("player2");
  assert.ok(ball.dx > 0, "should serve toward player2 (positive dx)");
});
