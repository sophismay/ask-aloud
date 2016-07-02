
var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var x = "black",
    y = 2;

function initSketch() {
    console.log("INIT SKETCH CALLED");
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
        //console.log("mouse move; ", e);
        // only send if there is a mouse click while moving
        if(e.buttons === 1){
        	sendPoint(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        }
        
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
        console.log("mouse down; ", e);
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
        console.log("mouse up; ", e);
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
        console.log("mouse out; ", e);
    }, false);
}

function color(obj) {
    switch (obj.id) {
        case "green":
            x = "green";
            break;
        case "blue":
            x = "blue";
            break;
        case "red":
            x = "red";
            break;
        case "yellow":
            x = "yellow";
            break;
        case "orange":
            x = "orange";
            break;
        case "black":
            x = "black";
            break;
        case "white":
            x = "white";
            break;
    }
    if (x == "white") y = 14;
    else y = 2;

}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function erase() {
    var m = confirm("Want to clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
}

function save() {
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}

function sendPointSuccess(msgType, msgData){
	console.log("point sent ", msgData);
}

function sendPointFailure(errorCode, errorText){
	console.log("error sending point ", errorText);
}

function sendPoint(x, y){
	console.log("INSIDE SENDING POINT: ", x, y);
	easyrtc.sendPeerMessage("destination", "point", 
		{x: x, y: y}, sendPointSuccess, sendPointFailure);
}