function args() {
  const i = process.argv.findIndex((a) => a.includes('--data'));
  if (i > -1) {
    return `./${process.argv[i].split('=')[1]}`
  } else {
    return './simulator.json'
  }
}

const simulatorData = require(args() || './simulator2.json');

class OBDSimulator {
  constructor() {
    this._index = 0;
  }

  next() {
    if (this._index + 1 > simulatorData.length) {
      this._index = 0;
    }

    const data = simulatorData[this._index++];
    return {
      pid: data.pid,
      value: data.value.toString(),
    };
  }
}

module.exports = {
  OBDSimulator,
};
