void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);  // For USB communication with Android
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println("<ROTATE>"); // Send "SWITCH" to ProtoPie
  delay(2000);
}
