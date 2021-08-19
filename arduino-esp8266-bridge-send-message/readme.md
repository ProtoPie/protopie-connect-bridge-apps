# arduino-esp8266-beidge-send-message

> Example for sending messages from ESP8266 compatible devices to ProtoPie Connect.

# Tested Devices

- NodeMCU ESP32S
- NodeMCU 1.0 ESP-12E

# Project Structure

```sh
.
├── readme.md
└── src
    └── send-message
        ├── defines.h
        └── send-message.ino
```

# How to use

1. Run ProtoPie Connect and goto `Debug` tab on dashboard
2. Add arduino libraries [WiFiWebServer](https://github.com/khoih-prog/WiFiWebServer) with Library manager
3. Connect and upload the arduino source in the src to your device
4. Watch the `Debug` tab on ProtoPie Connect
