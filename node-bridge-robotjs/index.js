const io = require('socket.io-client');
const { messageHandler } = require('./messageHandler');

const ADDRESS = 'http://localhost:9981';

const socket = io(ADDRESS, {
  reconnectionAttempts: 5,
  timeout: 1000 * 10,
});

socket
  .on('connect_error', (err) => {
    console.error('[SOCKETIO] disconnected, error', err.toString());
  })
  .on('connect_timeout', () => {
    console.error('[SOCKETIO] disconnected by timeout');
  })
  .on('reconnect_failed', () => {
    console.error('[SOCKETIO] disconnected by retry_timeout');
  })
  .on('reconnect_attempt', (count) => {
    console.error(
      `[SOCKETIO] Retry to connect #${count}, Please make sure ProtoPie Connect is running on ${ADDRESS}`
    );
  })
  .on('connect', async () => {
    console.log('[SOCKETIO] connected to', ADDRESS);
  });

socket.on('disconnect', () => {
  console.log('[SOCKETIO] disconnected');
});

socket.on('ppMessage', messageHandler);
