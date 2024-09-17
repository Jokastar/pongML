
class StateMachine {
  constructor(sharedData) {
    this.currentState = null;
    this.sharedData = sharedData; // Shared data like playerName, colors, etc.
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
        this.currentState.exit(); // Clean up if necessary before leaving current state
      }
      this.currentState = this.states[stateName];
      if (this.currentState.setup) {
        this.currentState.setup(); // Set up the new state
      }
    }
  }

  draw() {
    if (this.currentState && this.currentState.draw) {
      this.currentState.draw(); // Draw current state
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
    // Create input field and button for player name
    this.nameInput = createInput('');
    this.nameInput.attribute('placeholder', 'Enter Player Name');
    this.nameInput.style('width', '300px');           // Set the width of the input
    this.nameInput.style('height', '30px');           // Give some height to the input for padding
    this.nameInput.style('border', 'none');           // Remove the default border
    this.nameInput.style('border-bottom', '5px solid white'); // Add only the bottom white border
    this.nameInput.style('font-size', '20px');        // Font size for input text
    this.nameInput.style('padding', '10px 0'); 
    this.startButton = createButton('Start');
    this.startButton.style('font-size', '20px');
    this.startButton.style('padding', '10px 20px');

    // Handle the button press and transition to Clothing Selection
    this.startButton.mousePressed(() => {
      const playerName = this.nameInput.value();
      if (playerName.trim() !== "") {
        this.stateMachine.sharedData.Player1.name = playerName; // Save player name
        this.stateMachine.changeState("didacticiel");  // Proceed to clothing selection
        this.nameInput.remove();  // Remove input field
        this.startButton.remove();  // Remove button
      }
    });
  }

  draw() {
    background("#00513A");
    textSize(60);
    fill(255);
    text("PONG ML", this.stateMachine.sharedData.WIDTH / 2, this.stateMachine.sharedData.HEIGHT * 0.15);
    textSize(30);
    fill('#FF6D00');
    text("ENTER PLAYER NAME", this.stateMachine.sharedData.WIDTH / 2, this.stateMachine.sharedData.HEIGHT * 0.25);

    // Reposition the input and button
    this.nameInput.position(this.stateMachine.sharedData.WIDTH / 2 - 100, this.stateMachine.sharedData.HEIGHT * 0.35);
    this.startButton.position(this.stateMachine.sharedData.WIDTH / 2 - 50, this.stateMachine.sharedData.HEIGHT * 0.45);
  }
}

// Didacticiel State
class DidacticielState {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
    
  }

  setup() {
    console.log("Entered Didacticiel State");
    this.stateMachine.sharedData.Player1.selectedColors = this.stateMachine.sharedData.selectedColors
    
  }

  draw() {

    background(this.stateMachine.sharedData.field); 
    this.stateMachine.sharedData.Player1.draw();

    //didacticiels text
    
    fill("#00513A")
    textSize(18);
    text("Game didacticiel", ((this.stateMachine.sharedData.WIDTH / 2)), 20);
    text("Raise your left hand to push down the paddle", ((this.stateMachine.sharedData.WIDTH / 2)), 40);
    text("Raise your right hand to push up the paddle", ((this.stateMachine.sharedData.WIDTH / 2)), 60);
    text("Remove your both hands to stay neutral", ((this.stateMachine.sharedData.WIDTH / 2)), 80);
    text("hands: " + this.stateMachine.sharedData.handDetection.hands, ((this.stateMachine.sharedData.WIDTH / 2)), this.stateMachine.sharedData.HEIGHT - 150);
    text("Press 'Enter' when ready to Start", ((this.stateMachine.sharedData.WIDTH / 2)), this.stateMachine.sharedData.HEIGHT - 100);

    //hand detection
    this.stateMachine.sharedData.detectHandMovement()

    //go to the game step
    if (keyIsPressed && keyCode === ENTER) {
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
    this.stateMachine.sharedData.ball.reset("player1"); 
    console.log("Entered Init State");
  }

  draw() {
    background(this.stateMachine.sharedData.field);
    this.stateMachine.sharedData.Player1.draw();
    this.stateMachine.sharedData.Player2.draw();
    this.stateMachine.sharedData.ball.draw();

    text("Press 'SPACE' to Serve".toUpperCase(), ((this.stateMachine.sharedData.WIDTH / 2)), 20);

    if (keyIsPressed && key === " ") {
      this.stateMachine.changeState("play");
    }
  }
}

// Play State
class PlayState {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
    this.winningScore = 7
  }

  setup() {
    console.log("Entered Play State");
  }

  draw() {
    // Destructure shared data for easier access
    const { field, ball, Player1, Player2, WIDTH, HEIGHT, model } = this.stateMachine.sharedData;
    
    background(field);

    // Update and draw ball
    ball.edges();
    ball.collides(Player1);
    ball.collides(Player2);
    ball.update();
    ball.draw();

    // Draw paddles
    Player1.draw();
    Player2.draw();

    // Player1 movement based on hand detection
    //this.stateMachine.sharedData.detectHandMovment();

    // Player1 movement using keys
    if (keyIsDown(65)) { // 'A' key (Move Player2 up)
      Player1.move_up();
    }

    if (keyIsDown(81)) { // 'Q' key (Move Player2 down)
      Player1.move_down(HEIGHT);
    }

    // Player2 CPU movement using keys
    if (ball.y < Player2.y) {
      Player2.move_up();
    } else if (ball.y > Player2.y + Player2.height) {
      Player2.move_down(HEIGHT);
    }
    // Check if a point has been scored
    if (ball.point_scored()) {
      if (ball.x < 0) {
        this.stateMachine.sharedData.player2_score++;
        this.stateMachine.sharedData.winner = "player2";
      } else if (ball.x > WIDTH) {
        this.stateMachine.sharedData.player1_score++;
        this.stateMachine.sharedData.winner = "player1";
      }

      // Check for winning condition
      if (this.stateMachine.sharedData.player1_score >= this.winningScore) {
        // Player 1 wins
        this.stateMachine.sharedData.winner = Player1.name;
        this.stateMachine.changeState("setAndMatch");
      } else if (this.stateMachine.sharedData.player2_score >= this.winningScore) {
        // Player 2 wins
        this.stateMachine.sharedData.winner = Player2.name;
        this.stateMachine.changeState("setAndMatch");
      } else {
        // Continue to next serve if no one has won yet
        this.stateMachine.changeState("serve");
      }
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
    let winner = this.stateMachine.sharedData.winner; 
    this.stateMachine.sharedData.ball.reset(winner);
    this.stateMachine.sharedData.Player1.initYPosition()
    this.stateMachine.sharedData.Player2.initYPosition()

  }

  draw() {
    background(this.stateMachine.sharedData.field); 
    text("Press SPACE to serve", (this.stateMachine.sharedData.WIDTH / 2 ), 80);

    textSize(60);
    text(this.stateMachine.sharedData.player1_score, (this.stateMachine.sharedData.WIDTH / 3), 100);
    text(this.stateMachine.sharedData.player2_score, (this.stateMachine.sharedData.WIDTH - (this.stateMachine.sharedData.WIDTH / 3)), 100);

    this.stateMachine.sharedData.Player1.draw();
    this.stateMachine.sharedData.Player2.draw();
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
    this.isDataCollectionComplete = false; // Flag to check if data collection is done
  }

  setup() {
    console.log("Entered Set and Match State");
  }

  

  draw() {
    textSize(20);
    text(this.stateMachine.sharedData.winner + " is the Winner!", (this.stateMachine.sharedData.WIDTH / 2), 50);

    textSize(48);
    text(this.stateMachine.sharedData.player1_score, this.stateMachine.sharedData.WIDTH / 3, 100);
    text(this.stateMachine.sharedData.player2_score, this.stateMachine.sharedData.WIDTH - (this.stateMachine.sharedData.WIDTH / 3), 100);

    textSize(32);
    text("press SPACE to restart", this.stateMachine.sharedData.WIDTH / 2, this.stateMachine.sharedData.HEIGHT - 100);

    // Check if the key is pressed and the data collection is complete
    if (keyIsPressed && key === " ") {
      this.stateMachine.changeState("init");
    }

  }
}




