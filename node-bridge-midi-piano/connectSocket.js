const connectSocket = (io, address, handleMessageReceive) => {
  const socket = io(address, {
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
        `[SOCKETIO] Retry to connect #${count}, Please make sure ProtoPie Connect is running on ${address}`
      );
    })
    .on('connect', async () => {
      console.log('[SOCKETIO] connected to', address);
      socket.emit('ppBridgeApp', { name: 'midi-piano' });
    })
    .on('disconnect', () => {
      console.log('[SOCKETIO] disconnected');
    })
    .on('ppMessage', handleMessageReceive);

  return socket;
};

module.exports = connectSocket;
