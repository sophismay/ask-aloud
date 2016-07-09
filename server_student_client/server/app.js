/**
 * Main application file
 */

'use strict';

import express from 'express';
import easyrtc from 'easyrtc'
import config from './config/environment';
import http from 'http';


// Setup server
var app = express();
var server = http.createServer(app).listen(config.port);
// for older version
var io = require('socket.io');
var socketio = io.listen(server, {
  "log level": 1
});

require('./config/express').default(app);
require('./routes').default(app);
require('./config/easyrtc').default(easyrtc);
var rtc = require('./rtc').default(easyrtc, app, socketio);

// Expose app
exports = module.exports = app;
