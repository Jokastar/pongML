let classifier; 
let video;
let isLoading = false;
let msg; 
let label = "label";

function preload(){
    img = loadImage("/img/bird.jpg");
}

function setup(){
    createCanvas(800, 400); 

    // Set video size to match canvas dimensions
    video = createCapture(VIDEO);
    video.size(width, height); // Set video size to canvas dimensions
    video.hide(); 

    msg = createDiv(`result is loading...`);
    msg.hide(); 

    isLoading = true;
    classifier = ml5.imageClassifier("MobileNet", video, modelReady);  
}

function draw(){
    background(220); // Clear background

    if (isLoading) {
        // Show the message if isLoading is true
        msg.show();
    } else {
        // Hide the message if isLoading is false
        msg.hide();
    }

    // Display video feed
    image(video, 0, 0, width, height);

    // Display label
    fill(0);
    textSize(24); // Set text size
    textAlign(LEFT, BOTTOM); // Set text alignment to bottom-left
    text(label, 10, height - 10); // Position label at bottom left corner
}

function gotResult(error, results){
    if(error){
        console.error(error);
    } else {
        console.log(results);
        isLoading = false; 
        label = results[0].label; // Update label with new result
        classifier.classify(gotResult);
    }
}

function modelReady(){
    console.log("the model is ready"); 
    classifier.classify(gotResult);
}
