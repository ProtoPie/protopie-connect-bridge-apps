const io = require('socket.io-client');
const { OBDReader, findOBD } = require('./packages/obd-reader');
const { ConnectClient } = require('./packages/connect-client');
const { OBDSimulator } = require('./packages/obd-simulator');
const { sleep } = require('./packages/lib');

const sim = process.argv.includes('--sim');

const address = 'http://localhost:9981';
const requestInterval = 500;
const requestPIDS = [
  // Variable value from simulator
  '05', // Engine coolant temperature
  '0C', // Engine speed
  '0D', // Vehicle speed
  '10', // Mass air flow sensor (MAF) air flow rate
  '14', // Oxygen Sensor Voltage
  // Fiexed value from simulator
  '01', // Monitors/DTC Count/MIL
  '03', // Fuel system status, https://en.wikipedia.org/wiki/OBD-II_PIDs#Service_01_PID_03
  '04', // Calculated Load Value
  '06', // Short term fuel trim—Bank 1
  '07', // Long term fuel trim—Bank 1
  '0F', // Intake air temperature
  '13', // Location of Oxygen Sensors
  '1C', // OBD Type
  '1F', // Run time since engine start
  '21', // Distance Traveled While MIL is Activated
  '2F', // Fuel Tank Level Input
  '33', // Absolute Barometric Pressure
  '42', // Control Module Voltage
  '46', // Ambient Air Temperature
  // High priorities
  '45', // Relative throttle position
  '51', // Fuel Type
  '5A', // Relative accelerator pedal position
  '5C', // Engine oil temperature
  '5E', // Engine fuel rate
  '61', // Driver's demand engine - percent torque
  '62', // Actual engine - percent torque
  '7F', // Engine run time
  'A6', // Odometer
  null, // STOPPER
  // Low priorities
  '08', // Short term fuel trim—Bank 2
  '09', // Long term fuel trim—Bank 2
  '0A', // Fuel pressure
  '15', // Oxygen sensors present (in 2 banks)
  '47', // Absolute throttle position B
  '48', // Absolute throttle position C
  '49', // Accelerator pedal position D
  '4A', // Accelerator pedal position E
  '4B', // Accelerator pedal position F,
  '52', // Ethanol fuel %
  '5B', // Hybrid battery pack remaining life
  '63', // Engine reference torque
  '64', // Engine percent torque data
  '9D', // Engine Fuel Rate
  'A4', // Transmission Actual Gear
  null, // STOPPER
];

const connect = new ConnectClient(io, address, {
  timeout: 2000,
});
const reader = new OBDReader();

function sendMessage(messageId, value) {
  console.log(`[Connect] Send messageId: ${messageId} value: ${value}`);
  connect.send(messageId, value);
}

async function runOBDReader() {
  try {
    console.log('[OBD] Scanning ...');

    const address = await findOBD('OBD');
    await reader.connect(address);

    reader.on('data', ({ commands }) => {
      for (let i = 0; i < commands.length; ++i) {
        sendMessage(commands[0].pid, commands[0].value);
      }
    });

    reader.on('connect', () => {
      console.log('[OBD] Connected');
      setInterval(() => {
        let i = 0;
        while (requestPIDS[i]) {
          reader.write(`01${requestPIDS[i++]}1`);
          sleep(50);
        }
      }, requestInterval);
    });
  } catch (e) {
    console.log('[OBD]', e.toString());
    process.exit(-1);
  }
}

function runOBDSimulator() {
  const simulator = new OBDSimulator();

  setInterval(() => {
    const command = simulator.next();
    sendMessage(command.pid, command.value);
  }, requestInterval);
}

async function main(argv) {
  console.log('[Connect] Connecting to', address);

  connect.on('connect', async () => {
    console.log('[Connect] Connected to', address);

    if (!sim) {
      console.log('[Main] OBDReader started');
      await runOBDReader();
    } else {
      console.log('[Main] Simulator started');
      runOBDSimulator();
    }
  });

  connect.on('error', (e) => {
    console.error('[Connect] error,', e.toString());
    process.exit(-1);
  });

  connect.connect();
}

main();

process.on('uncaughtException', (err) => {
  console.error('Error,', err.message);
  process.exit(-1);
});
