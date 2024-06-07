// On/Off Switch Config
#define ON_OFF_SW 2
unsigned long ON_OFF_lastButtonPress = 0;

// Rotary Encoder Config (Fan Control)
#define FCTRL_DT 3
#define FCTRL_CLK 4
int FCTRL_currentStateClk;
int FCTRL_lastStateClk;

// Built-in LED pin
#define LED_PIN 13
bool ledState = false;

void setup() {
  // Set On/Off Switch input
  pinMode(ON_OFF_SW, INPUT_PULLUP);

  // Set fan control encoder pins as inputs
  pinMode(FCTRL_CLK, INPUT);
  pinMode(FCTRL_DT, INPUT);

  // Set LED pin as output
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, ledState); // Initialize LED state

  // Setup Serial Monitor
  Serial.begin(115200);

  // Read the initial state of the encoder CLK pins
  FCTRL_lastStateClk = digitalRead(FCTRL_CLK);
}

void loop() {
  // Climate Control ON/OFF
  int onOffButtonState = digitalRead(ON_OFF_SW);
  if (onOffButtonState == LOW) {
    if (millis() - ON_OFF_lastButtonPress > 50) {
      Serial.println("ON_OFF");
    }
    ON_OFF_lastButtonPress = millis();
  }

  // Fan Control
  FCTRL_currentStateClk = digitalRead(FCTRL_CLK);
  if (FCTRL_currentStateClk != FCTRL_lastStateClk && FCTRL_currentStateClk == 1) {
    if (digitalRead(FCTRL_DT) != FCTRL_currentStateClk) {
      Serial.println("FAN_UP");
    } else {
      Serial.println("FAN_DOWN");
    }
  }
  FCTRL_lastStateClk = FCTRL_currentStateClk;

  // Check for serial input to control the LED
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    if (command == "FAN_LIGHT_ON_OFF") {
      ledState = !ledState; // Toggle the LED state
      digitalWrite(LED_PIN, ledState);
    }
  }

  // Put in a slight delay to help debounce the reading from the encoders
  delay(2);
}
