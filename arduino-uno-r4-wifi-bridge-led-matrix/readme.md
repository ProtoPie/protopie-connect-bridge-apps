# Arduino UNO R4 WIFI LED Matrix Bridge App for ProtoPie Connect

This project demonstrates how to control the 8×12 LED matrix on the `Arduino UNO R4 WIFI` using `ProtoPie Connect`'s Socket.IO connection. The device receives messages from ProtoPie Connect and updates the LED matrix accordingly.

## Setup

1. **Install the Arduino IDE:**  
   Ensure you have the latest version of the Arduino IDE installed.

2. **Install Required Libraries:**  
   Use the Arduino Library Manager or download the libraries manually:

   - Go to **Sketch > Include Library > Manage Libraries...**
   - Search for and install the following:
     - [WebSockets](https://github.com/Links2004/arduinoWebSockets) by Markus Sattler (version ≥ 2.6.1)
     - [ArduinoJson](https://arduinojson.org/) by Benoit Blanchon (version ≥ 7.3.1)

3. **Configure Board:**  
   Select **Arduino UNO R4 WIFI** as your target board.

   Open the arduino source file and update the WiFi and Socket.IO configuration as needed:

   ```cpp
   const char* ssid = "your-ssid";
   const char* password = "your-password";
   const char* host = "192.168.125.102";  // ProtoPie Connect's IP
   const uint16_t port = 9981; // ProtoPie Connect's Port
   const char* socketPath = "/socket.io/?EIO=3";
   ```

4. **Upload the Code:**  
   Compile and upload the `arduino-uno-r4-wifi-led.ino` to your Arduino UNO R4 WIFI board.

5. **Use ProtoPie Connect to Load the Pie:**  
   Open ProtoPie Connect and load the `arduino-uno-r4-wifi-led.pie` file. Use it to control the led matrix on the Arduino. It has two types of control messages that one is **led-index:** and another one is **led-display:**

## How It Works

- **Event Handling:**  
  The `socketEventCallback` function processes incoming events:
  - **led-index:**  
    Receives a JSON string representing an array `[x, y, on]`. It updates the specified LED in the global grid and refreshes the display.
  - **led-display:**  
    Receives a JSON string representing an array of coordinate pairs (e.g. `[[x,y],[x,y],...]`). The code creates a new grid where only the specified LEDs are turned on, and the rest remain off.
  - For any unhandled event or error (e.g., parsing failures, invalid coordinates), an error message is sent back using the `ppMessage` event with `messageId` set to `"error"`.
