/*
  Simple Socket.Io over WebSocket client for Protopie Connect
  Connects to the ProtoPie Connect, and send a hello message every 5 seconds
*/

#include <ArduinoHttpClient.h>
#include <ArduinoJson.h>

// JSON document
StaticJsonDocument<200> doc;

// Socket event handler
typedef int (*SocketEventHandler) (const char* messageId);

class PCSimpleSocketIo {
  public:
    PCSimpleSocketIo(WebSocketClient* client);
    void begin();
    void emit(const char* message, const char* value);
    void on(SocketEventHandler handler);
    void loop();
  private:
    PCSimpleSocketIo();
    WebSocketClient* client;
    unsigned long heartBeat;
    SocketEventHandler handler;
};

PCSimpleSocketIo::PCSimpleSocketIo() {}

PCSimpleSocketIo::PCSimpleSocketIo(WebSocketClient* client) {
  this->client = client;
}

void PCSimpleSocketIo::begin() {
  Serial.println("socket start to connect");
  this->client->begin("/socket.io/?EIO=3&transport=websocket");
  while (!this->client->connected()) {
    Serial.print(".");
    delay(500);
  }

  Serial.println("socket connected");
  this->heartBeat = millis();
}

void PCSimpleSocketIo::emit(const char* message, const char* value) {
  char buf[256];
  sprintf(buf, "42[\"ppMessage\",{\"messageId\":\"%s\",\"value\":\"%s\"}]", message, value);

  Serial.print("Send messaage: ");
  Serial.println(buf);

  this->client->beginMessage(TYPE_TEXT);
  this->client->print(buf);
  this->client->endMessage();
}

void PCSimpleSocketIo::on(SocketEventHandler handler) {
  this->handler = handler;
}

void PCSimpleSocketIo::loop() {
  // waiting for message
  if (this->client->parseMessage() > 0) {
    Serial.print("Message type");
    Serial.println(client->messageType());

    String message = client->readString();
    message.remove(0, 2);

    deserializeJson(doc, message);
    if (strcmp(doc[0], "ppMessage") == 0) {
      const char* messageId = doc[1]["messageId"].as<const char*>();

      Serial.print("Received a messageId: ");
      Serial.println(message);

      if (this->handler) {
        this->handler(messageId);
      }
    }
  }

  // send a hearbeat
  unsigned int now = millis();
  unsigned int diff = now - this->heartBeat;
  
  if (diff > 10000) {
    this->client->beginMessage(TYPE_TEXT);
    this->client->print("3[\"--heartbeat--\"]");
    this->client->endMessage();
  
    this->heartBeat = now;
  }
}
