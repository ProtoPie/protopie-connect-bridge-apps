# arduino-mqtt-node-bridge

> Bridgeapp for Arduino and desktop for MQㅆㅆ. This example shows how to exchange messages between Arduino and desktop through MQTT. It's a kind of echo example. Arduino sends 'ROTATE' message to the Node bridge app via MQTT, the node bridge app will pass the message to ProtoPie Connect via socket.io. As receiving the message from Arduino, you can see that the object on ProtoPie will be rotated.

# Arduino

We tested an arduino example with PubSubClient 2.8.0 library with ESP32-S

## Setup

You can find out the names on Arduino IDE to connect to WIFI and the bridge app

```js
const char* ssid = "<YOUR-WIFI-SSID>";
const char* password = "<YOUR-WIFI-PASSWORD>";
const char* mqtt_server = "<ADDRESS-OF-BRIDGE-APP>";
```

## Send message from serial to the bridge app

```c
if (Serial.available() > 0) {
  char input[MAX_INPUT];
  memset(input, 0, MAX_INPUT);
  Serial.readBytesUntil( '\n', input, MAX_INPUT - 1);

  publish(input);
}
```

# MQTT

## Test with MQTT bot

```sh
npm install -g mqttbot
mqttbot -b 1 -t protopie --random 0-1000 -i 1000 mqtt://localhost
```