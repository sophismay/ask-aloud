/**
 * Main application file
 */

'use strict';

// import dependencies and configuration
import express from 'express';
import easyrtc from 'easyrtc'
import config from './config/environment';
import http from 'http';


// Setup server and socket
var app = express();
var server = http.createServer(app).listen(config.port);
var io = require('socket.io');
var socketio = io.listen(server, {
  "log level": 1
});

// include routes, express middleware and easyrtc server middleware 
require('./config/express').default(app);
require('./routes').default(app);
require('./config/easyrtc').default(easyrtc);
var rtc = require('./rtc').default(easyrtc, app, socketio);

// Expose app
exports = module.exports = app;
