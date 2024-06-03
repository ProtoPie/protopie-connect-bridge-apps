void setup() {
  // For USB communication
  Serial.begin(9600);
}

String message = "";

void loop() {
  // Send data only when you receive data:
  if (Serial.available() > 0) {
    // read the message
    message = Serial.readStringUntil('\n'); // Assuming messages are newline-terminated

    // Check if the message starts with "arduino-1" or "broadcast-"
    if (message.startsWith("arduino-1") || message.startsWith("broadcast-")) {
      // echo what you got
      Serial.println(message);
    }
    Serial.flush();
  } 
}