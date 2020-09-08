#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLE2902.h>

const char* SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const char* CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const int BLE_CHAR_FALGS = BLECharacteristic::PROPERTY_READ |
                             BLECharacteristic::PROPERTY_WRITE |
                             BLECharacteristic::PROPERTY_NOTIFY |
                             BLECharacteristic::PROPERTY_INDICATE;
                                         
BLECharacteristic *pCharacteristic;
BLEService *pService;

class BLECallback: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();

      if (value.length() > 0) {
        Serial.printf("New value: %s\n", value.c_str());
      }
    }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE work!");

  // Initializing Bluetooth
  BLEDevice::init("ESP32");

  // Creating server
  BLEServer *pServer = BLEDevice::createServer();
  pService = pServer->createService(SERVICE_UUID);

  // Creating charateristic
  pCharacteristic = pService->createCharacteristic(CHARACTERISTIC_UUID, BLE_CHAR_FALGS);
  pCharacteristic->addDescriptor(new BLE2902());
  pCharacteristic->setCallbacks(new BLECallback());
  
  // Start service
  pService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  BLEDevice::startAdvertising();
}

void loop() {
  String msg = String("ROTATE");
  pCharacteristic->setValue(msg.c_str());
  pCharacteristic->notify();

  Serial.printf("Send message: %s\n", msg.c_str());
  delay(2000);
}
