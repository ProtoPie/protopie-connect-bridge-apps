const { BluetoothSerialPort } = require('bluetooth-serial-port');
const OBDCommand = require('./obd-command');
const { sleep } = require('../lib');

class OBDReader {
  constructor() {
    this._port = new BluetoothSerialPort();
    this._command = new OBDCommand();
    this._events = {};

    this._bindEvents();
  }

  _bindEvents() {
    this._port.on('found', (address, name) => {
      console.log('found', address, name);
    });

    this._port.on('finished', () => {
      console.log('finished');
    });

    this._port.on('closed', () => {
      console.log('closed');
    });

    this._port.on('failure', (e) => {
      console.log('failure', e);
    });
  }

  // http://www.obdtester.com/elm-usb-commands
  async reset() {
    // reset
    this.write('ATZ');
    await sleep(1000);

    // disable extra line and additional carrige return
    this.write('ATL0');
    await sleep(1000);

    // disable space in result
    this.write('ATS0');
    await sleep(1000);

    // turn off headers and checksum to be sent
    this.write('ATH0');
    await sleep(1000);

    // turn off echo
    this.write('ATE0');
    await sleep(1000);
  }

  async connect({ address, channel }) {
    this._port.connect(address, channel, async () => {
      this.reset();
      this._port.on('data', this.handleData.bind(this));
      this._emit('connect');
    });
  }

  on(event, callback) {
    this._events[event] = callback;
  }

  _emit(event, params) {
    const cb = this._events[event];
    if (cb) {
      cb(params);
    }
  }

  handleWriteResult(err, count) {
    if (err) {
      console.error('[OBD] Error on writing', err.toString());
    }
  }

  handleData(data) {
    console.log('[ODB] receve data', data, data.toString());
    const commands = this._command.parse(data);

    if (commands.length > 0) {
      this._emit('data', { commands });
    }
  }

  write(message) {
    this._port.write(
      new Buffer.from(message + '\r'),
      this.handleWriteResult.bind(this)
    );
  }
}

module.exports = OBDReader;
