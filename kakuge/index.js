var canvas=document.getElementById("mainWindow");
var ctx=canvas.getContext("2d");
var logo=new Image();
var title=new Image();
var _start_id;
logo.onload=function(){
    _start_id=setInterval(start,200);
}
logo.src="img/metatime.png";
title.src="img/title.png";
var _alpha_start=0;
function start(imgAlpha){
    _alpha_start+=10;
    if(_alpha_start>255){
        clearInterval(_start_id);
        ctx.drawImage(title,0,0);
        canvas.addEventListener("click",startGame);
        return;
    }
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(0,0,1300,700);
    ctx.drawImage(logo,650-logo.naturalWidth/2,350-logo.naturalHeight/2);
    var alpha=(255-_alpha_start).toString(16);
    if(alpha.length==1)alpha="0"+alpha;
    ctx.fillStyle+=alpha;
    ctx.fillRect(0,0,1300,700);
}
function startGame(){
    canvas.removeEventListener("click",startGame);
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(0,0,1300,700);
}