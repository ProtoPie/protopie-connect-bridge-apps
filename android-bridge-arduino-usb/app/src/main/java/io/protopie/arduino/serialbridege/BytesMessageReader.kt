package io.protopie.arduino.serialbridege

import java.util.*

/**
 * Read messages from bytes read.
 * In this example app, a message is defined as string that starts with '<' and ends with '>'
 * This is used for bytes read from the USB serial.
 */
class BytesMessageReader {
    private var state = State.WAITING_COMMAND
    private val readingCommands = StringBuffer()
    /**
     * Called on data received and returns ProtoPie messages read.
     * @param data the byte array read from the USB serial
     * @param length the length of the bytes read
     * @return A list of messages. If no messages empty list. So you do not have to check null.
     */
    fun read(data: ByteArray, length: Int): List<String?> {
        var rv: MutableList<String?>? = null
        for (i in 0 until length) {
            val b = data[i]
            if (state == State.WAITING_COMMAND) {
                if (b == '<'.toByte()) {
                    state = State.READING_COMMAND
                    readingCommands.delete(0, readingCommands.length)
                }
            } else if (state == State.READING_COMMAND) {
                if (b == '>'.toByte()) {
                    if (rv == null) {
                        rv = ArrayList()
                    }
                    rv.add(readingCommands.toString())
                    readingCommands.delete(0, readingCommands.length)
                } else if (b == '<'.toByte()) {
                    readingCommands.delete(0, readingCommands.length)
                } else {
                    readingCommands.append(b.toChar())
                }
            }
        }
        return rv ?: emptyList<String>()
    }

    private enum class State {
        WAITING_COMMAND, READING_COMMAND
    }
}