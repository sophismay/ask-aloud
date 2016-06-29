'use strict';

import easyrtc from 'easyrtc'

const askAloudApp = (err, appObj) => {
	// All newly created rooms get a field called roomColor.
    // Note this does not affect the room already-created rooms.
    if(err){
    	console.log("error in askAloudApp, rtc.js: ", err)
    	throw err
    }
    
    appObj.setOption("roomDefaultFieldObj",
         {"roomColor":{fieldValue:"orange", fieldOption:{isShared:true}}})

}

const rtc = (easyrtc, app, socketio) => {
	easyrtc.listen(app, socketio, null, function(err, rtcRef) {
    	console.log("Initiated");

    	// Creates a new application called askAloud with a default room named "SectorOne".
        rtcRef.createApp(
            "easyrtc.AskAloud",
            null, //{"roomDefaultName":"SectorOne"},
            askAloudApp
        );


    	rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        	console.log("roomCreate fired! Trying to create: " + roomName);
        	console.log("room name ", roomName)
			console.log("room options ", roomOptions)
        	appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    	});

    	rtcRef.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
	    	console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
	    	easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
		});
	});
}

export default rtc