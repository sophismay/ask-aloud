var selfEasyrtcid = "";

var requests = {}

function connect(roomName) {
    console.log("Initializing.");
    easyrtc.enableVideo(false);
	easyrtc.enableAudio(false);
    easyrtc.enableVideoReceive(false);
	easyrtc.setUsername("Lecturer");
	easyrtc.joinRoom(roomName, null, joinSuccess, joinFailure);
    //easyrtc.setRoomOccupantListener(convertListToButtons);
	easyrtc.connect("easyrtc.AskAloud", loginSuccess, loginFailure);

}

function hangup() {
    easyrtc.hangupAll();
}

function loginSuccess(easyrtcid) {
    //disable("connectButton");
    // enable("disconnectButton");
    //enable('otherClients');
    selfEasyrtcid = easyrtcid;
    //document.getElementById("iam").innerHTML = "I am " + easyrtcid;
	bridge.loginSuccess(easyrtcid);
}

function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}

function joinSuccess(roomName) {
	console.log(roomName);
}

function joinFailure(errorCode, errorText, roomName) {
	easyrtc.showError(errorCode, errorText);
}

easyrtc.setStreamAcceptor( function(easyrtcid, stream) {
    var audio = document.getElementById('callerAudio');
    easyrtc.setVideoObjectSrc(audio,stream);
});

easyrtc.setAcceptChecker(function(easyrtcid, callback) {
    var acceptTheCall = function(wasAccepted) {
        if( wasAccepted && easyrtc.getConnectionCount() > 0 ) {
            easyrtc.hangupAll();
        }
        callback(wasAccepted);
    };
	requests[easyrtcid] = function() {
        acceptTheCall(true);
    };
	bridge.callRequest(easyrtc.idToName(easyrtcid), easyrtcid);
} );

function acceptCall(easyrtcid) {
	var f = requests[easyrtcid];
	f();
}

easyrtc.setPeerListener( function(easyrtcid, msgType, msgData, targeting) {
	bridge.draw("point", msgData.color, msgData.x, msgData.y);
    }, 'move');
easyrtc.setPeerListener( function(easyrtcid, msgType, msgData, targeting) {
	bridge.draw("down", msgData.color, msgData.x, msgData.y);
    }, 'down');
easyrtc.setPeerListener( function(easyrtcid, msgType, msgData, targeting) {
	bridge.clear();
    }, 'clear');