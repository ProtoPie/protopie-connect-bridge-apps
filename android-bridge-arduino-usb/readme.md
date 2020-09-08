# android-bridge-arduino-usb

> Android bridge app for Arduino with usb interface

# Arduino

## Setup

In the setup() function, set the baudrate to 9600.

```
Serial.begin(9600);
```

## Send message from Arduino to ProtoPie
Call Serial.print with a message enclosed by '<' and '>'

```
Serial.print("<MESSAGE1>");
```

In order to listen to this message in a pie, add a Receive trigger, change the channel to `Android Broadcast`, and enter the messageId.

## Send message from ProtoPie to Arduino

Add a Send response in your pie file, change the channel to Android Broadcast, and enter a messageId. When this response is executed, you can receive a messageId with Serial.read() on your Arduino side.

### Sample Arduino sketch

```
void setup() {
  pinMode(13, OUTPUT);
  pinMode(8, INPUT);
  Serial.begin(9600);
}

void loop() {
  static int lastSwVal = 0;
  
  // Send the status of switch to ProtoPie
  int swVal = digitalRead(8);
  if (swVal != lastSwVal) {
    if (swVal == 1) {
      Serial.println("<ON>");
    } else {
      Serial.println("<OFF>");
    }
    lastSwVal = swVal;
  }

  // Receive O or X from ProtoPie and turn a LED on or off
  while (Serial.available() > 0) {
    int b = Serial.read();

    if (b == 'O') {
      digitalWrite(13, HIGH);
    } else if (b == 'X') {
      digitalWrite(13, LOW);
    }
  }
}
```