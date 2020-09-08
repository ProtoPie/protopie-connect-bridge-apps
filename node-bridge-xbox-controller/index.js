const io = require('socket.io-client');
const ConnectClient = require('./connect-client');
const XBoxController = require('./xbox-controller');

const dump = process.argv.includes('--dump');
const event = process.argv.includes('--all');
const address = 'http://localhost:9981';

const connect = new ConnectClient(io, address, {
  timeout: 2000,
});
const xbox = new XBoxController();

function sendMessage(messageId, value) {
  console.log('Send message', messageId, value);
  connect.send(messageId, value);
}

function sendController(controller) {
  sendMessage('xbox', JSON.stringify(controller));
}

function sendEvent(controller) {
  sendMessage('axes0', `${controller.axes[0]},${controller.axes[1]}`);
  sendMessage('axes1', `${controller.axes[2]},${controller.axes[3]}`);

  controller.buttons.forEach((button, i) => {
    if (button.pressed) {
      sendMessage('button-' + i, button.value);
    }
  });
}

function runXBoxController() {
  console.log('Connecting to XBox Controller Elite 2');

  xbox.toggleDump(dump);
  xbox.connect();

  xbox.on('connect', ({ id }) => {
    console.log('XBox Connecting Succeeded', id);
  });

  xbox.on('error', (e) => {
    console.log('XBox error', e.message);
    process.exit(-1);
  });

  xbox.on('event', (controllers) => {
    event ? sendController(controllers[0]) : sendEvent(controllers[0]);
  });
}

function main() {
  console.log('Connecting to ProtoPie Connect...', address);

  connect.on('connect', () => {
    console.error('ProtoPie Connect Connecting succeeded');
    runXBoxController();
  });

  connect.on('error', (e) => {
    console.error('ProtoPie Connection error,', e.toString());
    process.exit(-1);
  });

  connect.connect();
}

main();

process.on('uncaughtException', (err) => {
  console.error('Error,', err.message);
  process.exit(-1);
});
