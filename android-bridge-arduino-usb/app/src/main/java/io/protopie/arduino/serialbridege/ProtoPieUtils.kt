package io.protopie.arduino.serialbridege

import android.content.Context
import android.content.Intent

object ProtoPieUtils {
    const val PROTOPIE_RECEIVE_ACTION = "io.protopie.action.ONE_TIME_RESPONSE"
    const val PROTOPIE_SEND_ACTION = "io.protopie.action.ONE_TIME_TRIGGER"

    fun sendToProtopie(context: Context, messageId: String?) {
        var intent = Intent(PROTOPIE_SEND_ACTION)
        intent.putExtra("messageId", messageId)
        context.sendBroadcast(intent)
    }
}