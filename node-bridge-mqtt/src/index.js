const io = require('socket.io-client');
const Aedes = require('aedes');

const MQTT_PORT = 1883;

function connectToConnect(address, sendToMQTT) {
  const socket = io(address);

  socket.on('connect', () => {
    console.log('[SOCKET] Socket connected', address);
    socket.emit('ppBridgeApp', { name: 'MQTT' });
  });

  socket.on('disconnect', () => {
    console.log('[SOCKET] Socket disconnected');
  });

  socket.on('ppMessage', (message) => {
    sendToMQTT(message.messageId, message.value);
  });

  return socket;
}

function main() {
  const aedes = new Aedes.Server();
  const server = require('net').createServer(aedes.handle);
  const socket = connectToConnect('http://localhost:9981', (topic, payload) => {
    console.log('[SOCKET] Mesasge from Connect, Send to MQTT', topic, payload);
    aedes.publish({ topic: topic, payload, payload: payload });
  });

  server.listen(MQTT_PORT, function () {
    console.log('[MQTT] Listening on port:', MQTT_PORT);
    
  });

  aedes.on('client', function (client) {
    console.log('[MQTT] Client connected', client.id);
  });

  aedes.on('clientDisconnect', function (client) {
    console.log('[MQTT] Client disconnected', client.id);
  });

  aedes.on('publish', async function (packet, client) {
    if (!packet.topic.startsWith('$SYS') && client) {
      console.log(
        '[MQTT] Message from MQTT, send to Connect,',
        packet.topic,
        packet.payload.toString()
      );

      socket.emit('ppMessage', {
        messageId: packet.topic,
        value: packet.payload.toString(),
      });
    }
  });
}

main();
