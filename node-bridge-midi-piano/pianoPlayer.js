const player = require("play-sound")((opts = {}));
const path = require("path");

const samplesPath = "./piano_samples";

module.exports = class PianoPlayer {
  constructor() {
    this.notes = {};
  }

  async play(note) {
    const sample = path.join(samplesPath, note + ".mp3");

    this.notes[note] = player.play(sample, (e) => {
      if (e) console.error(e);
    });
  }

  async stop(note) {
    this.notes[note].kill();
  }

  async wait(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
};
