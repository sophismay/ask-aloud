var selfEasyrtcid = "";

var requests = {}

// easyrtc setup, server connection and room join
function connect(roomName) {
    console.log("Initializing.");
    easyrtc.enableVideo(false);
	easyrtc.enableAudio(false);
    easyrtc.enableVideoReceive(false);
	easyrtc.setUsername("Lecturer");
	easyrtc.joinRoom(roomName, null, joinSuccess, joinFailure);
	easyrtc.connect("easyrtc.AskAloud", loginSuccess, loginFailure);

}

function hangup() {
    easyrtc.hangupAll();
}
// set global easyrtcid
// bridge is a wrapper using c#
function loginSuccess(easyrtcid) {
    selfEasyrtcid = easyrtcid;
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
// element to accept incoming stream
easyrtc.setStreamAcceptor( function(easyrtcid, stream) {
    var audio = document.getElementById('callerAudio');
    easyrtc.setVideoObjectSrc(audio,stream);
});

// check if call was accepted and establish audio stream
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

// listeners for sketch coordinates and also when sketch is cleared
easyrtc.setPeerListener( function(easyrtcid, msgType, msgData, targeting) {
	bridge.draw("point", msgData.color, msgData.x, msgData.y);
    }, 'move');
easyrtc.setPeerListener( function(easyrtcid, msgType, msgData, targeting) {
	bridge.draw("down", msgData.color, msgData.x, msgData.y);
    }, 'down');
easyrtc.setPeerListener( function(easyrtcid, msgType, msgData, targeting) {
	bridge.clear();
    }, 'clear');