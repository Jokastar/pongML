WIDTH = 600; 
HEIGHT = 400;
let Player1; 
let pressedKey; 

 

function setup(){
    createCanvas(WIDTH, HEIGHT)
    textSize(32);
  
    Player1 = new Paddle(0, 100);

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

    Player1.draw()

}