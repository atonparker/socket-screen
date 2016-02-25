'use strict';

var emitter = require('component-emitter');
var messageTypes = require('../server/message-types');

module.exports = SocketScreenClient;

function SocketScreenClient(options) {

  if (options.io) {

    var io = options.io;
    var uri = options.uri;

  } else {

    io = options;
    uri = window.location.origin;

  }

  if (io === undefined) throw new Error('You must provide a socket.io server.');

  var client = Object.create(emitter.prototype);
  var socket = io.connect(uri + '/socket-screen');

  // Socket Listeners

  socket.on('connect', function() {

    client.emit('connect');

  });

  socket.on('disconnect', function() {

    client.emit('disconnect');

  });

  socket.on(messageTypes.SESSION_UPDATE, function(message) {

    client.emit('update', message);

  });

  socket.on(messageTypes.SESSION_PAIR, function() {

    client.emit('pair');

  })

  socket.on(messageTypes.SESSION_UNPAIR, function() {

    client.emit('unpair');

  });

  // Client Actions

  client.create = function(cb) {

    socket.emit(messageTypes.SESSION_CREATE, function(response) { cb(response.error, response.session); });

  };

  client.join = function(session, cb) {

    // TODO prohibit (or support?) joining multiple sessions
    socket.emit(messageTypes.SESSION_JOIN, session, function(response) { cb(response.error); });

  };

  client.update = function(message, cb) {

    // TODO prohibit (or support?) leaving some but not all sessions
    socket.emit(messageTypes.SESSION_UPDATE, message, function(response) { cb(response.error); });

  };

  client.leave = function(cb) {

    // TODO prohibit (or support?) leaving some but not all sessions
    socket.emit(messageTypes.SESSION_LEAVE, function(response) { cb(response.error); });

  };

  return client;

}