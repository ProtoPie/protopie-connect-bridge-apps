const { BluetoothSerialPort } = require('bluetooth-serial-port');

function findOBD(name) {
  name = name.toLowerCase()
  return new Promise(response => {
    const port = new BluetoothSerialPort();
    port.listPairedDevices((devices) => {
      for (d of devices) {
        if (d.name.toLowerCase().includes(name)) {
          console.log(`[OBD] Found ODB device, ${d.name}`);
          response(d);
        }
      }

      throw new Error('Not found device for ODB ' + name);
    });
  });
}

module.exports = {
  findOBD,
};
