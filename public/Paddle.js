class Paddle{
    constructor(x, y, paddle_height){
        this.x = x; 
        this.y = y;
        this.width = 10;
        this.height = paddle_height;   
        this.speed = 8
    }

    move_up(){
        this.y =  max(this.y - this.speed, 0) ; 

    }

    move_down(height){
        this.y =  min(this.y + this.speed, height - this.height) ;
         
    }

    draw(){
        fill(255); 
        rect(this.x, this.y, this.width, this.height); 
    }

    updateSize(x, y, height) {
        this.x = x;
        this.y = y;
        this.height = height;
    }

    
}

    

