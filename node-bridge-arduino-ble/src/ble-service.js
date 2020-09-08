const noble = require('@abandonware/noble');

function BLEService(opts) {
  this['sUUID'] = opts.sUUID;
  this['cUUID'] = opts.cUUID;
  this.eventHandler = function _on(type, data) {};
}

BLEService.prototype.on = function on(eventHandler) {
  this.eventHandler = eventHandler;
};

BLEService.prototype._emit = function emit(type, data) {
  this.eventHandler && this.eventHandler(type, data);
}

BLEService.prototype.reset = function reset() {
  this.characteristics = null;
  this.peripheral = null;
}

BLEService.prototype.start = function start() {
  console.log('this.sUUID', this, this.sUUID)
  noble.on('stateChange', state => {
    if (state === 'poweredOn') {
      this._emit('scan', state);
      noble.startScanning([this.sUUID]);
    } else {
      this._emit('stop', state);
      noble.stopScanning();
    }
  });

  noble.on('discover', peripheral => {
    this.peripheral = peripheral;
    this._emit('discover', peripheral);

    noble.stopScanning();
    peripheral.connect(error => {
      this._emit('connected', peripheral);

      peripheral.discoverSomeServicesAndCharacteristics(
        [this.sUUID],
        [this.cUUID],
        (error, services, characteristics) => {
          this.characteristics = characteristics;

          this.characteristics[0].on('data', (data, isNotification) => {
            this._emit('data', data)
          });

          this.characteristics[0].subscribe(error => {
            this._emit('error', error);
          });
        }
      );
    });

    peripheral.on('disconnect', () => this._emit('disconnect'));
  });
};

BLEService.prototype.write = function write(message) {
  const buf = Buffer.from(message, 'ascii');
  this._emit('write', buf);
  if (this.characteristics && this.characteristics.length > 0) {
    this.characteristics[0].write(buf, true);
  }
};

module.exports = BLEService;
