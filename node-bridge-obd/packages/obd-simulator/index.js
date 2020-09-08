const simulatorData = require('./simulator.json');

class OBDSimulator {
  constructor() {
    this._index = 0;
  }

  next() {
    if (this._index + 1 > simulatorData.length) {
      this._index = 0;
    }

    return simulatorData[this._index++];
  }
}

module.exports = {
  OBDSimulator,
};
