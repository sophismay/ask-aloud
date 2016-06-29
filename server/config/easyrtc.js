'use strict';

import easyrtc from 'easyrtc'

export default function(){
	// easyRTC
	easyrtc.setOption("logLevel", "debug");
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
	// To test, lets print the credential to the console for every room join!
	easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
	    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
	    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
	});
}