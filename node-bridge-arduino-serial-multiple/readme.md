# arduino-serial-node-bridge-multiple

> This bridge application facilitates communication between Arduino devices and a desktop via USB serial. This example demonstrates how to exchange messages between an Arduino and a desktop through USB serial. It functions as an echo example. For instance, a ProtoPie example sends a 'ROTATE' message to the node bridge app via ProtoPie Connect, which then delivers the message to Arduino. Upon receiving the message, Arduino echoes the message back. Ultimately, you will observe the object in ProtoPie rotating.

## Multiple Arduinos

The multiple version supports multiple Arduino devices. You can connect several Arduinos to your computer and send messages to them using specific message ID prefixes. Additionally, it supports broadcasting messages, which means sending messages to all connected Arduinos simultaneously.

## Arduino Setup

You need to set the baud rate to 9600 and update the serial port name in the `index.js` file. You can find the name of the serial port in the Arduino IDE.

```js
const ARDUINOS = [
  { portName: '/dev/cu.usbmodemF412FA6F69002', baudRate: 9600, messageIdPrefix: 'arduino-0' },
  { portName: '/dev/cu.usbmodem101', baudRate: 9600, messageIdPrefix: 'arduino-1' },
];
```

## Sending Messages from Serial to ProtoPie Connect

```c
  if (Serial.available() > 0) {
    // read the message
    message = Serial.readStringUntil('\n'); // Assuming messages are newline-terminated

    // Check if the message starts with "arduino-0" or "broadcast-"
    if (message.startsWith("arduino-0") || message.startsWith("broadcast-")) {
      // echo what you got
      Serial.println(message);
    }
    Serial.flush();
  } 
```

## Sending Messages from ProtoPie Connect to Serial

Messages are processed only if they start with the corresponding `messageIdPrefix` such as `arduino-0`, `arduino-1`, or `broadcast-`. Broadcast messages are sent to multiple Arduinos, thus the ProtoPie file will receive messages multiple times.

```js

socket.on('ppMessage', message => {
  console.log('Message from connect', message);
  
  
  if (message.messageId.startsWith('broadcast-')) {
    // Broadcast the message to all Arduinos
    ports.forEach((port, index) => {
      port.write(message.messageId + "||" + message.value);
      console.log(`Broadcast message sent to Arduino ${index} on port ${ARDUINOS[index].portName}`);
    });
  } else {
    // Send the message to the specified Arduino
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
```

# Usage

This bridge application is compatible with the current Node.js LTS version v20.12.2.

To use this bridge application, you need to have the Yarn package manager installed. Follow these steps to get started:

1. Install the dependencies:
```
yarn install
```
2. Start the application:
```
yarn run start
```

## Important Notes

- Ensure that your Arduino devices are correctly connected and that the serial port names and baud rates are correctly configured in the `index.js` file.
- When sending messages, include the appropriate `messageIdPrefix` such as `arduino-0`, `arduino-1`, or `broadcast-` to ensure that messages are sent to the intended Arduino(s) or broadcasted to all connected Arduinos.