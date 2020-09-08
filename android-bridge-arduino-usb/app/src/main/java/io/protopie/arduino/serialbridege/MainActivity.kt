package io.protopie.arduino.serialbridege

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.text.method.ScrollingMovementMethod
import android.util.Log
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.util.*

class MainActivity : AppCompatActivity() {
    private var consoleView: TextView? = null
    private val consoleLines: MutableList<String> = LinkedList()
    private val consoleText = StringBuilder()
    private val TAG = "SERIAL-BRIDGE"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        consoleView = findViewById<TextView>(R.id.console)
        consoleView?.movementMethod = ScrollingMovementMethod()

        startService(Intent(this, BridgeService::class.java))
        registerReceiver(broadcastReceiver, IntentFilter(ACTION_CONSOLE))

        writeToConsole("> Ready to receive")
    }

    private fun writeToConsole(message: String) {
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

        consoleView!!.text = consoleText
        consoleView!!.post {
            val scrollAmount = consoleView!!.layout.getLineTop(consoleView!!.lineCount) - consoleView!!.height
            consoleView!!.scrollTo(0, if (scrollAmount > 0) scrollAmount else 0)
        }
    }

    private val broadcastReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            Log.d(TAG, "Receive action $intent.action on MainActivity")
            if (ACTION_CONSOLE == intent.action) {
                val message = intent.getStringExtra(CONSOLE_STRING_KEY)
                message?.let { writeToConsole(it) }
            }
        }
    }

    companion object {
        private const val MAX_CONSOLE_LINES = 100
        private val ACTION_CONSOLE = MainActivity::class.java.canonicalName + ".CONSOLE"
        private const val CONSOLE_STRING_KEY = "message"
        private const val TAG = "SERIAL-BRIDGE"

        fun sendToConsole(context: Context, message: String?) {
            Log.d(TAG, "Console intent got a message, $message")
            val intent = Intent(ACTION_CONSOLE)
            intent.putExtra(CONSOLE_STRING_KEY, "> $message")
            context.sendBroadcast(intent)
        }
    }
}
