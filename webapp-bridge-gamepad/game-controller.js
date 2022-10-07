class GameController {
  constructor() {
    this._controllers = {};
    this._handler = {};
    this._disconnect = true;
  }

  on(event, handler) {
    this._handler[event] = handler;
  }

  emit(event, params) {
    if (this._handler[event]) {
      this._handler[event](params);
    }
  }

  connect() {
    window.addEventListener('gamepadconnected', this._handleConnect.bind(this));
    window.addEventListener(
      'gamepaddisconnected',
      this._handleDisconnect.bind(this)
    );
  }

  disconnect() {
    this.emit('disconnect');

    window.removeEventListener('gamepadconnected', this._handleConnect);
    window.removeEventListener('gamepaddisconnected', this._handleDisconnect);

    this._handler = {};
    this._disconnect = true;
    this._controllers = {};
  }

  _handleConnect(e) {
    this.emit('connect');

    this._disconnect = false;
    this._controllers[e.gamepad.index] = e.gamepad;
    window.requestAnimationFrame(this._updateStatus.bind(this));
  }

  _handleDisconnect(e) {
    delete this._controllers[e.gamepad.index];
  }

  _updateStatus() {
    const gamepads = navigator.getGamepads();

    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i] && gamepads[i].index in this._controllers) {
        this._controllers[gamepads[i].index] = gamepads[i];
      }
    }

    this.emit('event', Array.from(Object.values(this._controllers)));

    !this._disconnect &&
      window.requestAnimationFrame(this._updateStatus.bind(this));
  }
}

window.Gamepad = Gamepad;
