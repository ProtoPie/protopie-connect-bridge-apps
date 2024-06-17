const io = require('socket.io-client');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const ARDUINOS = [
  { portName: '/dev/cu.usbmodemF412FA6F69002', baudRate: 9600, messageIdPrefix: 'arduino-0' },
  { portName: '/dev/cu.usbmodem101', baudRate: 9600, messageIdPrefix: 'arduino-1' },
];

const ports = [];

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
  console.log('Message from connect', message);
  
  
  if (message.messageId.startsWith('broadcast-')) {
    ports.forEach((port, index) => {
      port.write(message.messageId + "||" + message.value);
      console.log(`Broadcast message sent to Arduino ${index} on port ${ARDUINOS[index].portName}`);
    });
  } else {
    
    ports.forEach((port, index) => {
      if (message.messageId.startsWith(ARDUINOS[index].messageIdPrefix)) {
        port.write(message.messageId + "||" + message.value);
        console.log(`Message with ID ${message.messageId} sent to Arduino ${index} on port ${ARDUINOS[index].portName}`);
      } else {
        console.log(`Message with ID ${message.messageId} not sent to Arduino ${index} on port ${ARDUINOS[index].portName} due to ID prefix mismatch`);
      }
    });
  }
});

ARDUINOS.forEach((arduino, index) => {
  const port = new SerialPort({
    path: arduino.portName,
    baudRate: arduino.baudRate
  });

  port.on('open', function () {
    console.log(`Serial port ${index} opened`, arduino.portName);

    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    parser.on('data', data => {
      console.log(`Message received from Arduino ${index} on port ${ARDUINOS[index].portName}`, data);
      const parts = data.split('||');
      const messageId = parts[0];
      const value = parts[1] || "";
      socket.emit('ppMessage', {
        messageId: messageId,
        value: value
      });
    });
  });

  port.on('error', err => {
    console.error(`Error on port ${index} on port ${ARDUINOS[index].portName}: `, err.message);
  });

  ports.push(port);
});