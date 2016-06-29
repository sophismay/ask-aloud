'use strict';

export default function(easyrtc){
	// easyRTC
	easyrtc.setOption("logLevel", "debug");

	easyrtc.setOption("appAutoCreateEnable", false)
	// enable creating room when NOT in existence (ff request from client)
	easyrtc.setOption("roomAutoCreateEnable", true)
	//easyrtc.setOption("appDefaultName", "easyrtc.AskAloud")

	// Overriding the default easyrtcAuth listener, only so we can directly access its callback
	easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
	    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
	        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
	            callback(err, connectionObj);
	            return;
	        }

	        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

	        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

	        callback(err, connectionObj);
	    });
	});
	
	// When a room is created
	// for some reasons, only fired the first time the server is run(first app creation)
	// moving to rtc
	easyrtc.events.on("roomCreate", (appObj, creatorConnectionObj, roomName, roomOptions, callback) => {
		// TODO: check if room exists, also considering default
		console.log("inside room create")
		//console.log("app object: ", appObj)
		console.log("room name ", roomName)
		console.log("room options ", roomOptions)
		easyrtc.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback)
	});

	// To test, lets print the credential to the console for every room join!
	easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
	    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
	    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
	});
}