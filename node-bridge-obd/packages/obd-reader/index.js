const OBDReader = require('./obd-reader');
const OBDCommand = require('./obd-command');

const OBDDevices = {
  OBDLinkMaxPlus: {
    address: '00-04-3e-96-28-a9',
    channel: 1,
  },
};

module.exports = {
  OBDReader,
  OBDCommand,
  OBDDevices,
};
