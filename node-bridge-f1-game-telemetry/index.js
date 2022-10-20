import { F1TelemetryClient, constants } from '@racehub-io/f1-telemetry-client';
import io from 'socket.io-client';

const { PACKETS } = constants;
const address = 'http://localhost:9981';
const socket = io(address, {
  reconnectionAttempts: 5,
  timeout: 1000 * 10,
});

/*
*   'port' is optional, defaults to 20777
*   'bigintEnabled' is optional, setting it to false makes the parser skip bigint values,
*                   defaults to true
*   'forwardAddresses' is optional, it's an array of Address objects to forward unparsed telemetry to. each address object is comprised of a port and an optional ip address
*                   defaults to undefined
*   'skipParsing' is optional, setting it to true will make the client not parse and emit content. You can consume telemetry data using forwardAddresses instead.
*                   defaults to false
*/
const f1Client = new F1TelemetryClient({ port: 20777 });

process.on('SIGINT', function () {
  socket.disconnect();
  f1Client.stop();
  process.exit();
});

let playerIndex;
function init_f1_telemetry(socket) {
    for (const PACKET in PACKETS) {
      f1Client.on(PACKET, function (val) {
          //console.log('F1 Event', PACKET, JSON.stringify(val, (key, value) => (typeof value === 'bigint' ? value.toString() : value)));
          
          switch(PACKET){
            case PACKETS.session:
              playerIndex = val.m_header.m_playerCarIndex;
              sendPacketDataToConnect(socket, 'session_weather', val.m_weather);
              sendPacketDataToConnect(socket, 'session_trackTemperature', val.m_trackTemperature);
              sendPacketDataToConnect(socket, 'session_airTemperature', val.m_airTemperature);
              sendPacketDataToConnect(socket, 'session_totalLaps', val.m_totalLaps);
              sendPacketDataToConnect(socket, 'session_trackLength', val.m_trackLength);
              sendPacketDataToConnect(socket, 'session_sessionDuration', val.m_sessionDuration);
              sendPacketDataToConnect(socket, 'session_gamePaused', val.m_gamePaused);
              break;
            case PACKETS.lapData:
              playerIndex = val.m_header.m_playerCarIndex;
              sendPacketDataToConnect(socket, 'lap_lastLapTimeInMS', val.m_lapData[playerIndex].lastLapTimeInMS);
              sendPacketDataToConnect(socket, 'lap_currentLapTimeInMS', val.m_lapData[playerIndex].currentLapTimeInMS);
              sendPacketDataToConnect(socket, 'lap_currentLapNum', val.m_lapData[playerIndex].currentLapNum);
              sendPacketDataToConnect(socket, 'lap_carPosition', val.m_lapData[playerIndex].carPosition);
              sendPacketDataToConnect(socket, 'lap_lapDistance', val.m_lapData[playerIndex].lapDistance);
              sendPacketDataToConnect(socket, 'lap_totalDistance', val.m_lapData[playerIndex].totalDistance);
              break;
            case PACKETS.carTelemetry:
              playerIndex = val.m_header.m_playerCarIndex;
              sendPacketDataToConnect(socket, 'carTelemetry_speed', val.m_carTelemetryData[playerIndex].speed);
              sendPacketDataToConnect(socket, 'carTelemetry_throttle', val.m_carTelemetryData[playerIndex].throttle);
              sendPacketDataToConnect(socket, 'carTelemetry_steer', val.m_carTelemetryData[playerIndex].steer);
              sendPacketDataToConnect(socket, 'carTelemetry_brake', val.m_carTelemetryData[playerIndex].brake);
              sendPacketDataToConnect(socket, 'carTelemetry_clutch', val.m_carTelemetryData[playerIndex].clutch);
              sendPacketDataToConnect(socket, 'carTelemetry_gear', val.m_carTelemetryData[playerIndex].gear);
              sendPacketDataToConnect(socket, 'carTelemetry_engineRPM', val.m_carTelemetryData[playerIndex].engineRPM);
              sendPacketDataToConnect(socket, 'carTelemetry_drs', val.m_carTelemetryData[playerIndex].drs);
              sendPacketDataToConnect(socket, 'carTelemetry_revLightsPercent', val.m_carTelemetryData[playerIndex].revLightsPercent);
              sendPacketDataToConnect(socket, 'carTelemetry_revLightsBitValue', val.m_carTelemetryData[playerIndex].revLightsBitValue);
              sendPacketDataToConnect(socket, 'carTelemetry_brakesTemperature', `${val.m_carTelemetryData[playerIndex].brakesTemperature[0]},${val.m_carTelemetryData[playerIndex].brakesTemperature[1]},${val.m_carTelemetryData[playerIndex].brakesTemperature[2]},${val.m_carTelemetryData[playerIndex].brakesTemperature[3]}`);
              sendPacketDataToConnect(socket, 'carTelemetry_tyresSurfaceTemperature', `${val.m_carTelemetryData[playerIndex].tyresSurfaceTemperature[0]},${val.m_carTelemetryData[playerIndex].tyresSurfaceTemperature[1]},${val.m_carTelemetryData[playerIndex].tyresSurfaceTemperature[2]},${val.m_carTelemetryData[playerIndex].tyresSurfaceTemperature[3]}`);
              sendPacketDataToConnect(socket, 'carTelemetry_tyresInnerTemperature', `${val.m_carTelemetryData[playerIndex].tyresInnerTemperature[0]},${val.m_carTelemetryData[playerIndex].tyresInnerTemperature[1]},${val.m_carTelemetryData[playerIndex].tyresInnerTemperature[2]},${val.m_carTelemetryData[playerIndex].tyresInnerTemperature[3]}`);
              sendPacketDataToConnect(socket, 'carTelemetry_engineTemperature', val.m_carTelemetryData[playerIndex].engineTemperature);
              sendPacketDataToConnect(socket, 'carTelemetry_tyresPressure', `${val.m_carTelemetryData[playerIndex].tyresPressure[0]},${val.m_carTelemetryData[playerIndex].tyresPressure[1]},${val.m_carTelemetryData[playerIndex].tyresPressure[2]},${val.m_carTelemetryData[playerIndex].tyresPressure[3]}`);
              sendPacketDataToConnect(socket, 'carTelemetry_surfaceType', `${val.m_carTelemetryData[playerIndex].surfaceType[0]},${val.m_carTelemetryData[playerIndex].surfaceType[1]},${val.m_carTelemetryData[playerIndex].surfaceType[2]},${val.m_carTelemetryData[playerIndex].surfaceType[3]}`);
              break;
            case PACKETS.carStatus:
              playerIndex = val.m_header.m_playerCarIndex;
              sendPacketDataToConnect(socket, 'carStatus_tractionControl', val.m_carStatusData[playerIndex].tractionControl);
              sendPacketDataToConnect(socket, 'carStatus_antiLockBrakes', val.m_carStatusData[playerIndex].antiLockBrakes);
              sendPacketDataToConnect(socket, 'carStatus_fuelMix', val.m_carStatusData[playerIndex].fuelMix);
              sendPacketDataToConnect(socket, 'carStatus_frontBrakeBias', val.m_carStatusData[playerIndex].frontBrakeBias);
              sendPacketDataToConnect(socket, 'carStatus_pitLimiterStatus', val.m_carStatusData[playerIndex].pitLimiterStatus);
              sendPacketDataToConnect(socket, 'carStatus_fuelInTank', val.m_carStatusData[playerIndex].fuelInTank);
              sendPacketDataToConnect(socket, 'carStatus_fuelCapacity', val.m_carStatusData[playerIndex].fuelCapacity);
              sendPacketDataToConnect(socket, 'carStatus_fuelRemainingLaps', val.m_carStatusData[playerIndex].fuelRemainingLaps);
              sendPacketDataToConnect(socket, 'carStatus_maxRPM', val.m_carStatusData[playerIndex].maxRPM);
              sendPacketDataToConnect(socket, 'carStatus_idleRPM', val.m_carStatusData[playerIndex].idleRPM);
              sendPacketDataToConnect(socket, 'carStatus_maxGears', val.m_carStatusData[playerIndex].maxGears);
              break;
            case PACKETS.finalClassification:
              playerIndex = val.m_header.m_playerCarIndex;
              sendPacketDataToConnect(socket, 'final_totalCars', val.m_numCars);
              sendPacketDataToConnect(socket, 'final_position', val.m_classificationData[playerIndex].position);
              sendPacketDataToConnect(socket, 'final_numLaps', val.m_classificationData[playerIndex].numLaps);
              sendPacketDataToConnect(socket, 'final_gridPosition', val.m_classificationData[playerIndex].gridPosition);
              sendPacketDataToConnect(socket, 'final_points', val.m_classificationData[playerIndex].points);
              sendPacketDataToConnect(socket, 'final_numPitStops', val.m_classificationData[playerIndex].numPitStops);
              sendPacketDataToConnect(socket, 'final_resultStatus', val.m_classificationData[playerIndex].resultStatus);
              sendPacketDataToConnect(socket, 'final_bestLapTimeInMS', val.m_classificationData[playerIndex].bestLapTimeInMS);
              sendPacketDataToConnect(socket, 'final_totalRaceTime', val.m_classificationData[playerIndex].totalRaceTime);
              sendPacketDataToConnect(socket, 'final_penaltiesTime', val.m_classificationData[playerIndex].penaltiesTime);
              sendPacketDataToConnect(socket, 'final_numPenalties', val.m_classificationData[playerIndex].numPenalties);
              break;
          }
          // socket.emit('ppMessage', {
          //     messageId: PACKET,
          //     value: JSON.stringify(val, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
          // });
      });
    }
    console.log('Connecting to F1 Game');
    f1Client.start();
}

function sendPacketDataToConnect(socket, messageId, value){
  socket.emit('ppMessage', {
    messageId: messageId,
    value: value//JSON.stringify(val, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
  });
  //console.log('F1 Game to ppConnect', messageId, value);
}

socket.on('connect_error', (err) => {
  console.error('Socket disconnected, error', err.toString());
});

socket.on('connect_timeout', () => {
  console.error('Socket disconnected, timeout');
});

socket.on('reconnect_failed', () => {
  console.error('Socket disconnected, retry_timeout');
});

socket.on('reconnect_attempt', (count) => {
  console.error(
    `Retry to connect #${count}, Please make sure ProtoPie Connect is running on ${address}`
  );
});

socket.on('connect', () => {
  console.log('Socket has been connected to', address);
  socket.emit("ppBridgeApp", { name: "F1Telemetry" });
  init_f1_telemetry(socket);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('ppMessage', (data) => {
  console.log('Receive a message from Connect', data);
});
