package io.protopie.arduino.serialbridege

import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.hardware.usb.UsbDevice
import android.hardware.usb.UsbManager
import android.os.IBinder
import android.os.Parcelable
import android.util.Log
import com.felhr.usbserial.UsbSerialDevice
import com.felhr.usbserial.UsbSerialInterface

class BridgeService : Service() {
    private var usbManager: UsbManager? = null
    private var currentDevice: UsbDevice? = null
    private var connectedSerialPort: UsbSerialDevice? = null
    private var bytesMessageReader = BytesMessageReader()
    private val TAG = "SERIAL-BRIDGE"

    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    override fun onCreate() {
        super.onCreate()

        usbManager = getSystemService(Context.USB_SERVICE) as UsbManager

        val filter = IntentFilter(ACTION_USB_PERMISSION)
        filter.addAction(ProtoPieUtils.PROTOPIE_RECEIVE_ACTION)
        filter.addAction(UsbManager.ACTION_USB_DEVICE_ATTACHED)
        filter.addAction(UsbManager.ACTION_USB_DEVICE_DETACHED)

        registerReceiver(broadcastReceiver, filter)

        Log.d(TAG, "Start bridge service")
    }

    private fun usbCheckPermission(device: UsbDevice) {
        currentDevice = device
        if (usbManager!!.hasPermission(device)) {
            usbCommunicate()
        } else {
            var pi = PendingIntent.getBroadcast(this, 0, Intent(ACTION_USB_PERMISSION), 0)
            usbManager!!.requestPermission(device, pi)
        }
    }
    private fun usbCommunicate() {
        MainActivity.Companion.sendToConsole(this@BridgeService, "Open device")
        var connection = usbManager!!.openDevice(currentDevice)

        MainActivity.Companion.sendToConsole(this@BridgeService,  "Open serial port")
        connectedSerialPort = UsbSerialDevice.createUsbSerialDevice(currentDevice, connection)
        connectedSerialPort!!.open()
        connectedSerialPort!!.setBaudRate(9600)
        connectedSerialPort!!.setDataBits(UsbSerialDevice.DATA_BITS_8)
        connectedSerialPort!!.setStopBits(UsbSerialDevice.STOP_BITS_1)
        connectedSerialPort!!.setParity(UsbSerialDevice.FLOW_CONTROL_OFF)
        connectedSerialPort!!.read(UsbSerialInterface.UsbReadCallback { bytes ->
            MainActivity.Companion.sendToConsole(this@BridgeService, "Read byte from usb serial $bytes")
            if (bytes.isNotEmpty()) {
                for (messageId in bytesMessageReader.read(bytes, bytes.size)) {
                    MainActivity.Companion.sendToConsole(this@BridgeService, "Message from Usb, $messageId")

                    ProtoPieUtils.sendToProtopie(this@BridgeService, messageId)
                    MainActivity.Companion.sendToConsole(this@BridgeService, "Send message to Protopie, $messageId")
                }
            }
        })
        connectedSerialPort!!.getCTS(UsbSerialInterface.UsbCTSCallback {b ->
            MainActivity.Companion.sendToConsole(this@BridgeService, "CTS changed: $b")
        })
        connectedSerialPort!!.getDSR(UsbSerialInterface.UsbDSRCallback {b ->
            MainActivity.Companion.sendToConsole(this@BridgeService, "DSR changed: $b")
        })
    }

    private fun usbDisconnect() {
        Log.d(TAG, "USB Disconnected")
        if (connectedSerialPort != null) {
            connectedSerialPort?.close()
            connectedSerialPort = null
        }

        if (currentDevice != null) {
            currentDevice = null
        }
    }

    private fun usbSendTo(data: ByteArray) {
        if (connectedSerialPort != null) {
            Log.d(TAG, "Send data via Serial Port")
            connectedSerialPort!!.write(data)
        }
    }
    
    private val broadcastReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent) {
            Log.d(TAG, "Receive action $intent.action on Service")
            if  (intent.action == ACTION_USB_PERMISSION) {
                var granted = intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)
                MainActivity.Companion.sendToConsole(this@BridgeService, "USB permission granted $granted")
                if(granted) {
                    usbCommunicate()
                }
            } else if (intent.action == UsbManager.ACTION_USB_DEVICE_ATTACHED) {
                MainActivity.Companion.sendToConsole(this@BridgeService, "USB device attached")
                var device = intent.getParcelableExtra<Parcelable>(UsbManager.EXTRA_DEVICE)
                if (device is UsbDevice) {
                    usbCheckPermission(device)
                }
            } else if (intent.action == UsbManager.ACTION_USB_DEVICE_DETACHED) {
                MainActivity.Companion.sendToConsole(this@BridgeService, "USB device detached")
                usbDisconnect()
            } else if (intent.action == ProtoPieUtils.PROTOPIE_RECEIVE_ACTION) {
                var messageId = intent.getStringExtra("messageId")
                MainActivity.Companion.sendToConsole(this@BridgeService, "Message from Protopie, $messageId")
                usbSendTo(messageId.toByteArray())
            }
        }
    }

    companion object {
        private val ACTION_USB_PERMISSION = BridgeService::class.java.canonicalName + ".USB_PERMISSION"
    }
}
