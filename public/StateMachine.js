
 class StateMachine {
    constructor(sharedData) {
      this.currentState = null;
      this.sharedData = sharedData; // This will hold global data like playerName, score, etc.
      this.states = {
        start: new StartState(this),
        playerName: new PlayerNameState(this),
        didacticiel: new DidacticielState(this),
        init: new InitState(this),
        play: new PlayState(this),
        serve: new ServeState(this),
        setAndMatch: new SetAndMatchState(this),
      };
    }
  
    changeState(stateName) {
      if (this.states[stateName]) {
        if (this.currentState && this.currentState.exit) {
          this.currentState.exit(); // Exit current state
        }
        this.currentState = this.states[stateName];
        if (this.currentState.setup) {
          this.currentState.setup(); // Setup new state
        }
      }
    }
  
    draw() {
      if (this.currentState && this.currentState.draw) {
        this.currentState.draw();
      }
    }
  }
  
  // Start State
  class StartState {
    constructor(stateMachine) {
      this.stateMachine = stateMachine;
      this.bgImage = loadImage("./assets/images/main-page.svg");
    }
  
    setup() {
      console.log("Entered Start State");
      
    }
  
    draw() {
      background(this.bgImage);
      fill(255);
      textSize(30);
      textAlign(CENTER, CENTER);
      text("Press Enter to start", (this.stateMachine.sharedData.WIDTH / 2), this.stateMachine.sharedData.HEIGHT * 0.8);
  
      if (keyIsPressed && keyCode === ENTER) {
        this.stateMachine.changeState("playerName");
      }
    }
  }
  
  // Player Name Entry State
  class PlayerNameState {
    constructor(stateMachine) {
      this.stateMachine = stateMachine;
      this.nameInput = null;
      this.startButton = null;
    }
  
    setup() {
      console.log("Entered Player Name State");
      // Create input and button for player name
      this.nameInput = createInput('');
      this.nameInput.attribute('placeholder', 'Enter Player Name');
      this.startButton = createButton('Start');
      this.startButton.mousePressed(() => {
        const playerName = this.nameInput.value();
        if (playerName.trim() !== "") {
          this.stateMachine.sharedData.playerName = playerName; // Save player name to shared data
          this.stateMachine.changeState("didacticiel");
          this.nameInput.remove();
          this.startButton.remove();
        }
      });
    }
  
    draw() {
      background("#00513A");
      textAlign(CENTER, CENTER);
      textSize(30);
      fill(255);
      text("PONG ML", (this.stateMachine.sharedData.WIDTH / 2), this.stateMachine.sharedData.HEIGHT * 0.1);
      textSize(20);
      text("ENTER PLAYER NAME", (this.stateMachine.sharedData.WIDTH / 2), this.stateMachine.sharedData.HEIGHT * 0.2);
  
      // Position the input and button in the center
      if (this.nameInput) {
        this.nameInput.position(this.stateMachine.sharedData.WIDTH / 2 - this.nameInput.width / 2, this.stateMachine.sharedData.HEIGHT * 0.3);
      }
      if (this.startButton) {
        this.startButton.position(this.stateMachine.sharedData.WIDTH / 2 - this.startButton.width / 2, this.stateMachine.sharedData.HEIGHT * 0.4);
      }
    }
  }
  
  // Didacticiel State
  class DidacticielState {
    constructor(stateMachine) {
      this.stateMachine = stateMachine;
    }
  
    setup() {
      console.log("Entered Didacticiel State");
    }
  
    draw() {
      background(0);
      this.stateMachine.sharedData.Player1.draw();
  
      textSize(14);
      text("Game didacticiel", ((this.stateMachine.sharedData.WIDTH / 3)), 20);
      text("Raise your left hand to push down the paddle", ((this.stateMachine.sharedData.WIDTH / 3)), 40);
      text("Raise your right hand to push up the paddle", ((this.stateMachine.sharedData.WIDTH / 3)), 60);
      text("Remove your both hands to stay neutral", ((this.stateMachine.sharedData.WIDTH / 3)), 80);
      text("hands: " + this.stateMachine.sharedData.handDetection.hands, ((this.stateMachine.sharedData.WIDTH / 3)), this.stateMachine.sharedData.HEIGHT - 150);
      text("Press 'S' when ready to Start", ((this.stateMachine.sharedData.WIDTH / 3)), this.stateMachine.sharedData.HEIGHT - 100);
  
      if (this.stateMachine.sharedData.handDetection.hands.toLowerCase() === "right") {
        this.stateMachine.sharedData.Player1.move_up();
      } else if (this.stateMachine.sharedData.handDetection.hands.toLowerCase() === "left") {
        this.stateMachine.sharedData.Player1.move_down(this.stateMachine.sharedData.HEIGHT);
      }
  
      if (keyIsPressed && key === "s") {
        this.stateMachine.changeState("init");
      }
    }
  }
  
  // Init State
  class InitState {
    constructor(stateMachine) {
      this.stateMachine = stateMachine;
    }
  
    setup() {
      this.stateMachine.sharedData.player1_score = 0;
      this.stateMachine.sharedData.player2_score = 0;
      console.log("Entered Init State");
    }
  
    draw() {
      background(0);
      this.stateMachine.sharedData.Player1.draw();
      this.stateMachine.sharedData.Player2.draw();
      this.stateMachine.sharedData.ball.draw();
  
      if (keyIsPressed && key === "s") {
        this.stateMachine.changeState("play");
      }
    }
  }
  
  // Play State
  class PlayState {
    constructor(stateMachine) {
      this.stateMachine = stateMachine;
    }
  
    setup() {
      console.log("Entered Play State");
    }
  
    draw() {
      background(0);
  
      this.stateMachine.sharedData.ball.edges();
      this.stateMachine.sharedData.ball.collides(this.stateMachine.sharedData.Player1);
      this.stateMachine.sharedData.ball.collides(this.stateMachine.sharedData.Player2);
      this.stateMachine.sharedData.ball.update();
      this.stateMachine.sharedData.ball.draw();
      this.stateMachine.sharedData.Player1.draw();
      this.stateMachine.sharedData.Player2.draw();
  
      if (this.stateMachine.sharedData.ball.point_scored()) {
        if (this.stateMachine.sharedData.ball.x < 0) {
          this.stateMachine.sharedData.player2_score++;
        } else if (this.stateMachine.sharedData.ball.x > this.stateMachine.sharedData.WIDTH) {
          this.stateMachine.sharedData.player1_score++;
        }
        this.stateMachine.changeState("serve");
      }
    }
  }
  
  // Serve State
  class ServeState {
    constructor(stateMachine) {
      this.stateMachine = stateMachine;
    }
  
    setup() {
      console.log("Entered Serve State");
    }
  
    draw() {
      background(0);
      textSize(20);
      text("Press SPACE to serve", (this.stateMachine.sharedData.WIDTH / 3 + 50), 50);
  
      textSize(60);
      text(this.stateMachine.sharedData.player1_score, this.stateMachine.sharedData.WIDTH / 3, 150);
      text(this.stateMachine.sharedData.player2_score, this.stateMachine.sharedData.WIDTH - (this.stateMachine.sharedData.WIDTH / 3), 150);
  
      this.stateMachine.sharedData.Player1.draw();
      this.stateMachine.sharedData.Player2.draw();
      this.stateMachine.sharedData.ball.reset(this.stateMachine.sharedData.winner);
      this.stateMachine.sharedData.ball.draw();
  
      if (keyIsPressed && key === " ") {
        this.stateMachine.changeState("play");
      }
    }
  }
  
  // Set & Match State
  class SetAndMatchState {
    constructor(stateMachine) {
      this.stateMachine = stateMachine;
    }
  
    setup() {
      console.log("Entered Set and Match State");
    }
  
    draw() {
      background(0);
      textSize(20);
      text(this.stateMachine.sharedData.winner + " is the Winner!", (this.stateMachine.sharedData.WIDTH / 3 + 50), 50);
  
      textSize(48);
      text(this.stateMachine.sharedData.player1_score, this.stateMachine.sharedData.WIDTH / 3, 100);
      text(this.stateMachine.sharedData.player2_score, this.stateMachine.sharedData.WIDTH - (this.stateMachine.sharedData.WIDTH / 3), 100);
  
      textSize(32);
      text("press SPACE to restart", this.stateMachine.sharedData.WIDTH / 3, this.stateMachine.sharedData.HEIGHT - 100);
  
      if (keyIsPressed && key === " ") {
        this.stateMachine.changeState("init");
      }
    }
  }
  
  