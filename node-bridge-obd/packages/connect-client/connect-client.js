class ConnectClient {
  constructor(io, address, opts = {}) {
    this._io = io;
    this._address = address;
    this._opts = opts;
    this._socket = null;
    this._events = {};
  }

  connect(address) {
    this._socket = this._io(this._address);
    this._bindEvents();
  }

  disconnect() {
    if (this._socket) {
      this._socket.disconnect();
    }
  }

  on(event, callback) {
    this._events[event] = callback;
  }

  _emit(event, params) {
    const cb = this._events[event];
    if (cb) {
      cb(params);
    }
  }

  _bindEvents() {
    this._socket.on('connect', () => {
      this._socket.emit('ppBridgeApp', { name: 'OBD2' });
      this._emit('connect');
    });
    this._socket.on('disconnect', () => this._emit('disconnect'));
    this._socket.on('ppMessage', (message) => this._emit('message', message));

    ['connect_timeout', 'error', 'connect_error'].forEach((err) => {
      this._socket.on(err, (e) => this._emit('error', e));
    });
  }

  send(messageId, value) {
    if (this._socket) {
      this._socket.emit('ppMessage', {
        messageId,
        value: typeof value === 'object' ? JSON.stringify(value) : value,
      });
    }
  }
}

if (typeof window !== 'undefined') {
  window.ConnectClient = ConnectClient;
} else {
  module.exports = ConnectClient;
}
