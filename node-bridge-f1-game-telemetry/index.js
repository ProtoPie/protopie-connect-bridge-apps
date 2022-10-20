import { F1TelemetryClient, constants } from '@racehub-io/f1-telemetry-client';
import io from 'socket.io-client';

const { PACKETS } = constants;
const address = 'http://localhost:9981';
const socket = io(address, {
  reconnectionAttempts: 5,
  timeout: 1000 * 10,
});

/*
*   'port' is optional, defaults to 20777
*   'bigintEnabled' is optional, setting it to false makes the parser skip bigint values,
*                   defaults to true
*   'forwardAddresses' is optional, it's an array of Address objects to forward unparsed telemetry to. each address object is comprised of a port and an optional ip address
*                   defaults to undefined
*   'skipParsing' is optional, setting it to true will make the client not parse and emit content. You can consume telemetry data using forwardAddresses instead.
*                   defaults to false
*/
const f1Client = new F1TelemetryClient({ port: 20777 });

process.on('SIGINT', function () {
  socket.disconnect();
  f1Client.stop();
  process.exit();
});

function init_f1_telemetry(socket) {
    for (const PACKET in PACKETS) {
      f1Client.on(PACKET, function (val) {
          console.log('F1 Event', PACKET, JSON.stringify(val, (key, value) => (typeof value === 'bigint' ? value.toString() : value)));
          socket.emit('ppMessage', {
              messageId: PACKET,
              value: JSON.stringify(val, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
          });
      });
    }

    console.log('Connecting to F1 Game');
    f1Client.start();
}

socket.on('connect_error', (err) => {
  console.error('Socket disconnected, error', err.toString());
});

socket.on('connect_timeout', () => {
  console.error('Socket disconnected, timeout');
});

socket.on('reconnect_failed', () => {
  console.error('Socket disconnected, retry_timeout');
});

socket.on('reconnect_attempt', (count) => {
  console.error(
    `Retry to connect #${count}, Please make sure ProtoPie Connect is running on ${address}`
  );
});

socket.on('connect', () => {
  console.log('Socket has been connected to', address);
  socket.emit("ppBridgeApp", { name: "F1Telemetry" });
  init_f1_telemetry(socket);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('ppMessage', (data) => {
  console.log('Receive a message from Connect', data);
});
