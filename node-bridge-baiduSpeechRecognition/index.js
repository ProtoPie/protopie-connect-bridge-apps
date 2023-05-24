const io = require("socket.io-client");
const PP_CONNECT_APP_NAME = "App name";
const PP_CONNECT_SERVER_ADDRESS = "http://localhost:9981";
const ppConnect = io(PP_CONNECT_SERVER_ADDRESS, {
  reconnectionAttempts: 5,
  timeout: 1000 * 10,
});

const request = require('request');
const AK = "YOUR_API_KEY";
const SK = "YOUR_SECRET_KEY";
const fs = require('fs');
const { spawn } = require('child_process');

let accessToken = null;

ppConnect
.on("connect", async () => {
  console.log("[PP-CONNECT] Connected to ProtoPie Connect on", PP_CONNECT_SERVER_ADDRESS);
  ppConnect.emit("ppBridgeApp", { name: PP_CONNECT_APP_NAME });
  sendMessageToConnect("BRIDGE_APP_READY", PP_CONNECT_APP_NAME);

  accessToken = await getAccessToken();
})
.on("ppMessage", async (message) => {
    console.log('[PP-CONNECT] Received a message from ProtoPie Connect', message);

    if (message.messageId === "recordVoice") {
      await processVoiceRecordingAndRecognition();
    }
  });

function sendMessageToConnect(messageId, value) {
  console.log(`[PP-CONNECT] Sending message '${messageId}:${value}' to ProtoPie Connect`);
  ppConnect.emit("ppMessage", {
    messageId,
    value
  });
}

ppConnect
.on("connect_error", (err) => {
  console.error("[PP-CONNECT] Connection error: ", err.toString());
})
.on("disconnect", (reason) => {
  console.log("[PP-CONNECT] Disconnected from ProtoPie Connect: ", reason);
});

ppConnect.io
.on("reconnect_attempt", (count) => {
  console.log("[PP-CONNECT] Retry connection attempt ", count);
})
.on("reconnect_failed", () => {
  console.error(`[PP-CONNECT] Connection to ProtoPie Connect failed. Is ProtoPie Connect running on ${PP_CONNECT_SERVER_ADDRESS} ?`);
});

function exit() {
  ppConnect.disconnect();
  process.exit();
}

process.on('SIGINT', function () {
  exit();
});

async function processVoiceRecordingAndRecognition() {
  const audioFilePath = "./audio.wav";
  await recordAudio(audioFilePath);

  const audioFileContent = fs.readFileSync(audioFilePath, { encoding: 'base64' });

  const options = {
    method: 'POST',
    url: 'https://vop.baidu.com/server_api',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      "format": "wav",
      "rate": 16000,
      "channel": 1,
      "cuid": "scdf",
      "token": accessToken,
      "speech": audioFileContent,
      "len": fs.statSync(audioFilePath).size
    })
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    const recognizedText = JSON.parse(response.body).result[0];
    console.log(recognizedText);
    sendMessageToConnect("RECOGNIZED_TEXT", recognizedText);
  });
}

function getAccessToken() {
  const options = {
    method: 'POST',
    url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`,
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(response.body).access_token);
      }
    });
  });
}

function recordAudio(audioFilePath) {
  return new Promise((resolve, reject) => {
    const audioStream = spawn('rec', ['-q', '-r', '16000', '-e', 'signed', '-b', '16', '-c', '1', audioFilePath]);

    audioStream.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    audioStream.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    audioStream.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      sendMessageToConnect("VOICERECORD_done", );
      resolve();
    });

    // Stop recording after 5 seconds
    setTimeout(() => {
      audioStream.kill('SIGINT');
    }, 3000);
  });
}


