const { BluetoothSerialPort } = require('bluetooth-serial-port');

function findOBD(name) {
  name = name.toLowerCase()
  return new Promise(response => {
    const port = new BluetoothSerialPort();
    port.listPairedDevices((devices) => {
      for (d of devices) {
        if (d.name.toLowerCase().includes(name)) {
          console.log(`${d.name} is found for OBD`)
          response(d.address);
        } else {
          console.log(`${d.name} is not found for OBD`)
        }
      }

      throw new Error('Not found device with ' + name);
    });
  });
}

module.exports = {
  findOBD,
};
