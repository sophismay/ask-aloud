/**
 * Main application file
 */

'use strict';

import express from 'express';
//import mongoose from 'mongoose';
import easyrtc from 'easyrtc'
//mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';

// Connect to MongoDB
//mongoose.connect(config.mongo.uri, config.mongo.options);
//mongoose.connection.on('error', function(err) {
//  console.error('MongoDB connection error: ' + err);
//  process.exit(-1);
//});

// Populate databases with sample data
//if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = http.createServer(app).listen(config.port);
//var socketio = require('socket.io')(server, {
//  serveClient: config.env !== 'production',
//  path: '/socket.io-client'
//});
// for older version
var io = require('socket.io');
var socketio = io.listen(server, {
  "log level": 1
});
//require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app);
require('./config/easyrtc').default();


// Start EasyRTC server
var rtc = easyrtc.listen(app, socketio, null, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});


// Start server
/*function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}*/

//setImmediate(startServer);

// Expose app
exports = module.exports = app;
