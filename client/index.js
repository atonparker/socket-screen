'use strict';

var emitter = require('component-emitter');
var messageTypes = require('../message-types');

module.exports = SocketScreenClient;

function SocketScreenClient(io) {

  if (io === undefined) throw new Error('You must provide a socket.io server.');

  var client = Object.create(emitter.prototype);
  var socket = io.of('/socket-screen');

  function echo(event) {

    var listener = function() {

      var args = [ event ].push(arguments);
      client.emit.apply(null, args);

    };

    socket.on(event, listener);

  }

  echo('pair');
  echo('unpair');
  echo('update');

  client.create = function(cb) {

    socket.emit(messageTypes.CREATE, function (res) { cb(res.error, res.session); });

  };

  client.join = function(cb) {

    socket.emit(messageTypes.JOIN, function (res) { cb(res.error); });

  };

  client.leave = function(cb) {

    socket.emit(messageTypes.LEAVE, function (res) { cb(res.error); });

  };

  return client;

}