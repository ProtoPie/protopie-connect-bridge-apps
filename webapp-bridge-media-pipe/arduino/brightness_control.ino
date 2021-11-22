#include <string.h>

struct MessageValue {
  String message;
  String value;
};

struct MessageValue getMessage(String inputtedStr) {
  struct MessageValue result;

  char charArr[50];
  inputtedStr.toCharArray(charArr, 50);
  char* ptr = strtok(charArr, "||");
  result.message = String(ptr);
  ptr = strtok(NULL, "||");

  if (ptr == NULL) {
    result.value = String("");
    return result;
  }

  result.value = String(ptr);

  return result;
}

int firstLED = 3;
int secondLED = 5;
int thirdLED = 6;
struct MessageValue receivedData;

void setup() {
  pinMode(firstLED, OUTPUT);
  pinMode(secondLED, OUTPUT);
  pinMode(thirdLED, OUTPUT);
  Serial.begin(9600);
  Serial.setTimeout(10);
}

void loop() {
  while (Serial.available() > 0) {
    String receivedString = Serial.readStringUntil('\0');
    receivedData = getMessage(receivedString);
  }

  if (receivedData.message.equals("first")) {
    analogWrite(firstLED, receivedData.value.toInt());
  } else if (receivedData.message.equals("second")) {
    analogWrite(secondLED, receivedData.value.toInt());
  } else {
    analogWrite(thirdLED, receivedData.value.toInt());
  }
}
