let WIDTH;
let HEIGHT;
let Player1;
let Player2;
let ball;
let handDetection;
let video;
let stateMachine;
let myFont;
let cameraAvailable = false;

function preload() {
  handDetection = new HandDetection();
  handDetection.preload();
  myFont = loadFont("./assets/fonts/ConsidermevexedRegular-ExLe.ttf");
}

// Checks camera permission ourselves before handing off to p5's createCapture,
// which has no error callback of its own and would otherwise leave the game
// stuck silently if the user denies access or has no webcam.
async function requestCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => track.stop()); // p5 will open its own stream
    return true;
  } catch (err) {
    console.warn("Camera unavailable, falling back to keyboard-only controls:", err.message);
    return false;
  }
}

async function setup() {
  //create canvas
  WIDTH = 800;
  HEIGHT = 500;
  createCanvas(WIDTH, HEIGHT)

  //text parameters
  textFont(myFont)
  textAlign(CENTER, CENTER);

  //Video element for detecting hand movement (optional: game stays playable without it)
  cameraAvailable = await requestCamera();
  if (cameraAvailable) {
    video = createCapture(VIDEO);
    video.size(WIDTH, HEIGHT);
    video.hide();
    handDetection.setup(video);
  }

  //Initialize game variables
  Player1 = new Paddle(0, (HEIGHT - 150), "left");
  Player2 = new Paddle((WIDTH - 20), 100, "right");
  ball = new Ball((WIDTH / 2), (HEIGHT / 2), HEIGHT, WIDTH);

  //Shared data object
  const sharedData = {
    WIDTH,
    HEIGHT,
    Player1,
    Player2,
    ball,
    player1_score: 0,
    player2_score: 0,
    winner: undefined,
    handDetection,
    cameraAvailable,
    playerName: "",
    selectedColors:"",
    field: loadImage("./assets/images/tennis-field.svg"),
    detectHandMovement: function () {
      if (!cameraAvailable) return;
      if (handDetection.hands.toLowerCase() === "right") {
        Player1.move_up();
      } else if (handDetection.hands.toLowerCase() === "left") {
        Player1.move_down(HEIGHT);
      }
    }
  };


  // Initialize state machine with shared data
  stateMachine = new StateMachine(sharedData);
  stateMachine.changeState("start");
}

function mouseMoved() {
  stateMachine.currentState?.mouseMoved?.(mouseX, mouseY);
}

function mousePressed() {
  stateMachine.currentState?.mousePressed?.(mouseX, mouseY);
}

function draw() {
  // Call the draw method of the current state in the state machine
  stateMachine.draw();
}


