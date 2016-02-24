const emitter = require('component-emitter');
const messageTypes = require('../message-types');

module.exports = SocketScreenClient;

function SocketScreenClient(io) {

  if (io === undefined) throw new Error('You must provide a socket.io server.');

  const client = Object.create(emitter.prototype);
  const socket = io.of('/socket-screen');

  socket.on('pair',   () => client.emit('pair'));
  socket.on('unpair', () => client.emit('unpair'));
  socket.on('update', (message) => client.emit('update', message))

  client.create = function(callback) {

    socket.emit(messageTypes.CREATE, (res) => cb(res.error, res.session));

  }

  client.join = function(callback) {

    socket.emit(messageTypes.JOIN, (res) => cb(res.error));

  }

  client.leave = function(callback) {

    socket.emit(messageTypes.LEAVE, (res) => cb(res.error));

  }

  return client;

}
