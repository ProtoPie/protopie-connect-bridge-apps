# arduino-serial-node-bridge

> Bridgeapp for Arduino and desktop with USB serial. This example shows how to exchange messages between Arduino and desktop through USB serial. It's a kind of echo example. ProtoPie example sends 'ROTATE' message to node bridge app via Protopie connect, the node bridge app will deliver the message to Arduino. After receiving the message on Arduino, the Arduino echo the message. Finally, you can see that the object on ProtoPie is rotated

# Arduino

## Setup

You need to set the baudate to 9600 and change the name of the serial port in index.js. You can find out the name on Arduino IDE

```js
const PORT_NAME = '/dev/cu.SLAB_USBtoUART';
```

## Send message from serial to ProtoPie Connect

```c
if (Serial.available() > 0) {
  // read the message
  message = Serial.readString();
  // echo what you got
  Serial.println(message);
  Serial.flush();
} 
```

## Send message from ProtoPie Connect to serial

```js
// You've got a message from ProtoPie connect
socket.on('ppMessage', message => {
  // Write a message to Arduino
  port.write(message.messageId);
});
```