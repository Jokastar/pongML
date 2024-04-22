let classifier; 
let video;
let label = "label";
let featureExtractor; 
let classifer; 
let knn; 
let ready; 

function preload(){
    featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
    ; 
}

function setup(){
    createCanvas(800, 400); 

    // Set video size to match canvas dimensions
    video = createCapture(VIDEO);
    video.size(width, height); // Set video size to canvas dimensions
    video.hide(); 
    label = "need training data" 
    knn = ml5.KNNClassifier()

}
function mousePressed(){
    const logits = featureExtractor.infer(video)

    knn.classify(logits, (error, results)=>{
        if(error){
            console.log(error)
        }else{
            label = results.label
            console.log(results)
        }
    })
}

function keyPressed(){
    const logits = featureExtractor.infer(video); 

    if(key == "u"){
        knn.addExample(logits, "up")
        console.log("up")
        label="up"
    }else if(key == "d"){
        knn.addExample(logits, "down")
        console.log("down")
        label="down"
    }else if(key == "n"){
        knn.addExample(logits, "neutral")
        console.log("neutral")
        label="neutral"
    }
}


function draw(){
    background(0); // Clear background

    // Display video feed
    image(video, 0, 0, width, height);

    // Display label
    fill(0, 255, 0);
    textSize(24); // Set text size
    textAlign(LEFT, BOTTOM); // Set text alignment to bottom-left
    text(label, 10, height - 10); // Position label at bottom left corner

    if(!ready && knn.getNumLabels() > 0){
        goClassify()
        ready = true; 
    }
}

function videoReady(){
    console.log("video is ready")

}

function modelReady(){
    console.log("the model is ready"); 
}

function goClassify(){
    const logits = featureExtractor.infer(video)

    knn.classify(logits, (error, results)=>{
        if(error){
            console.log(error)
        }else{ 
            label = results.label
            goClassify()
        }
    })

}