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

  function echo(event) {

    var listener = function() {

      var args = Array.prototype.slice.call(arguments);
      client.emit.apply(client, [ event ].concat(args));

    };

    socket.on(event, listener);

  }

  echo('connect');
  echo('disconnect');
  echo('pair');
  echo('unpair');
  echo('update');

  client.create = function(cb) {

    socket.emit(messageTypes.SESSION_CREATE, function(res) { cb(res.error, res.session); });

  };

  client.join = function(session, cb) {

    // TODO prohibit (or support?) joining multiple sessions
    socket.emit(messageTypes.SESSION_JOIN, session, function(res) { cb(res.error); });

  };

  client.leave = function(cb) {

    // TODO prohibit (or support?) leaving some but not all sessions
    socket.emit(messageTypes.SESSION_LEAVE, function(res) { cb(res.error); });

  };

  return client;

}