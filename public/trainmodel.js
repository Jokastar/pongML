let video;
let HEIGHT = 400;
let WIDTH = 800;
let handPose;
let hands = "neutral"; 
let confidence = "none"; 

function preload() {
    handPose = ml5.handPose();
}

function setup() {
    createCanvas(WIDTH, HEIGHT);

    // Set video size to match canvas dimensions
    video = createCapture(VIDEO);
    video.size(WIDTH, HEIGHT); // Set video size to canvas dimensions
    video.hide();

    function gotHands(results) {
       
        confidence = results[0]?.confidence.toFixed(2) || 0;
        
        hands = confidence > 0.9 ? results[0]?.handedness : "neutral"
    }

    handPose.detectStart(video, gotHands);
}

function draw() {
   

    background(0); // Clear background
    // Display video feed
    image(video, 0, 0, WIDTH, HEIGHT);

    // Display hands and confidence in green color at the bottom left of the image
    fill(0, 255, 0); // Green color
    textSize(16); // Set text size
    textAlign(LEFT, BOTTOM); // Align text to bottom left
    text(`Hands: ${hands}`, 10, HEIGHT - 30); // Display hands information
    text(`Confidence: ${confidence}`, 10, HEIGHT - 10); // Display confidence information
}






