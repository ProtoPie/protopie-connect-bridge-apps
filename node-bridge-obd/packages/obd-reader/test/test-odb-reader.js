const {OBDReader, OBDDevices} = require('./obd-reader');


async function main(argv) {
  const reader = new OBDReader();
  await reader.connect(OBDDevices.OBDLinkMaxPlus);
}

main();