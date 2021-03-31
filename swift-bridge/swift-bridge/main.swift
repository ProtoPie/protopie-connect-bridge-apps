import Foundation
import SocketIO


print("Initialzing...")
let manager = SocketManager(socketURL: URL(string:"http://192.168.0.33:9981")!, config: [.log(true), .compress, .reconnects(false), .forceWebsockets(true)])
let defaultNamespaceSocket = manager.defaultSocket
let socket = manager.defaultSocket

socket.on(clientEvent: .connect) {data, ack in
    print("Socket connected")
    
    socket.emit("ppMessage", [
                    "messageId": "event",
                    "value": "connected"
    ])
}

socket.on(clientEvent: .error) {err, ack in
    print("Socket connected failed\(err)")
}

socket.on("ppMessage") {data, ack in
    print("Get message from ProtoPie Connect\(data)")
}

socket.connect()


RunLoop.main.run()
