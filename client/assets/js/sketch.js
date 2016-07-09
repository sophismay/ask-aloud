var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;
    currentColor = "black";

var x = "black",
    y = 2;

function initSketch() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = window.innerWidth; //canvas.width;
    h = window.innerHeight; //canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
        //console.log("mouse move; ", e);
        // only send if there is a mouse click while moving
        if(e.buttons === 1){
            sendPoint(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop + $(document).scrollTop(), "move");
        }
        
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e);
        sendPoint(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop + $(document).scrollTop(), "down");
        console.log("mouse down; ", e);
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e);
        console.log("mouse up; ", e);
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e);
        console.log("mouse out; ", e);
    }, false);

    canvas.addEventListener("touchstart", function(e){
        findTouchxy('down', e);
        sendPoint(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop + $(document).scrollTop(), "down");
        console.log("TOUCH DOWN; ", e);
    });
    canvas.addEventListener("touchmove", function(e){
        //e.preventDefault();
        findTouchxy('move', e);
        // only send if there is a mouse click while moving
        if(e.buttons === 1){
            sendPoint(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop + $(document).scrollTop(), "move");
        }
        console.log("TOUCH MOVE: ", e);
    });
    canvas.addEventListener("touchend", function(e){
        findTouchxy('up', e);
        console.log("TOUCH END; ", e);
    });
}

function color(obj) {
    switch (obj.id) {
        case "green":
            x = "green";
            currentColor = "green";
            break;
        case "blue":
            x = "blue";
            currentColor = "blue";
            break;
        case "red":
            x = "red";
            currentColor = "red";
            break;
        case "yellow":
            x = "yellow";
            currentColor = "yellow";
            break;
        case "orange":
            x = "orange";
            currentColor = "orange";
            break;
        case "black":
            x = "black";
            currentColor = "black";
            break;
        case "white":
            x = "white";
            currentColor = "white";
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
        sendClearMessage();
    }
}

function findTouchxy(res, e){
    if(res == "down"){
        prevX = currX;
        prevY = currY;
        if(e.type.contains("touch")){
            console.log("SEE THIS IN MOBILE BROWSER, targetTouches: ", e.targetTouches[0]);
            currX = e.targetTouches[0].pageX - canvas.offsetLeft;
            currY = e.targetTouches[0].pageY - canvas.offsetTop + $(document).scrollTop();
        } else {
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop + $(document).scrollTop();
        }

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
            if(e.type.contains("touch")){
                console.log("SEE THIS IN MOBILE BROWSER, targetTouches: ", e.targetTouches[0]);
                currX = e.targetTouches[0].pageX - canvas.offsetLeft;
                currY = e.targetTouches[0].pageY - canvas.offsetTop + $(document).scrollTop();
            } else {
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop + $(document).scrollTop();
            }
            draw();
        }
    }
}

function findxy(res, e) {
    var rect = ctx.canvas.getBoundingClientRect();
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop + $(document).scrollTop();
        console.log("SCROLL TOP : ", $(document).scrollTop());

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
            currY = e.clientY - canvas.offsetTop + $(document).scrollTop();
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

function sendPoint(x, y, type){
    console.log("INSIDE SENDING POINT: ", x, y);

    // send peer message depending on touch/mouse event
    var lecturerIds = easyrtc.usernameToIds("Lecturer");
    console.log("LECTURER ID DEBUG: ", lecturerIds);
    easyrtc.sendPeerMessage("destination", type, 
        {x: x, y: y, color: currentColor}, sendPointSuccess, sendPointFailure);
}

function sendClearMessage(){
        easyrtc.sendPeerMessage("destination", "clear", null, null, null);
    }