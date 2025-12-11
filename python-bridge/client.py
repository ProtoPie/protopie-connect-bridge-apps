#!/usr/bin/env python3

import socketio
import fileinput
import sys

# Change the address below to yours
address = 'http://localhost:9981'

io = socketio.Client()

@io.on('connect')
def on_connect():
    print('[SOCKETIO] Connected to server')
    io.emit('ppBridgeApp', { 'name': 'python' })

@io.on('ppMessage')
def on_message(data):
    messageId = data['messageId']
    value = data['value'] if 'value' in data else None
    print('[SOCKETIO] Receive a Message from connect', data)

io.connect(address)

while 1:
  messageId = input('Please input a message id: ')
  value = input('Please input a value: ')

  print('\tSend ', messageId, ':', value, ' data to Connect');
  io.emit('ppMessage', {'messageId':messageId, 'value':value})
