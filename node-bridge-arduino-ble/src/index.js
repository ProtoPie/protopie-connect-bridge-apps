const io = require('socket.io-client');
const BLEService = require('./ble-service');

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const PC_ADDRESS = 'http://localhost:9981';

const socket = io(PC_ADDRESS);
const bleService = new BLEService({
  sUUID: SERVICE_UUID,
  cUUID: CHARACTERISTIC_UUID,
});

socket.on('connect', () => {
  console.log('Socket connected to', PC_ADDRESS);
  socket.emit("ppBridgeApp", { name: "Arduino bluetooth" });
  bleService.start();
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('ppMessage', (message) => {
  console.log('Message from connect. send to device', message);

  bleService.write(message.messageId);
});

bleService.on((type, data) => {
  if (type === 'data') {
    const messageId = data.toString();
    console.log(`Receive data: ${messageId}`);
    socket.emit('ppMessage', {
      messageId,
    });
  } else if (type === 'error') {
    console.log('Error', data);
  } else {
    console.log(type);
  }
});
