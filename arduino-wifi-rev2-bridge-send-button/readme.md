# demo-arduino-wifi-rev2-send-button

> Example for send button messaging between Arduino Uno Wifi Rev 2 and ProtoPie.

# Project Structure

```sh
.
├── circuit.jpg # Arduino wired with button
├── demo.mp4 # Demo to show how to work with ProtoPie Connect
├── examples
│   ├── arduino
│   │   └── send-button-wifi # Arduino example
│   │       ├── PCSimpleSocketIo.h
│   │       └── send-button-wifi.ino
│   └── protopie # Protopie example
│       └── button.pie
└── readme.md
```

# How to use

1. Run ProtoPie connect and goto `Debug` tab on dashboard
2. Add `OneButton` library from Library manager
4. Connect and upload the source in the arduino example to your device
5. Send message from ProtoPie connect

# Code

## Send message via socket.io

```js
void click() {
  Serial.println("CLICK");
  socket.emit("CLICK");
}

void doubleClick() {
  Serial.println("DBL_CLICK");
  socket.emit("DBL_CLICK");
}
```