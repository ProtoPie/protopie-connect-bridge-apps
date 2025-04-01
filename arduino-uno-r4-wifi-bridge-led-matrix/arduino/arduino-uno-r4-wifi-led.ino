#include <WiFiS3.h>
#include <SocketIOclient.h> // Using the WebSockets library by Markus Sattler >=2.6.1
#include <ArduinoJson.h> // Using the ArduinoJson library by Benoit Blanchon >=7.3.1
#include "Arduino_LED_Matrix.h"  // Using the official LED matrix library

// WiFi and Socket.IO configuration
const char* ssid = "your-ssid";
const char* password = "your-password";
const char* host = "192.168.125.233";
const uint16_t port = 9981;
const char* socketPath = "/socket.io/?EIO=3";

SocketIOclient socket;
ArduinoLEDMatrix matrix;  // LED matrix object

// Global grid (8 rows x 12 columns), default is all off (0)
uint8_t currentGrid[8][12] = { 0 };

// Function to send error messages back via ppMessage
void sendErrorMessage(const char* errorMsg) {
  DynamicJsonDocument doc(256);
  JsonArray arr = doc.to<JsonArray>();
  arr.add("ppMessage");
  JsonObject obj = arr.createNestedObject();
  obj["messageId"] = "error";
  obj["value"] = errorMsg;
  String jsonStr;
  serializeJson(doc, jsonStr);
  socket.sendEVENT(jsonStr.c_str());
}

// Function to display the grid array directly on the LED matrix
void displayGrid(uint8_t grid[8][12]) {
  matrix.renderBitmap(grid, 8, 12);
}

// Socket.IO event callback function
void socketEventCallback(socketIOmessageType_t type, unsigned char* payload, unsigned int length) {
  switch (type) {
    case sIOtype_CONNECT:
      Serial.println("Connected to Socket.IO server");
      {
        DynamicJsonDocument doc(256);
        JsonArray arr = doc.to<JsonArray>();
        arr.add("ppBridgeApp");
        JsonObject obj = arr.createNestedObject();
        obj["name"] = "Arduino UNO R4 WIFI";
        String jsonStr;
        serializeJson(doc, jsonStr);
        socket.sendEVENT(jsonStr.c_str());
      }
      break;

    case sIOtype_DISCONNECT:
      Serial.println("Socket.IO connection disconnected");
      break;

    case sIOtype_EVENT:
      Serial.print("Event received: ");
      Serial.write(payload, length);
      Serial.println();

      {
        // Parse the received JSON data.
        // Expected format: ["ppMessage", { "messageId": "...", "value": "..." }]
        DynamicJsonDocument doc(1024);
        DeserializationError error = deserializeJson(doc, payload, length);
        if (error) {
          Serial.print("JSON parsing failed: ");
          Serial.println(error.c_str());
          sendErrorMessage(error.c_str());
          return;
        }
        JsonArray arr = doc.as<JsonArray>();
        if (arr.size() < 2) {
          Serial.println("Invalid JSON array format");
          sendErrorMessage("Invalid JSON array format");
          return;
        }
        const char* eventName = arr[0];
        JsonVariant eventData = arr[1];

        // Process only when the event name is "ppMessage"
        if (strcmp(eventName, "ppMessage") == 0) {
          Serial.println("Processing ppMessage event");
          const char* messageId = eventData["messageId"];
          // Handle "led-index": value is a JSON string representing array of a LED to light on [x,y,on]
          if (strcmp(messageId, "led-index") == 0) {
            const char* valueStr = eventData["value"];
            DynamicJsonDocument indexDoc(256);
            DeserializationError err = deserializeJson(indexDoc, valueStr);
            if (err) {
              Serial.print("led-index JSON parsing failed: ");
              Serial.println(err.c_str());
              sendErrorMessage(err.c_str());
              return;
            }
            JsonArray indexArray = indexDoc.as<JsonArray>();
            if (indexArray.size() < 3) {
              Serial.println("led-index array size is less than 3");
              sendErrorMessage("led-index array size is less than 3");
              return;
            }
            // x: column (0-11), y: row (0-7), state: on/off (non-zero = on)
            int x = indexArray[0];
            int y = indexArray[1];
            int state = indexArray[2];
            // Check boundaries
            if (x < 0 || x >= 12 || y < 0 || y >= 8) {
              Serial.println("led-index coordinates out of bounds");
              sendErrorMessage("led-index coordinates out of bounds");
              return;
            }
            // Update the global grid cell
            currentGrid[y][x] = (state != 0) ? 1 : 0;
            Serial.print("Setting LED at (");
            Serial.print(x);
            Serial.print(",");
            Serial.print(y);
            Serial.print(") to ");
            Serial.println(state);
            // Refresh the LED matrix with the updated grid
            displayGrid(currentGrid);
          }
          // Handle "led-display": value is a JSON string representing an array of coordinate pairs [[x,y], [x,y], ...]
          else if (strcmp(messageId, "led-display") == 0) {
            const char* valueStr = eventData["value"];
            DynamicJsonDocument coordsDoc(512);
            DeserializationError err = deserializeJson(coordsDoc, valueStr);
            if (err) {
              Serial.print("led-display2 JSON parsing failed: ");
              Serial.println(err.c_str());
              sendErrorMessage(err.c_str());
              return;
            }
            JsonArray coordsArray = coordsDoc.as<JsonArray>();
            // Create a new grid that is all off
            uint8_t grid[8][12] = { 0 };
            // Iterate through each coordinate pair
            for (JsonVariant v : coordsArray) {
              if (v.is<JsonArray>()) {
                JsonArray pair = v.as<JsonArray>();
                if (pair.size() >= 2) {
                  int x = pair[0];
                  int y = pair[1];
                  if (x >= 0 && x < 12 && y >= 0 && y < 8) {
                    grid[y][x] = 1;  // Turn this LED on
                  }
                }
              }
            }
            Serial.println("Displaying led-display2 data on LED matrix");
            // Update the global grid and display it
            memcpy(currentGrid, grid, sizeof(grid));
            displayGrid(currentGrid);
          } else {
            Serial.print("Unhandled messageId: ");
            Serial.println(messageId);
            sendErrorMessage("Unhandled messageId");
          }
        } else {
          Serial.print("Ignored event: ");
          Serial.println(eventName);
          sendErrorMessage("Ignored event");
        }
      }
      break;

    default:
      break;
  }
}

void setup() {
  Serial.begin(115200);
  Serial.print("Connecting to WiFi ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("WiFi connected: ");
  Serial.println(WiFi.localIP());

  socket.begin(host, port, socketPath);
  socket.onEvent(socketEventCallback);

  // Initialize the LED matrix
  matrix.begin();
  // Initialize currentGrid with all off and display it
  memset(currentGrid, 0, sizeof(currentGrid));
  displayGrid(currentGrid);
}

void loop() {
  socket.loop();
}
