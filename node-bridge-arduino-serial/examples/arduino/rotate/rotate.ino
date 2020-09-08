void setup() {
  // For USB communication
  Serial.begin(9600);
}

String message = "";

void loop() {
  // Send data only when you receive data:
  if (Serial.available() > 0) {
    // read the message
    message = Serial.readString();
    // echo what you got
    Serial.println(message);
    Serial.flush();
  } 
}
