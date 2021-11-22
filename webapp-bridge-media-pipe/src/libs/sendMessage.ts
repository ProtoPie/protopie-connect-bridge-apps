import io from 'socket.io-client';

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

socket.on('ppMessage', (data) => {
  console.log('[SOCKETIO] Receive a message from Connect', data);
});

const sendMessage = <T>(message: string, value: T) => {
  socket.emit('ppMessage', {
    messageId: message,
    value,
  });
};

export default sendMessage;
