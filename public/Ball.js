class Ball{
    constructor(x, y, screen_height){
        this.x = x; 
        this.y = y;
        this.width = 10;
        this.height = 10; 
        this.dx = -((Math.random() * 2) + 3); // output number between 4 and 6 ; 
        this.dy =  -((Math.random() * 2) + 4)
        this.screen_height = screen_height  

    }

    edges(){

        if(this.y < 0){
            this.y = 0; 
            this.dy *= -1
        } else if (this.y + this.height > this.screen_height){
            this.y = this.screen_height - this.height; 
            this.dy *= -1; 
        }
    }

    collides(paddle){

        //check if the ball does not collides with both paddles
        if(paddle.y > this.y + this.height || this.y > paddle.y + paddle.height){
            return  ; 
        }

        if(this.x > paddle.x + paddle.width || paddle.x > this.x + this.width){
            return  ; 
        }

        // Handle collision with Player1
        if (paddle.x < 1) {
            this.x = paddle.x + paddle.width;
            this.dx *= -1.02;

          }
    
          // Handle collision with Player2
          if (paddle.x > 1) {
            this.x = paddle.x - this.width;
            this.dx *= -1.02;

          }

          //randomize the deltaY trajectory after collision
          if(this.dy < 0){
            this.dy = -1 * this.getRandomVelocity() ; 
        }else{
            this.dy = this.getRandomVelocity()
        }
    }
    getRandomVelocity(){
        return (Math.random() * 6) + 2
    }

    reset(winner){}

    update(){
        this.x += this.dx; 
        this.y += this.dy; 
        
    }

    draw(){
        rect(this.x, this.y, this.width, this.height); 
    }

}