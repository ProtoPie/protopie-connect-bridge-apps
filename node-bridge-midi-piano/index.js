const io = require('socket.io-client');
const connectSocket = require('./connectSocket');
const connectPiano = require('./connectPiano');
const PianoPlayer = require('./pianoPlayer');

const pianoPlayer = new PianoPlayer();

const notesByNumber = {
  72: 'C5',
  71: 'B4',
  70: 'Bb4',
  69: 'A4',
  68: 'Ab4',
  67: 'G4',
  66: 'Gb4',
  65: 'F4',
  64: 'E4',
  63: 'Eb4',
  62: 'D4',
  61: 'Db4',
  60: 'C4',
  59: 'B3',
  58: 'Bb3',
  57: 'A3',
  56: 'Ab3',
  55: 'G3',
  54: 'Gb3',
  53: 'F3',
  52: 'E3',
  51: 'Eb3',
  50: 'D3',
  49: 'Db3',
  48: 'C3',
};

const handleMessageReceive = (data) => {
  try {
    if (!data.value) {
      return;
    }

    const isPress = data.value[0] === 'p';
    const note = notesByNumber[data.value.slice(1)];

    if (isPress) {
      pianoPlayer.play(note);
      console.log(note);
    }
  } catch (e) {
    console.error(e.toString());
  }
};

const socket = connectSocket(io, 'http://localhost:9981', handleMessageReceive);
const pianoInput = connectPiano();

const handleNoteon = (message) => {
  console.log('noteon', message);

  const { note, velocity } = message;
  const isPress = velocity !== 0 ? 'p' : 'u';

  socket.emit('ppMessage', {
    messageId: 'noteon',
    value: `${isPress}${note}`,
  });
};

if (pianoInput) {
  console.log('connected to piano');
  pianoInput.on('noteon', handleNoteon);
} else {
  console.log('There is no connected piano. This app only receives messages.');
}
