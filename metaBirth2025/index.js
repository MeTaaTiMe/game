var canvas=document.getElementById("mainWindow");
var ctx=canvas.getContext("2d");
var logo=new Image();
var title=new Image();
var background=new Image();
var _interval_id;
logo.onload=function(){
    _interval_id=setInterval(start,200);
}
logo.src="assets/img/metatime.png";
title.src="assets/img/title.png";
background.src="assets/img/gameBack.png"
var audio
async function loadBgm(){
const audioContext = new AudioContext();
const response = await fetch("./assets/audio/bgm.mp3");
const arrayBuffer = await response.arrayBuffer();
const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
audio = audioContext.createBufferSource();
audio.buffer = audioBuffer;
audio.loop = true;
audio.connect(audioContext.destination);
}
loadBgm()

var _alpha_start=0;
function start(){
    _alpha_start+=20;
    if(_alpha_start>255){
        clearInterval(_interval_id);
        _interval_id = setInterval(titleDraw,100);
        canvas.addEventListener("click",()=>{audio.start();startGame();});
        
        return;
    }
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(0,0,700,700);
    ctx.drawImage(logo,350-logo.naturalWidth/2,350-logo.naturalHeight/2);
    var alpha=(255-_alpha_start).toString(16);
    if(alpha.length==1)alpha="0"+alpha;
    ctx.fillStyle+=alpha;
    ctx.fillRect(0,0,700,700);
}
var _text_alpha = 10
var _alpha_sign = 1
var _rect_timer = 0

function titleDraw(){
    _text_alpha += 10 * _alpha_sign
    _rect_timer += 1
    if (_text_alpha > 255) {
        _text_alpha = 255
        _alpha_sign = -1
    }
    if (_text_alpha < 0) {
        _text_alpha = 0
        _alpha_sign = 1
    }
    if (_rect_timer > 100) {
        _rect_timer = 0
    }

    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,700,700);
    ctx.fillStyle = "#a9f6ff99"
    for (let index = 0; index < 25; index++) {
        ctx.fillRect(10*((_rect_timer+250-index*10)%100)-10, 10+30*index, 10*((_rect_timer+250-index*10)%100), 20)
    }
    ctx.drawImage(title,0,_text_alpha/20);
    ctx.font = "48px serif"
    ctx.textAlign = "center"
    ctx.strokeStyle = "#fa924a"+_text_alpha.toString(16);
    ctx.strokeText("click to start",350,600)
    ctx.font = "30px serif"
    ctx.strokeText("※音が鳴るよ",350,650)
}
var gameTable = []
var tableSize = [7,10]
function startGame(){
    canvas.removeEventListener("click",startGame);
    clearInterval(_interval_id);
    for(let i=0;i<tableSize[0];i++){
        gameTable.push([])
        for(let j=0;j<tableSize[1];j++){
            gameTable[i].push(true)
        }
    }
    _interval_id = setInterval(gameLoop,50);
}
var barPos = 250
var barWidth = 200
var ballPos = [250,650]
var ballVec = [1+-2*Math.floor(Math.random() * 2),-1-Math.random() * 1]
var speed = 5
var boxSize = 60

function dist2pow(x1,y1,x2,y2){
    return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)
}

function gameLoop(){
    
    ctx.drawImage(background,0,0);
    for(let i=0;i<tableSize[0];i++){
        for(let j=0;j<tableSize[1];j++){
            if (gameTable[i][j]){
                ctx.fillStyle="#aaa";
                ctx.fillRect(50+(boxSize+1)*j,50+(boxSize+1)*i,boxSize,boxSize); 
            }
        }
    }
    ballPos[0]+=ballVec[0]*speed
    ballPos[1]+=ballVec[1]*speed
    if(ballPos[0]<5) {
        ballPos[0]=5
        ballVec[0]*=-1*(Math.random()/10+0.95)
    }
    if(ballPos[0]>700-5) {
        ballPos[0]=700-5
        ballVec[0]*=-1*(Math.random()/10+0.95)
    }
    if(ballPos[1]<5) {
        ballPos[1]=5
        ballVec[1]*=-1*(Math.random()/10+0.95)
    }
    if(ballPos[1]>700-35 && ballPos[1]<700-15 && barPos-barWidth/2<=ballPos[0] && barPos+barWidth/2>=ballPos[0]) {
        ballPos[1]=700-35
        ballVec[1]*=-1*(Math.random()/10+0.95)
    }
    if(ballPos[1]>800) {
        ballPos = [Math.random()*500+100,650]
        ballVec = [1+-2*Math.floor(Math.random() * 2),-1-Math.random() * 1]
    }
    for(let i=0;i<tableSize[0];i++){
        for(let j=0;j<tableSize[1];j++){
            if (!gameTable[i][j]){continue}
            if (!(50+(boxSize+1)*j<=ballPos[0] && 50+(boxSize+1)*j+boxSize>=ballPos[0] && 50+(boxSize+1)*i<=ballPos[1] && 50+(boxSize+1)*i+boxSize >=ballPos[1])) {continue}
            gameTable[i][j]=false
            var dists = [
                dist2pow(ballPos[0],ballPos[1],50+(boxSize+1)*j+boxSize/2,50+(boxSize+1)*i),
                dist2pow(ballPos[0],ballPos[1],50+(boxSize+1)*j+boxSize,50+(boxSize+1)*i+boxSize/2),
                dist2pow(ballPos[0],ballPos[1],50+(boxSize+1)*j+boxSize/2,50+(boxSize+1)*i+boxSize),
                dist2pow(ballPos[0],ballPos[1],50+(boxSize+1)*j,50+(boxSize+1)*i+boxSize/2)
            ]
            var minInd = 0
            for (let x=1;x<4;x++) {
                if (dists[minInd]>dists[x]) minInd = x
            }
            if (minInd==0) ballVec[1]*=-1*(Math.random()/10+0.95)
            if (minInd==1) ballVec[0]*=-1*(Math.random()/10+0.95)
            if (minInd==2) ballVec[1]*=-1*(Math.random()/10+0.95)
            if (minInd==3) ballVec[0]*=-1*(Math.random()/10+0.95)
        }
    }
    ctx.fillStyle="#fa924a"
    ctx.beginPath(); // パスの初期化
    ctx.arc(ballPos[0], ballPos[1], 10, 0, 2 * Math.PI);
    ctx.closePath(); // パスを閉じる
    ctx.fill(); // 軌跡の範囲を塗りつぶす
    if (leftMove) barPos -= 10
    if (barPos<barWidth/2) barPos=barWidth/2
    if (rightMove) barPos += 10
    if (barPos+barWidth/2>700) barPos = 700-barWidth/2
    ctx.fillStyle="#a9f6ff"
    ctx.fillRect(barPos-barWidth/2,670,barWidth,20)
}
var leftButton = document.getElementById("leftButton")
var rightButton = document.getElementById("rightButton")
var leftMove = false;
var rightMove = false;
leftButton.addEventListener("pointerdown",evt => {leftMove = true;})
leftButton.addEventListener("pointerup",evt => {leftMove = false;})
rightButton.addEventListener("pointerdown",evt => {rightMove = true;})
rightButton.addEventListener("pointerup",evt => {rightMove = false;})