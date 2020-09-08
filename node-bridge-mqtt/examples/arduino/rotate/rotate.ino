#include <WiFi.h>
#include <PubSubClient.h>

// Update these with values suitable for your network.
const char* ssid = "<YOUR-WIFI-SSID>";
const char* password = "<YOUR-WIFI-PASSWORD>";
const char* mqtt_server = "<ADDRESS-OF-BRIDGE-APP>";
const int mqtt_port = 1883;

// Update these with values to match of your ProtoPie's message
#define MQTT_TOPIC "ROTATE"
#define MQTT_CLIENT_ID "esp32-mqtt-client"

#define MAX_INPUT 256

WiFiClient wifiClient;

PubSubClient client(wifiClient);

void setup_wifi() {
    delay(10);

    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }

    randomSeed(micros());
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}

void connect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(MQTT_CLIENT_ID)) {
      Serial.println("connected");
      client.publish(MQTT_TOPIC, "hello world");
      client.subscribe(MQTT_TOPIC);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void callback(char* topic, byte *payload, unsigned int length) {
    Serial.println("Receiving new payload");
    Serial.print("  topic:");
    Serial.println(topic);

    Serial.print("  payload:");  
    Serial.write(payload, length);
    Serial.println();
}

void setup() {
  Serial.begin(115200);
  Serial.setTimeout(500);
 
  setup_wifi();
 
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  connect();
}

 void publish(char *payload){
  if (!client.connected()) {
    connect();
  }

  client.publish(MQTT_TOPIC, payload);
}

void loop() {
  client.loop();

  // type value on serial monitor
  if (Serial.available() > 0) {
    char input[MAX_INPUT];
    memset(input, 0, MAX_INPUT);
    Serial.readBytesUntil( '\n', input, MAX_INPUT - 1);

    publish(input);
   }
 }
