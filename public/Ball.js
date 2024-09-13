class Ball{
    constructor(x, y, screen_height, screen_width){
        this.x = x; 
        this.y = y;
        this.init_x = x; 
        this.init_y = y; 
        this.width = 10;
        this.height = 10; 
        this.dx = ((Math.random() * 4) + 2); // output number between 4 and 6 ; 
        this.dy =  ((Math.random() * 4) + 2)
        this.screen_height = screen_height; 
        this.screen_width = screen_width;   

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
        return (Math.random() * 4) + 2
    }

    point_scored(){
         if (this.x <= 0 || this.x >= this.screen_width) return true; 
         return false; 
    }

    reset(winner){

        this.x = this.init_x; 
        this.y = this.init_y; 
        this.dy = this.getRandomVelocity(); 
        this.dx = winner === "player1" ? -1 * this.getRandomVelocity() : this.getRandomVelocity();
        console.log(this.x, this.y, this.dx)
    }

    update(){
        this.x += this.dx; 
        this.y += this.dy; 
        
    }

    draw(){
        rect(this.x, this.y, this.width, this.height); 
    }

    updateSize(canvasWidth, canvasHeight) {
        this.screen_width = canvasWidth;
        this.screen_height = canvasHeight
        
    }

}