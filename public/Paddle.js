class Paddle {
    constructor(x, y, paddle_height, selectedColors) {
      this.x = x;
      this.y = y;
      this.width = 40;
      this.height = paddle_height;
      this.speed = 8;
      this.selectedColors = selectedColors;
      this.name = "CPU"
       // Array of two colors
    }
  
    move_up() {
      this.y = max(this.y - this.speed, 0);
    }
  
    move_down(height) {
      this.y = min(this.y + this.speed, height - this.height);
    }
  
    draw() {
      // Width of each section of the paddle (half of the combined width)
      const sectionWidth = this.width / 2;
  
      // Draw the first rectangle with the first selected color
      fill(this.selectedColors.bottom);
      rect(this.x, this.y, sectionWidth, this.height);
      // Draw the second rectangle with the second selected color, next to the first one
      fill(this.selectedColors.top);
      rect(this.x + sectionWidth, this.y, sectionWidth, this.height);
    }
  
    updateSize(x, y, height) {
      this.x = x;
      this.y = y;
      this.height = height;
    }
  }
  
    

