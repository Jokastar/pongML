
class HandDetection {
    constructor(width, height) {
        this.WIDTH = width;
        this.HEIGHT = height;
        this.handPose = null; 
        this._hands = "neutral";  // Use _hands to differentiate from getter method
        this.confidence = 0;
    }

    preload() {
        this.handPose = ml5.handPose();
    }

    setup(video) {
        
        const gotHands = (results) => {
            if (results.length > 0) {
                let confidence = results[0]?.confidence.toFixed(2); 
                let hands = results[0].handedness;
            
                // Swap handedness
                if (hands.toLowerCase() === "left") {
                    hands = "right";
                } else if (hands.toLowerCase() === "right") {
                    hands = "left";
                }
            
                if (confidence > 0.9) {
                    this._hands = hands;
                } else {
                    this._hands = "neutral";
                }
            
                this.confidence = confidence;
            } else {
                this._hands = "neutral";
                this.confidence = "none";
            }
        }            

        this.handPose.detectStart(video, gotHands);
    }

    draw(video) {
        background(0);
        image(video, 0, 0, this.WIDTH, this.HEIGHT);

        fill(0, 255, 0);
        textSize(16);
        textAlign(LEFT, BOTTOM);
        text(`Hands: ${this._hands}`, 10, this.HEIGHT - 30);
        text(`Confidence: ${this.confidence}`, 10, this.HEIGHT - 10);
    }

    get hands() {
        return this._hands;
    }
}
