WIDTH = 600; 
HEIGHT = 400;
let Player1; 
let ball; 
 

function setup(){
    createCanvas(WIDTH, HEIGHT)
    textSize(32);
    Player1 = new Paddle(0, 100);
    ball = new Ball(WIDTH / 2, HEIGHT / 2); 

}
function draw(){
    background(0);
    
    if(keyIsPressed){
        if (keyCode === UP_ARROW) {
            Player1.move_up()
        } else if (keyCode === DOWN_ARROW) {
            Player1.move_down(HEIGHT); 
        }
    }

    ball.update(); 
    ball.draw();
    Player1.draw()

}