
let WIDTH;
let HEIGHT; 

let Player1;
let Player2;
let ball; 
let player1_score;
let player2_score; 
let state;   
let winner;

let knn; 
let featureExtractor; 
let label;
let video;  
 

function setup(){
    WIDTH = 800; 
    HEIGHT = 400;
    createCanvas(WIDTH, HEIGHT)

    video = createCapture(VIDEO);
    video.size(1200, 400); 
    video.hide(); 
    

    featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
    ; 

    Player1 = new Paddle(0, 100);
    Player2 = new Paddle(WIDTH - 10, 100);
    player1_score = 0; 
    player2_score = 0;
    ball = new Ball((WIDTH/2), (HEIGHT/2), HEIGHT, WIDTH); 
    state = "didacticiel"
    label = "machine learning loading ..."
 
}
function draw(){
    background(0); 

    fill(0, 255, 0);
    textSize(16); // Set text size
    textAlign(LEFT, BOTTOM); // Set text alignment to bottom-left
    text(label, 10, height - 10); // Position label at bottom left corner

    fill(255);
    switch(state){
        case "didacticiel":
            Player1.draw()

            textSize(14);
            text("Game didacticiel", ((WIDTH / 3)), 20);
            text("Rise your left hand to push down the paddle", ((WIDTH / 3)), 40);
            text("Rise your right hand to push up the paddle", ((WIDTH / 3)), 60)
            text("Remove your both hand to stay neutral", ((WIDTH / 3)), 80)
            text("Press 'r' when ready to play", ((WIDTH / 3)), HEIGHT - 100);

            if (label == "up"){
                Player1.move_up()
            }else if(label == "down"){
                Player1.move_down(HEIGHT); 
            }

            if(keyIsPressed && key === "r"){
                state = "init"; 
            }
            break; 

        case "init":
            player1_score = 0;
            player2_score = 0;
            winner = ""; 
            textSize(20);
            text("Press 'S' to play", ((WIDTH / 3) + 50), 50);

            textSize(60);
            text(player1_score, WIDTH / 3, 150);
            text(player2_score, WIDTH - (WIDTH / 3), 150);

            Player2.draw(); 
            Player1.draw();
            ball.draw();

            if(keyIsPressed && key === "s"){
                state = "play"; 
            }
            break;

        case "play":
            ball.edges();
            ball.collides(Player1);
            ball.collides(Player2); 
            ball.update(); 
            ball.draw();
            Player2.draw(); 
            Player1.draw();

            if (label == "up"){
                Player1.move_up()
            }else if(label == "down"){
                Player1.move_down(HEIGHT); 
            }

            if(keyIsPressed && key == "o"){
                Player2.move_up();
            }else if(keyIsPressed && key == "l"){
                Player2.move_down(HEIGHT);  
            }

         
            if(ball.point_scored()){
                if(ball.x < 0){
                    winner = "player2";
                    player2_score++;
                }
                if(ball.x > WIDTH){
                    winner = "player1";
                    player1_score++; 
                }
                state = "serve"; 
            }
            break;

        case "serve":
            if(player1_score >= 7 || player2_score >= 7){
                state = "set&match";
                break; 
            }

            textSize(20);
            text("Press SPACE to serve", ((WIDTH / 3) + 50), 50);

            textSize(60);
            text(player1_score, WIDTH / 3, 150);
            text(player2_score, WIDTH - (WIDTH / 3), 150);

            Player2.draw(); 
            Player1.draw();
            ball.reset(winner); 
            ball.draw();

            if(keyIsPressed && key === " "){
                state = "play";
            }
            break; 

        case "set&match":
            textSize(20);
            text(winner + " is the Winner!", ((WIDTH / 3) + 50), 50);
    
            textSize(48);
            text(player1_score, WIDTH / 3, 100);
            text(player2_score, WIDTH - (WIDTH / 3), 100);

            textSize(32);
            text("press SPACE to restart", WIDTH/3, HEIGHT - 100);
            ball.reset("")
            
            if(keyIsPressed && key === " "){
                state = "init";
            }
            break; 
    } 
}

function modelReady(){
    console.log("the MobileNet is ready"); 

    knn = ml5.KNNClassifier();

    knn.load("model.json", ()=>{
        console.log("knn is ready")
        goClassify()
    })
}

function goClassify(){
    const logits = featureExtractor.infer(video)

    knn.classify(logits, (error, results)=>{
        if(error){
            console.log(error)
        }else{ 
            label = knn.mapStringToIndex[results.label]
            goClassify()
        }
    })

}
