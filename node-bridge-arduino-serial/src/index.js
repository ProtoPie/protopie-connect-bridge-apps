const io = require('socket.io-client');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const PORT_NAME = '/dev/cu.usbmodem1101';
const BAUDRATE = 9600;

const port = new SerialPort({
  path: PORT_NAME,
  baudRate: BAUDRATE
});

port.on('open', function () {
  console.log('Serial port opened', PORT_NAME);

  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
  parser.on('data', data => {
    console.log('Message received', data);
    socket.emit('ppMessage', {
      messageId: data
    });
  });

  const address = 'http://localhost:9981';
  const socket = io(address);

  socket.on('connect', () => {
    console.log('Socket connected to', address);
    socket.emit("ppBridgeApp", { name: "Arduino serial" });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('ppMessage', message => {
    console.log('Message from connect. send to device', message);
    port.write(message.messageId);
  });
});

port.on('error', err => {
  console.error('Error: ', err.message);
});
