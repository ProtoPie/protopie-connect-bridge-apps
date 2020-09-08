const HID = require('node-hid');
const { EventEmitter } = require('events');
const { performance } = require('perf_hooks');

const XBOX_ELITE_PRODUCT_NAME = 'Xbox Elite Wireless Controller';

const XBoxElite2 = {
  product: 'Xbox Elite Wireless Controller',
  vendorId: 1118,
  productId: 2821,
};

function getControllerId(controller) {
  return `${controller.product} (STANDARD GAMEPAD Vendor: ${controller.vendorId} Product: ${controller.productId})`;
}

function radial(v, fixed = 4) {
  const r = (v / 127 - 1.0).toFixed(fixed);

  if (r > 1.0) {
    return 1.0;
  } else if (r < -1.0) {
    return -1.0;
  }

  return Number.parseFloat(r);
}

function byte2percent(v) {
  return Math.min(v / 255, 1.0);
}

class GamepadButton {
  constructor(pressed, value) {
    this.pressed = pressed;
    this.value = value;
  }
}

function dumpHex(data) {
  console.log('');

  for (let i = 0; i < data.length; i += 8) {
    let buf = '';
    for (let j = 0; j < 8; ++j) {
      buf +=
        ('0' + (i + j)).slice(-2) + ':' + ('00' + data[i + j]).slice(-3) + ' ';
    }
    console.log(buf);
  }

  console.log('');
}

function readAxis(data, offsets) {
  return {
    axes: offsets.map((o) => radial(data[o])),
  };
}

const buttonsMap = [
  { offset: 14, value: 1 }, // bottom button in right cluster
  { offset: 14, value: 2 }, // right button in right cluster
  { offset: 14, value: 8 }, // left button in right cluster
  { offset: 14, value: 16 }, // top button in right cluster
  { offset: 14, value: 64 }, // top left front button
  { offset: 14, value: 128 }, // top left right button
  { offset: 9, value: (v) => v > 0, predict: byte2percent }, // bottom left front button
  { offset: 11, value: (v) => v > 0, predict: byte2percent }, // bottom right front button
  { offset: 16, value: 1 }, // left button in center cluster
  { offset: 15, value: 8 }, // right button in center cluster
  { offset: 15, value: 32 }, // left stick pressed button
  { offset: 15, value: 64 }, // right stick pressed button
  { offset: 13, value: 1 }, // top button in left cluster
  { offset: 13, value: 5 }, // bottom button in left cluster
  { offset: 13, value: 7 }, // left button in left cluster
  { offset: 13, value: 3 }, // right button in left cluster
  { offset: 35, value: (v) => v > 0 }, // center button in center cluster
];

function readButtons(data) {
  const buttons = [];

  for (b in buttonsMap) {
    const m = buttonsMap[b];
    const v = data[m.offset];
    const pressed = typeof m.value === 'function' ? m.value(v) : v === m.value;

    buttons.push(
      new GamepadButton(pressed, pressed ? (m.predict ? m.predict(v) : v) : 0)
    );
  }

  return buttons;
}

class XBoxController extends EventEmitter {
  constructor() {
    super();

    this._controller = null;
    this._dumpHex = false;
    this._connected = false;
  }

  toggleDump(toggle) {
    this._dumpHex = toggle;
  }

  connect() {
    const { vendorId, productId } = XBoxElite2;

    this._controller = new HID.HID(vendorId, productId);
    if (!this._controller) {
      throw new Error('No device');
    }

    this._bindEvent();
    this._connected = true;

    this.emit('connect', {
      id: getControllerId(XBoxElite2),
    });
  }

  _handleEvent(data) {
    return [
      {
        index: 0,
        id: getControllerId(XBoxElite2),
        buttons: readButtons(data),
        ...readAxis(data, [2, 4, 6, 8]),
        connected: this._connected,
        timestamp: performance.now(),
        mapping: 'standard',
      },
    ];
  }

  _bindEvent() {
    this._controller.on('data', (data) => {
      this._dumpHex && dumpHex(data);

      if (data.length > 10) {
        this.emit('event', this._handleEvent(data));
      }
    });

    this._controller.on('error', (e) => {
      this.emit('error', e);
      this._connected = false;
    });
  }
}

module.exports = XBoxController;
