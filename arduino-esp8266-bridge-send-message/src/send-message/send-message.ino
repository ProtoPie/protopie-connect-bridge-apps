
#include "defines.h"

#include <WiFiHttpClient.h>
#include <WiFiWebServer.h>

char* ssid = SSID; // SSID of WIFI
char* password = PASSWORD; // Password of WIFI
char* serverAddress = "192.168.0.33"; // IP Address of ProtoPie Connect without protocol
int port = 9981; // Port of ProtoPie Connect

WiFiClient client;
WiFiWebSocketClient  wsClient(client, serverAddress, port);

void setup()
{
    Serial.begin(9600);
    delay(10);
    Serial.print("Setup is started");

    // We start by connecting to a WiFi network

    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    Serial.print("Connecting socket client to");
    Serial.println(serverAddress);

    wsClient.begin("/socket.io/?EIO=3&transport=websocket");

    while (!wsClient.connected()) 
    {
      delay(500);
      Serial.print(".");
    }

    Serial.println("");
    Serial.println("Socket connected");
}

void sendMessage() {
    wsClient.beginMessage(TYPE_TEXT);
    char buf[256];
    sprintf(buf, "42[\"ppMessage\",{\"messageId\":\"time\",\"value\":\"%s\"}]", String(millis()));

    Serial.print("Send messaage: ");
    Serial.println(buf);
    
    wsClient.print(buf);
    wsClient.endMessage();
}

void loop()
{
    sendMessage();

    delay(2000);
}
