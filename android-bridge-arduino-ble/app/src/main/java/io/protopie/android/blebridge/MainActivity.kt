package io.protopie.android.blebridge

import android.bluetooth.*
import android.bluetooth.le.BluetoothLeScanner
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.ListView
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import java.util.*


const val TAG = "BLE-BRIDGE"
const val BLE_MODEL = "io.protopie.android.blebridge.BLE_MODEL"

class MainActivity : AppCompatActivity() {
    var devices = mutableListOf<String>()

    private lateinit var bluetoothAdapter: BluetoothAdapter
    private lateinit var bluetoothScanner: BluetoothLeScanner
    private lateinit var adapter: ArrayAdapter<*>

    private val scanCallback: ScanCallback = @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
    object : ScanCallback() {
        override fun onScanResult(
            callbackType: Int,
            result: ScanResult
        ) {
            var device = result.device
            val info = device.name + " - " + device.address

            if (devices.find { it == info } == null) {
                Log.d(TAG, "Found device: $info")
                devices.plusAssign(info)
                adapter.notifyDataSetChanged()
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        adapter = ArrayAdapter(this, R.layout.activity_listview, devices)

        val listView: ListView = findViewById<ListView>(R.id.mobile_list)
        listView.adapter = adapter
        listView.onItemClickListener =
            AdapterView.OnItemClickListener { _, _, position, _ ->
                var modelName = devices[position]
                Log.d(TAG, "OS is ${modelName}")
                var intent = Intent(this, BleGattView::class.java).apply {
                    putExtra(BLE_MODEL, modelName)
                }
                startActivity(intent)
            }

        Log.d(TAG, "Start scan")
        startScan()
    }

    @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
    fun startScan() {
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
        bluetoothScanner = bluetoothAdapter.bluetoothLeScanner
        bluetoothScanner.startScan(scanCallback)
    }
}
