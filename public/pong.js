
let WIDTH;
let HEIGHT; 

let Player1;
let Player2;
let ball; 
let player1_score;
let player2_score; 
let state;   
let winner;
 

function setup(){
    WIDTH = 800; 
    HEIGHT = 400;
    createCanvas(WIDTH, HEIGHT)
    textSize(24);
    Player1 = new Paddle(0, 100);
    Player2 = new Paddle(WIDTH - 10, 100);
    player1_score = 0; 
    player2_score = 0;
    ball = new Ball((WIDTH/2), (HEIGHT/2), HEIGHT, WIDTH); 
    state = "init"

}
function draw(){
    background(0); 
 
    switch(state){
        case "init":
            player1_score = 0;
            player2_score = 0;
            winner = ""; 
            textSize(20);
            text("Press SPACE to play", ((WIDTH / 3) + 50), 50);

            textSize(60);
            text(player1_score, WIDTH / 3, 150);
            text(player2_score, WIDTH - (WIDTH / 3), 150);

            Player2.draw(); 
            Player1.draw();
            ball.draw();

            if(keyIsPressed && key === "s"){
                console.log("keyPressed");
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

            if (keyIsPressed) {
                if (key === 'a') {
                    Player1.move_up();
                } else if (key === 'q') {
                    Player1.move_down(HEIGHT);
                } else if (key === 'o') {
                    Player2.move_up();
                } else if (key === 'l') {
                    Player2.move_down(HEIGHT);
                }
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
            text("press SPACE to restart", WIDTH/3, HEIGHT - 100);
            ball.reset("")
            
            if(keyIsPressed && key === " "){
                state = "init";
            }
            break; 
    } 
}
