#include <ESP8266WiFi.h>
#include <SocketIoClient.h>
#include <ArduinoJson.h>

const char* ssid     = "SSID";
const char* password = "PASSWORD";
const char* pcs_ip   = "192.168.0.7";
const int   pcs_port = 9981;

SocketIoClient socket;
StaticJsonDocument<200> json;

void on_message(const char *payload, size_t length) {
  Serial.printf("Got message: %s\n", payload);

  // Deserialize JSON payload
  Serial.println("Deserialize JSON payload");
  deserializeJson(json, payload);

  // Echo received message
  char echoMessage[64];
  sprintf(echoMessage, "{\"messageId\":\"%s-Echo\"}", json["messageId"].as<char*>());
  socket.emit("ppMessage", echoMessage);
}

void setup() {
  Serial.begin(9600);

  // Wifi Setup
  Serial.print("WiFi Connecting");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("Connection established!");  
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());

  // Socket.IO Setup
  Serial.println("Socket IO Connecting");
  socket.begin(pcs_ip, pcs_port);
  socket.on("ppMessage", on_message);
  Serial.println("Socket IO Connection established!");
}

void loop() {
  socket.loop();
}
