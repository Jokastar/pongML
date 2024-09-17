class Paddle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.init_y = y
      this.width = 20;
      this.height = 50;
      this.speed = 10;
      this.name = "CPU"
    }
  
    move_up() {
      this.y = max((this.y - this.speed) , 0);
    }
  
    move_down(height) {
      this.y = min((this.y + this.speed), (height - this.height));
    }
  
    draw() {
      // Draw the first rectangle with the first selected color
      rectMode(CORNER)
      rect(this.x, this.y, this.width, this.height);
    }
  
    updateSize(x, y, height) {
      this.x = x;
      this.y = y;
      this.height = height;
    }
    initYPosition() {
      // Determine the difference between the current and initial Y positions
      const deltaY = this.init_y - this.y;
  
      // If the player is already at the initial position, no need to move
      if (deltaY === 0) return;
  
      // Determine the direction and magnitude of movement
      const direction = deltaY > 0 ? 1 : -1;
      const stepSize = this.speed;  // Use a smaller step size
  
      // Move towards the initial position
      while (Math.abs(this.init_y - this.y) > stepSize) {
          this.y += stepSize * direction;
      }
  
      // Ensure the final position matches init_y exactly
      this.y = this.init_y;
  }
  }
  
    

