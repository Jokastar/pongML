// Paddle.js/Ball.js are written as plain browser scripts and call a couple of
// p5.js globals directly (max/min). This shim provides just enough of that
// global surface so the game logic can be required and unit-tested in Node,
// without pulling in p5 itself.
global.max = Math.max;
global.min = Math.min;
