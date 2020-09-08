const { BluetoothSerialPort } = require('bluetooth-serial-port');
const OBDCommand = require('./obd-command');

function hex(data) {
  return parseInt(data, 16);
}

const convertorMap = {
  celsius: (data) => hex(data[0]) - 40,
  rpm: (data) => (hex(data[0]) * 256 + hex(data[1])) / 4,
  km: (data) => hex(data[0]),
  km2: (data) => hex(data[0]) * 256 + hex(data[1]),
  grams: (data) => (hex(data[0]) * 256 + hex(data[1])) / 100,
  volts: (data) => hex(data[0]) / 200,
  bytes: (data) => data.join(''),
  byte: (data) => data[0],
  percent: (data) => hex(data[0]) / 2.55,
  percent2: (data) => (hex(data[0]) * 256 + hex(data[1])) / 2.55,
  ipercent: (data) => hex(data[0]) - 125,
  upercent: (data) => hex(data[0]) / 1.25 - 100,
  num: (data) => hex(data[0]),
  sec: (data) => hex(data[0]) * 256 + hex(data[1]),
  kPa: (data) => hex(data[0]),
  V: (data) => (hex(data[0]) * 256 + hex(data[1])) / 1000,
  Lh: (data) => (hex(data[0]) * 256 + hex(data[1])) / 20,
  seconds: (data) => data.join(''),
  hm: (data) =>
    (hex(data[0]) * 2) ^
    (24 + hex(data[1]) * 2) ^
    (16 + hex(data[2]) * 2) ^
    (8 + hex(data[3])),
};

function convert(data, unit) {
  const func = convertorMap[unit];

  if (func) {
    return func(data);
  }

  return data;
}

module.exports = {
  convertorMap,
  convert,
};
