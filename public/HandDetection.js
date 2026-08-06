
class HandDetection {
    constructor() {
        this.handPose = null;
        this._hands = "neutral";  // Use _hands to differentiate from getter method
        this.confidence = 0;      // always a number, 0 when no hand is detected
    }

    preload() {
        this.handPose = ml5.handPose();
    }

    setup(video) {

        const gotHands = (results) => {
            if (results.length > 0) {
                const confidence = Number(results[0].confidence.toFixed(2));
                let hands = results[0].handedness;

                // Swap handedness to account for the mirrored webcam feed
                if (hands.toLowerCase() === "left") {
                    hands = "right";
                } else if (hands.toLowerCase() === "right") {
                    hands = "left";
                }

                this._hands = confidence > 0.7 ? hands : "neutral";
                this.confidence = confidence;
            } else {
                this._hands = "neutral";
                this.confidence = 0;
            }
        }

        this.handPose.detectStart(video, gotHands);
    }

    get hands() {
        return this._hands;
    }
}
