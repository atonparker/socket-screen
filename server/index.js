'use strict';

const debug = require('debug')('second-screen');
const socketio = require('socket.io');
const hashpool = require('hashpool');
const messageTypes = require('./message-types');

module.exports = SocketScreen;

// A shared pool of six-digit hexadecimal IDs.
const sesspool = hashpool();

function SocketScreen(io) {

  if (io === undefined) throw new Error('You must provide a socket.io server.');

  const namespace = io.of('/socket-screen');
  namespace.on('connection', connection(namespace));

  debug('created second-screen namespace');

}

const connection = namespace => socket => {

  let session = null;


  // Helper function to count the number of clients in the room.
  const nclients = (session) => {

    let room = namespace.adapter.rooms[session];
    return room ? Object.keys(room).length : 0;

  }

  debug('socket %s', socket.id);
  debug('  connected');

  // Create
  // ------

  socket.on(messageTypes.SESSION_CREATE, (respond) => {

    debug('socket %s', socket.id);

    try {

      session = sesspool.take();
      debug('  created session %s', session);

      socket.join(session);
      debug('  joined session %s', socket.id, session);

      respond({ ok: true, session });

    } catch(e) {

      respond({ error: ERROR_FULL });

    }

  });

  // Join
  // ----

  socket.on(messageTypes.SESSION_JOIN, (session, respond) => {

    debug('socket %s', socket.id);

    socket.join(session);
    debug('  joined session %s', session);

    if (nclients(session) > 1) {

      socket.broadcast.to(session).emit(messageTypes.SESSION_PAIR);

    }

    respond({ ok: true });

  });

  // Update
  // ------

  socket.on(messageTypes.SESSION_UPDATE, (message) => {

    debug('socket %s', socket.id);
    debug('  update %s', JSON.stringify(message));

    socket.broadcast.to(session).emit(messageTypes.SESSION_UPDATE, message);

  });

  // Leave
  // -----

  socket.on(messageTypes.SESSION_LEAVE, () => {

    debug('socket %s', socket.id);

    socket.leave(session);
    debug('  left session %s', session);

    if (nclients(session) > 0) {

      socket.broadcast.to(session).emit(messageTypes.SESSION_UNPAIR);

    } else {

      sesspool.free(session);

    }

  });

  // Disconnect
  // ----------

  socket.on('disconnect', () => {

    debug('socket %s', socket.id);

    socket.leave(session);
    debug('  disconnected', session);

    if (nclients(session) > 0) {

      socket.broadcast.to(session).emit(messageTypes.SESSION_UNPAIR);

    } else {

      sesspool.free(session);

    }

  });

}

