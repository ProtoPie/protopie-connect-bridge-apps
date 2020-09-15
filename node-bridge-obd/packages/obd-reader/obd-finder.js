const { BluetoothSerialPort } = require('bluetooth-serial-port');

function findOBD(name) {
  return new Promise(response => {
    const port = new BluetoothSerialPort();
    port.listPairedDevices((devices) => {
      for (d of devices) {
        if (d.name.toLowerCase().includes(name)) {
          response(d.address);
        }
      }

      throw new Error('Not found device with ' + name);
    });
  });
}

module.exports = {
  findOBD,
};
