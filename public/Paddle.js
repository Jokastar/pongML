class Paddle{
    constructor(x, y){
        this.x = x; 
        this.y = y;
        this.width = 10;
        this.height = 50;   
        this.speed = 5
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


}