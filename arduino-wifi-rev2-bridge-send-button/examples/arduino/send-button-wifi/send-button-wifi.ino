/*
  Simple Socket.Io over WebSocket client for Arduino WiFI Rev 2.
  Connects to the ProtoPie Connect, and send a hello message every 5 seconds
*/

#include <WiFiNINA.h>
#include "./PCSimpleSocketIo.h"
// Use 3rd-party library, You can find out and install from Library Manager
#include "OneButton.h" 

const char* ssid = "WIFI_SSID";
const char* password = "WIFI_PASSWORD";
const char* pcs_ip = "192.168.0.7";     // ProtoPie connect address
const int pcs_port = 9981;              // ProtoPie connect port number

// Use D1 pin for button
OneButton button(2, true);

// Wifi and socket client
WiFiClient wifi;
WebSocketClient client = WebSocketClient(wifi, pcs_ip, pcs_port);
PCSimpleSocketIo socket = PCSimpleSocketIo(&client);

int event_handler(const char* messageId) {
  Serial.print("Received a message: ");
  Serial.println(messageId);
}

void setup() {
  Serial.begin(9600); 

  // initialize the pushbutton pin as an input:
  button.attachClick(click);
  button.attachDoubleClick(doubleClick);

  // initialize Wifi
  int status = WL_IDLE_STATUS;

  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);

    status = WiFi.begin(ssid, password);
  }

  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // initialize Socket.IO
  Serial.println("Attempting to connect to Protopie connect");
  socket.on(event_handler);
  socket.begin();
}

void loop() {
  // check socket status
  socket.loop();

  // check button status
  button.tick();

  // delay until next tick
  delay(10);
}

void click() {
  Serial.println("CLICK");
  socket.emit("CLICK");
}

void doubleClick() {
  Serial.println("DBL_CLICK");
  socket.emit("DBL_CLICK");
}
