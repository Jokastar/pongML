
let video;
let label;
let featureExtractor; 
let knn; 
let ready;
let training_labels;  




function setup(){
    createCanvas(1200, 400); 
    // Set video size to match canvas dimensions
    video = createCapture(VIDEO);
    video.size(width, height); // Set video size to canvas dimensions
    video.hide(); 
    label = "start training the model"; 

    //training labels
    training_labels = {
        up:0,
        neutral:0,
        down:0
    }
        
    knn = ml5.KNNClassifier()
    featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
}

function keyPressed(){
    const logits = featureExtractor.infer(video); // get the image logits

    //add images to the knn classifier
    if(key == "u"){
        knn.addExample(logits, "up")
        training_labels["up"]+=1
        label="up"
    }else if(key == "d"){
        knn.addExample(logits, "down")
        training_labels["down"]+=1
        label="down"
    }else if(key == "n"){
        knn.addExample(logits, "neutral")
        training_labels["neutral"]+=1
        label="neutral"
    }else if (key =="s"){
        knn.save("model.json")
        text("model saved",300, 80,)
        //save(knn, "model.json"); 
    }
}


function draw(){
    background(0); // Clear background
    // Display video feed
    image(video, 0, 0, width, height);

    fill(0); 
    textSize(16)
    text("number of collected data by labels", 0, 20);
    let pos_y = 40;
    let pos_x = 300;   

    for(let key in training_labels){
        text(`${key} : ${training_labels[key]}`, 0, pos_y)
        pos_y+=20; 
    }

    text("press 'u' to add data for the 'UP' label", pos_x, 0)
    text("press 'n' to add data for the 'NEUTRAL' label", pos_x, 20)
    text("press 'd' to add data for the 'DOWN' label", pos_x, 40)
    text("press 's' to save your model", pos_x, 60)



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

function modelReady(){
    console.log("the MobileNet is ready"); 

}

function goClassify(){
    const logits = featureExtractor.infer(video)

    knn.classify(logits, (error, results)=>{
        if(error){
            console.log(error)
        }else{ 
            console.log(results); 

            label = results.label; 
            goClassify()
        }
    })

}