class StateMachine {
  constructor(sharedData) {
    this.currentState = null;
    this.sharedData = sharedData; // Shared data like playerName, colors, etc.
    this.states = {
      start: new StartState(this),
      playerName: new PlayerNameState(this),
      clothingSelection: new ClothingSelectionState(this),
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
    this.nameInput.style('width', '600px');           // Set the width of the input
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
        this.stateMachine.changeState("clothingSelection");  // Proceed to clothing selection
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

// Clothing Selection State
class ClothingSelectionState {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
    this.choices = [];
    this.hoverIndex = -1;
    this.selectedColors = null;
    this.nextButton = null;  // Button to proceed to next state

    // Define color choices
    const colors = [
      { top: '#FFFFFF', bottom: '#FFFF00' },
      { top: '#FFC0CB', bottom: '#800080' },
      { top: '#FF0000', bottom: '#000000' },
      { top: '#808080', bottom: '#000000' },
      { top: '#0000FF', bottom: '#000080' },
      { top: '#008000', bottom: '#FFFFFF' },
    ];

    // Create choice objects
    for (let i = 0; i < 6; i++) {
      this.choices.push({
        x: 150 + (i % 3) * 150,
        y: 225 + Math.floor(i / 3) * 125,
        colors: colors[i],
        hover: false,
      });
    }

    // Bind mouseMoved and mousePressed handlers to 'this' context
    this.boundMouseMoved = this.mouseMoved.bind(this);
    this.boundMousePressed = this.mousePressed.bind(this);
  }

  setup() {
    console.log("Entered Clothing Selection State");

    // Create the "Next" button but hide it initially until a color is selected
    this.nextButton = createButton('Next');
    this.nextButton.style('font-size', '20px');
    this.nextButton.style('padding', '10px 20px');
    this.nextButton.position(this.stateMachine.sharedData.WIDTH / 2 - 50, this.stateMachine.sharedData.HEIGHT * 0.6);
    this.nextButton.hide();  // Hide until a color is selected

    // Handle the button press to go to the next state
    this.nextButton.mousePressed(() => {
      this.stateMachine.changeState("didacticiel");
      this.nextButton.remove();  // Remove the button once transitioning
    });

    // Register mouse event listeners
    window.addEventListener('mousemove', this.boundMouseMoved);
    window.addEventListener('mousedown', this.boundMousePressed);
  }

  draw() {
    background('#006400');
    textSize(40);
    fill('#FFFFFF');
    text('PONG ML', width / 2, 20);

    textSize(20);
    fill('#FFA500');
    text(`select ${this.stateMachine.sharedData.Player1.name} clothing`.toUpperCase(), width / 2, 100);

    rectMode(CENTER);
    for (let choice of this.choices) {
      let yOffset = choice.hover ? -10 : 0;

      fill(choice.colors.top);
      rect(choice.x, choice.y + yOffset - 25, 80, 50);

      fill(choice.colors.bottom);
      rect(choice.x, choice.y + yOffset + 25, 80, 50);
    }

    // If a color is selected, display it
    if (this.selectedColors) {
      fill(255);
      textSize(24);
      text(`Selected Top: ${this.selectedColors.top}`, width / 2, height - 100);
      text(`Selected Bottom: ${this.selectedColors.bottom}`, width / 2, height - 70);
    }
  }

  mouseMoved(event) {
    const { clientX: x, clientY: y } = event;
    for (let choice of this.choices) {
      let d = dist(x, y, choice.x, choice.y);
      choice.hover = d < 50;
    }
  }

  mousePressed(event) {
    const { clientX: x, clientY: y } = event;
    for (let i = 0; i < this.choices.length; i++) {
      let choice = this.choices[i];
      let d = dist(x, y, choice.x, choice.y);
      if (d < 50) {
        // Set the selected color and display the "Next" button
        this.selectedColors = choice.colors;
        this.stateMachine.sharedData.selectedColors = choice.colors;
        this.nextButton.show();  // Show the "Next" button when a color is selected
        return true;
      }
    }
    return false;
  }

  // Exit method to clean up when leaving the state
  exit() {
    console.log("Exiting Clothing Selection State");
    window.removeEventListener('mousemove', this.boundMouseMoved);
    window.removeEventListener('mousedown', this.boundMousePressed);
    if (this.nextButton) {
      this.nextButton.remove();  // Ensure the button is removed when exiting the state
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
    this.stateMachine.sharedData.Player1.selectedColors = this.stateMachine.sharedData.selectedColors
    
  }

  draw() {
    background(this.stateMachine.sharedData.field); 
    this.stateMachine.sharedData.Player1.draw();
    textSize(14);
    fill("#00513A")
    text("Game didacticiel", ((this.stateMachine.sharedData.WIDTH / 2)), 20);
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
    this.stateMachine.sharedData.ball.reset("player1"); 
    console.log("Entered Init State");
  }

  draw() {
    background(this.stateMachine.sharedData.field);
    this.stateMachine.sharedData.Player1.draw();
    this.stateMachine.sharedData.Player2.draw();
    this.stateMachine.sharedData.ball.draw();

    text("Press 'S' to Serve".toUpperCase(), ((this.stateMachine.sharedData.WIDTH / 2)), 20);

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
    background(this.stateMachine.sharedData.field);

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
        this.stateMachine.sharedData.winner = "player2"
      } else if (this.stateMachine.sharedData.ball.x > this.stateMachine.sharedData.WIDTH) {
        this.stateMachine.sharedData.player1_score++;
        this.stateMachine.sharedData.winner = "player1"
      }

      // Check for winning condition (first to 7 points)
      if (this.stateMachine.sharedData.player1_score >= 7) {
        
        // Player 1 wins
        this.stateMachine.sharedData.winner = this.stateMachine.sharedData.Player1.name
        this.stateMachine.changeState("setAndMatch");
      } else if (this.stateMachine.sharedData.player2_score >= 7) {

        // Player 2 wins
        this.stateMachine.sharedData.winner = this.stateMachine.sharedData.Player2.name
        this.stateMachine.changeState("setAndMatch");
      } else {
        // Otherwise, continue to serve state for the next point
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

  }

  draw() {
    background(this.stateMachine.sharedData.field); 
    text("Press SPACE to serve", (this.stateMachine.sharedData.WIDTH / 2 ), 80);

    textSize(60);
    text(this.stateMachine.sharedData.player1_score, this.stateMachine.sharedData.WIDTH / 3, 150);
    text(this.stateMachine.sharedData.player2_score, this.stateMachine.sharedData.WIDTH - (this.stateMachine.sharedData.WIDTH / 3), 150);

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
  }

  setup() {
    console.log("Entered Set and Match State");
  }

  draw() {
    textSize(20);
    text(this.stateMachine.sharedData.winner + " is the Winner!", (this.stateMachine.sharedData.WIDTH / 2 ), 50);

    textSize(48);
    text(this.stateMachine.sharedData.player1_score, this.stateMachine.sharedData.WIDTH / 2, 100);
    text(this.stateMachine.sharedData.player2_score, this.stateMachine.sharedData.WIDTH - (this.stateMachine.sharedData.WIDTH / 3), 100);

    textSize(32);
    text("press SPACE to restart", this.stateMachine.sharedData.WIDTH / 2, this.stateMachine.sharedData.HEIGHT - 100);

    if (keyIsPressed && key === " ") {
      this.stateMachine.changeState("init");
    }
  }
}



