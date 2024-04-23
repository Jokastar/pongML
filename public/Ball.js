class Ball{
    constructor(x, y){
        this.x = x; 
        this.y = y;
        this.width = 10;
        this.height = 10; 
        this.dx = (Math.random() * 2) + 4; // output number between 4 and 6 ; 
        this.dy =  (Math.random() * 1) + 4  

    }

    collides(){}

    reset(winner){}

    update(){
        this.x += this.dx; 
        this.y += this.dy; 
        
    }

    draw(){
        rect(this.x, this.y, this.width, this.height); 
    }

}