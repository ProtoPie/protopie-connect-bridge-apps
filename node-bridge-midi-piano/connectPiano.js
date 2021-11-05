const easymidi = require('easymidi');

const connectPiano = () => {
  const pianos = easymidi
    .getInputs()
    .filter((instrument) => instrument === 'Digital Piano');

  return pianos[0] ? new easymidi.Input(pianos[0]) : null;
};

module.exports = connectPiano;
