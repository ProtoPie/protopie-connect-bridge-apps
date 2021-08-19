# demo-esp8266-echo

> Example for echo messaging between ESP8266 with Arduino Core compatibled board and ProtoPie. [NodeMCU](https://en.wikipedia.org/wiki/NodeMCU) 1.0 and 0.9 is our target board.

# Project Structure

```sh
.
├── README.md
└── examples
    └── arduino # Arduino example
        └── socketio-ehco
            └── socketio-ehco.ino
```

# How to use

1. Please make sure that Arduino supporting ESP8266. Please refer to [Installing with Board Manager for ESP8266](https://github.com/esp8266/Arduino#installing-with-boards-manager)
1. Run ProtoPie connect and goto `Debug` tab on dashboard
2. Connect and upload src arduino examples to your device
3. Send message from ProtoPie connect
4. Check the debug message on the dashboard whether the echo message from the device is coming or not.

# Code

## Recieve message via socket.io

```c
void on_message(const char *payload, size_t length) {
  // Deserialize JSON payload
  Serial.println("Deserialize JSON payload");
  deserializeJson(json, payload);

  if (strcmp(doc["messageId"], "led-on") == 0) {
    digitalWrite(13, HIGH);
  } else if (strcmp(doc["messageId"], "led-off") == 0) {
    digitalWrite(13, LOW);
  }
}

socket.on("ppMessage", on_message);
```

## Send message via socket.io

```js
char echoMessage[64];
sprintf(echoMessage, "{\"messageId\":\"%s-Echo\"}", "message");
socket.emit("ppMessage", echoMessage);
```