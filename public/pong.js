let WIDTH;
let HEIGHT; 
let Player1;
let Player2;
let ball; 
let player1_score;
let player2_score; 
let state;   
let winner;
let handDetection;
let video;  

function preload(){
    handDetection = new HandDetection();
    handDetection.preload(); 
}

function setup(){
    WIDTH = windowWidth; 
    HEIGHT = windowHeight;

    createCanvas(WIDTH, HEIGHT);

    // Video element for detecting hand movement
    video = createCapture(VIDEO);
    video.size(WIDTH, HEIGHT);
    video.hide();
    handDetection.setup(video); 

    // Initialize game variables
    Player1 = new Paddle(0, HEIGHT - 100, 100);
    Player2 = new Paddle(WIDTH - 10, 0, HEIGHT);
    player1_score = 0; 
    player2_score = 0;
    ball = new Ball((WIDTH / 2), (HEIGHT / 2), HEIGHT, WIDTH); 
    state = "didacticiel";
}

function draw(){
    background(0); 
    fill(0, 255, 0);
    textSize(16); // Set text size
    textAlign(LEFT, BOTTOM); // Set text alignment to bottom-left
    fill(255);
    
    switch(state){
        case "didacticiel":
            Player1.draw();

            textSize(14);
            text("Game didacticiel", ((WIDTH / 3)), 20);
            text("Raise your left hand to push down the paddle", ((WIDTH / 3)), 40);
            text("Raise your right hand to push up the paddle", ((WIDTH / 3)), 60);
            text("Remove your both hands to stay neutral", ((WIDTH / 3)), 80);
            text("hands: " + handDetection.hands, ((WIDTH / 3)), HEIGHT - 150);
            text("Press 'S' when ready to Start", ((WIDTH / 3)), HEIGHT - 100);

            if (handDetection.hands.toLowerCase() === "right") {
                Player1.move_up();
            } else if (handDetection.hands.toLowerCase() === "left") {
                Player1.move_down(HEIGHT);
            }

            if(keyIsPressed && key === "s"){
                state = "init"; 
            }
            break; 

        case "init":
            player1_score = 0;
            player2_score = 0;
            winner = ""; 
            textSize(20);
            text("Press 'S' to start", ((WIDTH / 3) + 50), 50);

            textSize(60);
            text(player1_score, WIDTH / 3, 150);
            text(player2_score, WIDTH - (WIDTH / 3), 150);

            Player2.draw(); 
            Player1.draw();
            ball.draw();

            if(keyIsPressed && key === "s"){
                state = "play"; 
            }
            break;

        case "play":
            ball.edges();
            ball.collides(Player1);
            ball.collides(Player2); 
            ball.update(); 
            ball.draw();
            Player2.draw(); 
            Player1.draw();

            if (handDetection.hands.toLowerCase() === "right") {
                Player1.move_up();
            } else if (handDetection.hands.toLowerCase() === "left") {
                Player1.move_down(HEIGHT);
            }
         
            if(ball.point_scored()){
                if(ball.x < 0){
                    winner = "player2";
                    player2_score++;
                }
                if(ball.x > WIDTH){
                    winner = "player1";
                    player1_score++; 
                }
                state = "serve"; 
            }
            break;

        case "serve":
            if(player1_score >= 7 || player2_score >= 7){
                state = "set&match";
                break; 
            }

            textSize(20);
            text("Press SPACE to serve", ((WIDTH / 3) + 50), 50);

            textSize(60);
            text(player1_score, WIDTH / 3, 150);
            text(player2_score, WIDTH - (WIDTH / 3), 150);

            Player2.draw(); 
            Player1.draw();
            ball.reset(winner); 
            ball.draw();

            if(keyIsPressed && key === " "){
                state = "play";
            }
            break; 

        case "set&match":
            textSize(20);
            text(winner + " is the Winner!", ((WIDTH / 3) + 50), 50);
    
            textSize(48);
            text(player1_score, WIDTH / 3, 100);
            text(player2_score, WIDTH - (WIDTH / 3), 100);

            textSize(32);
            text("press SPACE to restart", WIDTH / 3, HEIGHT - 100);
            ball.reset("");
            
            if(keyIsPressed && key === " "){
                state = "init";
            }
            break; 
    }
}

function windowResized() {
    WIDTH = windowWidth;
    HEIGHT = windowHeight;
    resizeCanvas(WIDTH, HEIGHT);

    // Update paddle and ball positions/sizes if needed
    Player1.updateSize(0, HEIGHT - 100, 100);
    Player2.updateSize(WIDTH - 10, 0, HEIGHT);
    ball.updateSize(WIDTH, HEIGHT);
}


