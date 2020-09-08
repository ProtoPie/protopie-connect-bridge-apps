package io.protopie.android.blebridge

import android.app.Service
import android.bluetooth.*
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.IBinder
import android.util.Log
import java.util.*

val UUID_SERVICE: UUID = UUID.fromString("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
var UUID_CHAR: UUID = UUID.fromString("beb5483e-36e1-4688-b7f5-ea07361b26a8")
val UUID_NOTIFY: UUID = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
const val PROTOPIE_RECEIVE_ACTION = "io.protopie.action.ONE_TIME_RESPONSE"
const val PROTOPIE_SEND_ACTION = "io.protopie.action.ONE_TIME_TRIGGER"


class BridgeService : Service() {
    private lateinit var bluetoothAdapter: BluetoothAdapter
    private lateinit var bluetoothGatt: BluetoothGatt
    private lateinit var bluetoothGattCharacteristic: BluetoothGattCharacteristic

    companion object {
        private val ACTION_BT_PERMISSION = BridgeService::class.java.canonicalName + ".BT_PERMISSION"
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val model = intent!!.getStringExtra("model")

        writeToConsole("> Connecting to the device $model")

        connect(model)

        return super.onStartCommand(intent, flags, startId)
    }

    override fun onCreate() {
        super.onCreate()

        val filter = IntentFilter(ACTION_BT_PERMISSION)
        filter.addAction(PROTOPIE_RECEIVE_ACTION)

        registerReceiver(broadcastReceiver, filter)
    }

    private fun connect(modelAddress: String) {
        writeToConsole("> Attemping to connect device: $modelAddress")

        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter()

        var device = bluetoothAdapter.getRemoteDevice(modelAddress)
        bluetoothGatt = device.connectGatt(this, true, gattCallback);
        bluetoothGatt.connect()
    }

    private fun writeToConsole(message: String) {
        BleGattView.sendToConsole(this@BridgeService, message)
    }

    private val gattCallback: BluetoothGattCallback = object : BluetoothGattCallback() {
        override fun onConnectionStateChange(
            gatt: BluetoothGatt,
            status: Int,
            newState: Int
        ) {
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                writeToConsole("> Connected to GATT server.")
                bluetoothGatt.discoverServices()
                writeToConsole("> Attempting to start service discovery")
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                writeToConsole("> Disconnected from GATT server.")
            }
        }

        fun getSupportedGattServices() {
            if (bluetoothGatt == null) {
                return
            }

            val gattServices = bluetoothGatt.services
            for (gattService in gattServices) {
                var sUUID = gattService.uuid.toString()
                writeToConsole("> Found GATT Service: $sUUID")

                val gattCharacteristics = gattService.characteristics
                for (gattCharacteristic in gattCharacteristics) {
                    val uuid = gattCharacteristic.uuid.toString()

                    writeToConsole("> Found Characteristic: $uuid")
                    if (uuid.toLowerCase() == UUID_CHAR.toString()) {
                        bluetoothGattCharacteristic = gattCharacteristic
                        bluetoothGatt.setCharacteristicNotification(bluetoothGattCharacteristic, true)
                        writeToConsole("> Set Notification: $uuid")

                        val descriptor = bluetoothGattCharacteristic.getDescriptor(UUID_NOTIFY)
                        if (descriptor != null) {
                            writeToConsole("> Write Descriptor: ${descriptor.uuid}")
                            descriptor.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                            bluetoothGatt.writeDescriptor(descriptor)
                        }
                    }
                }
            }
        }

        fun sendToProtopie(messageId: String?) {
            var intent = Intent(PROTOPIE_SEND_ACTION)
            intent.putExtra("messageId", messageId)
            this@BridgeService.sendBroadcast(intent)
        }

        override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
            if (status == BluetoothGatt.GATT_SUCCESS) {
                writeToConsole("> Discovered service : $status")
                getSupportedGattServices()
            }
        }

        override fun onCharacteristicRead(
            gatt: BluetoothGatt,
            characteristic: BluetoothGattCharacteristic,
            status: Int
        ) {
            if (status == BluetoothGatt.GATT_SUCCESS) {
                writeToConsole("> Read: ${String(characteristic.value)}")
            }
        }

        override fun onCharacteristicChanged(
            gatt: BluetoothGatt,
            characteristic: BluetoothGattCharacteristic
        ) {
            var messageId = String(characteristic.value)
            writeToConsole("> Message Id from device $messageId")
            sendToProtopie(messageId)
        }

        override fun onCharacteristicWrite(
            gatt: BluetoothGatt,
            characteristic: BluetoothGattCharacteristic, status: Int
        ) {
            super.onCharacteristicWrite(gatt, characteristic, status)
            writeToConsole("> Write ${String(characteristic.value)}")
        }
    }

    private val broadcastReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent) {
            Log.d(TAG, "Receive action $intent.action on Service")
            if (intent.action == PROTOPIE_RECEIVE_ACTION) {
                var messageId = intent.getStringExtra("messageId")
                writeToConsole("> Message Id from protopie $messageId")

                bluetoothGattCharacteristic.setValue(messageId)
                bluetoothGatt.writeCharacteristic(bluetoothGattCharacteristic)
            }
        }
    }
}