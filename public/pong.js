
WIDTH = 800; 
HEIGHT = 400;
let Player1;
let Player2; 
let ball; 
 

function setup(){
    createCanvas(WIDTH, HEIGHT)
    textSize(32);
    Player1 = new Paddle(0, 100);
    Player2 = new Paddle(WIDTH - 10, 100);
    ball = new Ball(WIDTH / 2, HEIGHT / 2, HEIGHT); 

}
function draw(){
    background(0);
    
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
    ball.edges()
    /*
    if(ball.collides(Player1)){
        ball.x = Player1.x + Player1.width
        ball.dx *= -1.02; 
        
    }; 

    if(ball.collides(Player2)){
        ball.x = Player2.x - ball.width
        ball.dx *= -1.02
        
    };  */


    ball.collides(Player1);
    ball.collides(Player2); 
    ball.update(); 
    ball.draw();
    Player2.draw(); 
    Player1.draw(); 

}