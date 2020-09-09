const io = require('socket.io-client')
const g = require('logitech-g29')
const address = 'http://localhost:9981'
const socket = io(address)

process.on('SIGINT', function() {
  socket.disconnect()
  g.disconnect()
  process.exit()
})

function init_g29(socket) {
  const events = [
    'wheel-turn',
    'wheel-shift_left',
    'wheel-shift_right',
    'wheel-dpad',
    'wheel-button_x',
    'wheel-button_square',
    'wheel-button_triangle',
    'wheel-button_circle',
    'wheel-button_l2',
    'wheel-button_r2',
    'wheel-button_l3',
    'wheel-button_r3',
    'wheel-button_plus',
    'wheel-button_minus',
    'wheel-spinner',
    'wheel-button_spinner',
    'wheel-button_share',
    'wheel-button_option',
    'wheel-button_playstation'
  ]

  for (const event of events) {
    g.on(event, function(val) {
      console.log('G29 Event', event, val)
      socket.emit('ppMessage', {
        messageId: event,
        value: val
      })
    })
  }

  console.log('Connect to G29')
  g.connect(
    {
      debug: false
    },
    function(err) {
      console.log(`err`, err)
    }
  )
}

socket.on('connect', () => {
  console.log('Socket has been connected to', address)
  init_g29(socket)
})

socket.on('disconnect', () => {
  console.log('Socket disconnected')
})

socket.on('ppMessage', data => {
  console.log('Receive a message from Connect', data)
  g.leds('')
  g.leds(data.value)
})
