import asyncio
import socketio
import serial_asyncio

# Define port names and baud rates for the two Arduinos
PORT_NAME_1 = '/dev/cu.usbmodem2301'  # Update with your actual port name
PORT_NAME_2 = '/dev/cu.usbmodem2101'  # Update with your actual port name
BAUDRATE = 115200

# Define the Socket.IO server address
address = 'http://localhost:9981'
sio = socketio.AsyncClient()

@sio.event
async def connect():
    print('Socket connected to', address)
    await sio.emit("ppBridgeApp", {'name': 'Dual Arduinos usb'})

@sio.event
async def disconnect():
    print('Socket disconnected')

@sio.on('ppMessage')
async def on_message(data):
    print('Message from connect. send to device', data)
    message_id = data.get('messageId')
    if message_id:
        if arduino1.transport:
            arduino1.transport.write((message_id + '\n').encode())
        if arduino2.transport:
            arduino2.transport.write((message_id + '\n').encode())

class ArduinoReaderProtocol(asyncio.Protocol):
    def __init__(self, port_name, sio):
        self.port_name = port_name
        self.sio = sio
        self.transport = None

    def connection_made(self, transport):
        self.transport = transport
        print(f'Connection made to {self.port_name}')

    def data_received(self, data):
        message = data.decode().strip()
        if message:
            # Parse the message and value using '||' delimiter
            if '||' in message:
                message_id, value = message.split('||', 1)
            else:
                message_id, value = message, None
            print(f'Message received from {self.port_name}:', message)
            msg = {
                "type": "ppMessage",
                "messageId": message_id,
                "value": value
            }
            asyncio.ensure_future(self.sio.emit('ppMessage', msg))

    def connection_lost(self, exc):
        print(f'Connection lost to {self.port_name}')
        self.transport = None

async def main():
    await sio.connect(address)

    loop = asyncio.get_running_loop()

    # Connect to Arduino 1
    global arduino1
    arduino1 = ArduinoReaderProtocol(PORT_NAME_1, sio)
    await serial_asyncio.create_serial_connection(loop, lambda: arduino1, PORT_NAME_1, baudrate=BAUDRATE)
    
    # Connect to Arduino 2
    global arduino2
    arduino2 = ArduinoReaderProtocol(PORT_NAME_2, sio)
    await serial_asyncio.create_serial_connection(loop, lambda: arduino2, PORT_NAME_2, baudrate=BAUDRATE)
    
    try:
        await sio.wait()
    except KeyboardInterrupt:
        print("Interrupted by user")
    finally:
        if arduino1.transport:
            arduino1.transport.close()
        if arduino2.transport:
            arduino2.transport.close()
        await sio.disconnect()

# Run the async main function
asyncio.run(main())
