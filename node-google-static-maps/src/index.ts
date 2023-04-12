import io from 'socket.io-client';
import * as fs from 'fs';
import * as os from 'os';
import { KEY, SECRET } from './config.cjs';
import * as urlSigner from './urlSigner.cjs';

//console.log('key', KEY);
//console.log('secret', SECRET);

const OS_TYPE = os.type();

let ppDataLocationMac = `/Users/${
  os.userInfo().username
}/Library/Application Support/ProtoPie Connect/data`;
let ppDataLocationWin = `C:\\Users\\${
  os.userInfo().username
}\\AppData\\Roaming\\ProtoPie Connect\\data`;
let ppDataLocationLinux = './data/log';
let ppDataLocation =
  OS_TYPE === 'Darwin'
    ? ppDataLocationMac
    : OS_TYPE === 'Windows_NT'
    ? ppDataLocationWin
    : ppDataLocationLinux;

const address = 'http://localhost:9981';
const socket = io(address, {
  reconnectionAttempts: 5,
  timeout: 1000 * 10,
});

console.log('Hello Google Static Maps Dynamic loading PoC!');

process.on('SIGINT', function () {
  socket.disconnect();
  process.exit();
});

function updatePPConnectData(
  pieId: string,
  sceneNumber: string,
  containerName: string,
  imageName: string,
  api: string
) {
  const ppPieDataFile = `${ppDataLocation}/pies/${pieId}/data.json`;
  let content = JSON.parse(fs.readFileSync(ppPieDataFile, 'utf8'));
  console.log(
    `pieId: ${pieId}, sceneNumber: ${sceneNumber}, containerName: ${containerName}, imageName: ${imageName}, api: ${api}`
  );

  if (containerName) {
    content.scenes
      .filter((scene) => scene.name === `Scene ${sceneNumber}`)[0]
      .layers.filter((layer) => layer.name === containerName)[0]
      .children.filter(
        (children) => children.name === imageName
      )[0].fillResourceId = api;
  } else {
    content.scenes
      .filter((scene) => scene.name === `Scene ${sceneNumber}`)[0]
      .layers.filter((layer) => layer.name === imageName)[0].fillResourceId =
      api;
  }

  try {
    fs.writeFileSync(ppPieDataFile, JSON.stringify(content));
    console.log(`Updated ${ppPieDataFile}`);
  } catch (error) {
    console.error('Error modifying content.' + error);
  }
}

function formulateAPI(url: string) {
  if (SECRET) return urlSigner.sign(url + `&key=${KEY}`, SECRET);
  else return url + `&key=${KEY}`;
}

function sendMsgValToConnect(socket, messageId, value) {
  socket.emit('ppMessage', {
    messageId: messageId,
    value: value,
  });
  console.log('App to ppConnect =>', messageId, value);
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
  //init
  console.log('Socket has been connected to', address);
  socket.emit('ppBridgeApp', { name: 'GoogleStaticMaps' });
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('ppDataLocation', (data) => {
  //receive ProtoPie Data location
  if (!data) return;
  ppDataLocation = data;
  console.log(`ppDataLocation update to ${ppDataLocation}`);
});

socket.on('ppMessage', (data) => {
  console.log('Receive an googleStaticMaps message from Connect', data);
  if (data.messageId == 'googleStaticMaps') {
    const jsonObject = JSON.parse(data.value);

    if (
      !jsonObject.pieId ||
      !jsonObject.scene ||
      !jsonObject.image ||
      !jsonObject.api
    )
      return;

    const api = formulateAPI(jsonObject.api);
    updatePPConnectData(
      jsonObject.pieId,
      jsonObject.scene,
      jsonObject.container === '' || jsonObject.container == null
        ? null
        : jsonObject.container,
      jsonObject.image,
      api
    );
  }
});
