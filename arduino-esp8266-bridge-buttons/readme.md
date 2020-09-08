# demo-esp8266-send-button

> Example for send button messaging between ESP8266 with Arduino Core compatibled board and ProtoPie. [NodeMCU](https://en.wikipedia.org/wiki/NodeMCU) 1.0 and 0.9 is our target board.

# Project Structure

```sh
.
├── circuit.jpg
├── demo.mp4
├── examples
│   ├── arduino # Arduino example
│   │   └── send-button-wifi
│   │       └── send-button-wifi.ino
│   └── protopie # Protopie example
│       └── button.pie
└── readme.md

```

# How to use

1. Run ProtoPie connect and goto `Debug` tab on dashboard
2. Add `http://arduino.esp8266.com/stable/package_esp8266com_index.json` to additional board manager. For more information, please refer to NodeMCU/ESP8266 references on the Internet
3. Add `Onebutton` library from Library manager
4. Connect and upload the source in the arduino example to your device
5. Send message from ProtoPie connect

# Code

## Send message via socket.io

```js
void send_message(const char* messageId) {
  char message[64];
  sprintf(message, "{\"messageId\":\"%s\"}", messageId);
  socket.emit("ppMessage", message);

  Serial.printf("Send message via socket.io, %s\n", message);
}
```