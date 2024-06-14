// On/Off Switch Config
#define ON_OFF_SW 2
unsigned long ON_OFF_lastButtonPress = 0;

// Rotary Encoder Config (Temperature Control)
#define TCTRL_DT 3
#define TCTRL_CLK 4
int TCTRL_currentStateClk;
int TCTRL_lastStateClk;
int tempCounter = 0;

// Built-in LED pin
#define LED_PIN 13
bool ledState = false;

void setup() {
  // Set On/Off Switch input
  pinMode(ON_OFF_SW, INPUT_PULLUP);

  // Set temperature control encoder pins as inputs
  pinMode(TCTRL_CLK, INPUT);
  pinMode(TCTRL_DT, INPUT);

  // Set LED pin as output
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, ledState); // Initialize LED state

  // Setup Serial Monitor
  Serial.begin(115200);

  // Read the initial state of the encoder CLK pins
  TCTRL_lastStateClk = digitalRead(TCTRL_CLK);
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

  // Temperature Control
  TCTRL_currentStateClk = digitalRead(TCTRL_CLK);
  if (TCTRL_currentStateClk != TCTRL_lastStateClk && TCTRL_currentStateClk == 1) {
    if (digitalRead(TCTRL_DT) != TCTRL_currentStateClk) {
      tempCounter++;
      Serial.print("TEMP_UP||");
      Serial.println(tempCounter);
    } else {
      tempCounter--;
      Serial.print("TEMP_DOWN||");
      Serial.println(tempCounter);
    }
  }
  TCTRL_lastStateClk = TCTRL_currentStateClk;

  // Check for serial input to control the LED
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    if (command == "TEMP_LIGHT_ON_OFF") {
      ledState = !ledState; // Toggle the LED state
      digitalWrite(LED_PIN, ledState);
    }
  }

  // Put in a slight delay to help debounce the reading from the encoders
  delay(2);
}
