
let WIDTH;
let HEIGHT;
let Player1;
let Player2;
let ball;
let player1_score;
let player2_score;
let winner;
let handDetection;
let video;
let stateMachine;
let myFont;     // State machine

function preload() {
  handDetection = new HandDetection();
  handDetection.preload();
  myFont = loadFont("./assets/fonts/ConsidermevexedRegular-ExLe.ttf");
}

function setup() {
  WIDTH = windowWidth;
  HEIGHT = windowHeight;

  createCanvas(WIDTH, HEIGHT);

  //text parameters
  textFont(myFont)
  textAlign(CENTER, CENTER);

  //Video element for detecting hand movement
  video = createCapture(VIDEO);
  video.size(WIDTH, HEIGHT);
  video.hide();
  handDetection.setup(video);

  //Initialize game variables
  Player1 = new Paddle(5, HEIGHT - 100, 100, {});
  Player2 = new Paddle(WIDTH  - 10, 0, HEIGHT, { top: '#0000FF', bottom: '#000080' });
  player1_score = 0;
  player2_score = 0;
  ball = new Ball((WIDTH / 2), (HEIGHT / 2), HEIGHT, WIDTH);

  //Shared data object
  const sharedData = {
    WIDTH,
    HEIGHT,
    Player1,
    Player2,
    ball,
    player1_score,
    player2_score,
    winner,
    handDetection,
    playerName: "",
    selectedColors:"",
    field: loadImage("./assets/images/tennis-field.svg")
  };

  // Initialize state machine with shared data
  stateMachine = new StateMachine(sharedData);
  stateMachine.changeState("start");
}

function mouseMoved() {
  stateMachine.currentState?.mouseMoved(mouseX, mouseY);
}

function mousePressed() {
  stateMachine.currentState?.mousePressed(mouseX, mouseY);
}

function draw() {
  // Call the draw method of the current state in the state machine
  stateMachine.draw();
}

function windowResized() {
  WIDTH = windowWidth;
  HEIGHT = windowHeight;
  resizeCanvas(WIDTH, HEIGHT);
  if (Player1 || Player2) {
    // Update paddle and ball positions/sizes if needed
    Player1.updateSize(0, HEIGHT - 100, 100);
    Player2.updateSize(WIDTH - 10, 0, HEIGHT);
    ball.updateSize(WIDTH, HEIGHT);
  }
}
