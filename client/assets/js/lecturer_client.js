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
	easyrtc.connect("easyrtc.audioOnly", loginSuccess, loginFailure);

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
	bridge.callRequest(easyrtcid);
} );

function acceptCall(easyrtcid) {
	var f = requests[easyrtcid];
	f();
}