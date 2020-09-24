const io = require('socket.io-client');
const g = require('logitech-g29');
const address = 'http://localhost:9981';
const socket = io(address, {
  reconnectionAttempts: 5,
  timeout: 1000 * 10
});

process.on('SIGINT', function () {
  socket.disconnect();
  g.disconnect();
  process.exit();
});

function init_g29(socket) {
  const events = [
    'wheel-turn',
    'wheel-shift_left',
    'wheel-shift_right',
    'wheel-dpad',
    'wheel-button_x',
    'wheel-button_square',
    'wheel-button_triangle',
    'wheel-button_circle',
    'wheel-button_l2',
    'wheel-button_r2',
    'wheel-button_l3',
    'wheel-button_r3',
    'wheel-button_plus',
    'wheel-button_minus',
    'wheel-spinner',
    'wheel-button_spinner',
    'wheel-button_share',
    'wheel-button_option',
    'wheel-button_playstation',
  ];

  for (const event of events) {
    g.on(event, function (val) {
      console.log('G29 Event', event, val);
      socket.emit('ppMessage', {
        messageId: event,
        value: val,
      });
    });
  }

  console.log('Connecting to G29');
  g.connect(
    {
      debug: false,
    },
    function (err) {
      if (err) {
        console.log('Connecting to G29 failed', err.toString())
        return
      }

      console.log('Connecting to G29 succeed', err.toString())
    }
  );
}

socket.on('connect_error', err => {
  console.error('Socket disconnected, error', err.toString());
});

socket.on('connect_timeout', () => {
  console.error('Socket disconnected, timeout');
});

socket.on('reconnect_failed', () => {
  console.error('Socket disconnected, retry_timeout');
});

socket.on('reconnect_attempt', count => {
  console.error(`Retry to connect #${count}, Please make sure ProtoPie Connect is running on ${address}`);
});

socket.on('connect', () => {
  console.log('Socket has been connected to', address);
  init_g29(socket)
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('ppMessage', (data) => {
  console.log('Receive a message from Connect', data);
  g.leds('');
  g.leds(data.value);
});
