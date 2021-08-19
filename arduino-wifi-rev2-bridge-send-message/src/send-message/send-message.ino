/*
  Simple Socket.Io over WebSocket client for Arduino WiFI Rev 2.
  Connects to the ProtoPie Connect, and send a hello message every 5 seconds
*/

#include <WiFiNINA.h>
#include "./PCSimpleSocketIo.h" 

const char* ssid = SSID; // SSID of WIFI
const char* password = PASSWORD; // Password of WIFI
const char* serverAddress = "192.168.0.33"; // IP Address of ProtoPie Connect without protocol
const int port = 9981; // Port of ProtoPie Connect

// Wifi and socket client
WiFiClient wifi;
WebSocketClient client = WebSocketClient(wifi, serverAddress, port);
PCSimpleSocketIo socket = PCSimpleSocketIo(&client);

int event_handler(const char* messageId) {
  Serial.print("Received a message: ");
  Serial.println(messageId);
}

void setup() {
  Serial.begin(9600); 

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

  socket.emit("time", String(millis()).c_str());

  // delay until next tick
  delay(2000);
}
