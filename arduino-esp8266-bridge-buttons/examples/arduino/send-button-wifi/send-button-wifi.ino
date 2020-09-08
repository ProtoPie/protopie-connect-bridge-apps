/*
  Send Button Message Example

  Send a message to ProtoPie Connect via socket.io when pressing a pushbutton 
  
  The circuit:
  - pushbutton attached in pull-up mode, 
*/

#include <ESP8266WiFi.h>
#include <SocketIoClient.h>
// Use 3rd-party library, You can find out and install from Library Manager
#include "OneButton.h" 

const char* ssid = "WIFI_SSID";
const char* password = "WIFI_PASSWORD";
const char* pcs_ip = "192.168.0.7";     // ProtoPie connect server address
const int pcs_port = 9981;              // ProtoPie connect port number

// Use D1 pin for button
OneButton button(D1, true);
SocketIoClient socket;

void send_message(const char* messageId) {
  char message[64];
  sprintf(message, "{\"messageId\":\"%s\"}", messageId);
  socket.emit("ppMessage", message);

  Serial.printf("Send message via socket.io, %s\n", message);
}

void setup() {
  Serial.begin(9600); 

  // initialize the pushbutton pin as an input:
  button.attachClick(click);
  button.attachDoubleClick(doubleClick);

  // initialize Wifi
  Serial.print("WiFi Connecting");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("Connection established!");  
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());

  // initialize Socket.IO
  Serial.println("Socket IO Connecting");
  socket.begin(pcs_ip, pcs_port);
  Serial.println("Socket IO Connection established!");
}

void loop() {
  // check socket data
  socket.loop();

  // check button status
  button.tick();
  delay(10);
}

void click() {
  send_message("CLICK");
}

void doubleClick() {
  send_message("DBL_CLICK");
}
