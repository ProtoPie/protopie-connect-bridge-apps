package io.protopie.android.blebridge

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.util.*

const val MAX_CONSOLE_LINES = 100

class BleGattView : AppCompatActivity() {
    private lateinit var consoleView: TextView
    private val consoleLines: MutableList<String> = LinkedList()
    private val consoleText = StringBuilder()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_ble_gatt_view)

        var model = intent.getStringExtra(BLE_MODEL).split(" - ")
        consoleView = findViewById<TextView>(R.id.consoleView).apply {
            text = "${model[0]} has ${model[1]}"
        }

        var intend = Intent(this, BridgeService::class.java)
        intend.putExtra("model", model[1])
        startService(intend)

        registerReceiver(broadcastReceiver, IntentFilter(ACTION_CONSOLE))
    }

    private fun writeToConsole(message: String) {
        Log.d(TAG, message)
        consoleLines.add(message)

        while (consoleLines.size > MAX_CONSOLE_LINES) {
            consoleLines.removeAt(0)
        }

        consoleText.delete(0, consoleText.length)

        for (i in consoleLines.indices) {
            if (i > 0) {
                consoleText.append("\n")
            }
            consoleText.append(consoleLines[i])
        }

        Handler(Looper.getMainLooper()).post(Runnable {
            consoleView.text = consoleText
            consoleView.post {
                val scrollAmount = consoleView.layout.getLineTop(consoleView.lineCount) - consoleView.height
                consoleView.scrollTo(0, if (scrollAmount > 0) scrollAmount else 0)
            }
        })
    }

    private val broadcastReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            if (ACTION_CONSOLE == intent.action) {
                val message = intent.getStringExtra(CONSOLE_STRING_KEY)
                message?.let { writeToConsole(it) }
            }
        }
    }

    companion object {
        private val ACTION_CONSOLE = MainActivity::class.java.canonicalName + ".CONSOLE"
        private const val CONSOLE_STRING_KEY = "message"

        fun sendToConsole(context: Context, message: String?) {
            val intent = Intent(ACTION_CONSOLE)
            intent.putExtra(CONSOLE_STRING_KEY, "$message")
            context.sendBroadcast(intent)
        }
    }
}
