const OBDCommand = require('../obd-command');

const obdCommand = new OBDCommand();

function verifyCommand(data) {
  console.log('Testing with', data, data.toString(), '...');
  const commands = obdCommand.write(Buffer.from(data));
  const command =
    commands.length > 0 ? JSON.stringify(commands[0]) : 'No commands';

  console.log(`    Result: ${command}`);
}

function testWithEcho() {
  [
    [0x41, 0x54, 0x5a, 0x0d],
    [
      0x0d,
      0x0d,
      0x45,
      0x4c,
      0x4d,
      0x33,
      0x32,
      0x37,
      0x20,
      0x76,
      0x31,
      0x2e,
      0x33,
      0x61,
      0x0d,
    ],
    [0x0d, 0x3e],
    [0x30, 0x31, 0x30, 0x35, 0x31, 0x0d],
    [0x34, 0x31, 0x20, 0x30, 0x35, 0x20, 0x30, 0x30, 0x20, 0x0d, 0x0d, 0x3e],
  ].forEach((data) => verifyCommand(data));
}

function testWithNoEcho() {
  [[0x34, 0x31, 0x30, 0x35, 0x30, 0x30, 0x0d, 0x0d, 0x3e]].forEach((data) => verifyCommand(data));
}

testWithEcho();
testWithNoEcho();
