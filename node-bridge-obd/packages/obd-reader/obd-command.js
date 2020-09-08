const OBDConvertor = require('./obd-convertor');
const OBDPIDS = require('./obd-pids.json');

const SERVICE01_PIDS = OBDPIDS['01'];
const SERIAL_MESSAGES = [
  'NO DATA',
  'OK',
  'SEARCHING...',
  'STOPPED',
  '?'
]

class OBDCommand {
  constructor() {
    this._buffer = '';
  }

  parse(buf) {
    this._buffer += buf.toString('utf8');
    const index = this._buffer.lastIndexOf('>');

    if (index > 0) {
      const commands = this._parse(this._buffer.slice(0, index));
      this._buffer = this._buffer.slice(index + 1, this._buffer.length);

      return commands;
    }

    return [];
  }

  _chunks(str, size = 2) {
    const count = Math.ceil(str.length / size);
    const chunks = new Array(count);

    for (let i = 0, o = 0; i < count; ++i, o += size) {
      chunks[i] = str.substr(o, size);
    }

    return chunks;
  }

  _parse(data) {
    const commands = [];
    // normalize data string
    // '01051\r41 05 00 \r\r' => [ [ '01', '05', '1' ], [ '41', '05', '00' ] ]
    const parsed = data
      .split('\r')
      .filter((c) => c !== '')
    
    if (SERIAL_MESSAGES.includes(parsed[1])) {
      return commands
    }

    const chunks = parsed.map((c) => this._chunks(c.trim().replace(/ /g, ''), 2));

    for (const c of chunks) {
      const mode = c[0];
      const pid = c[1];
      const parameter = SERVICE01_PIDS[pid];

      if (mode === '41' && parameter) {
        const command = {
          pid,
          value: c.slice(2, 2 + parameter.bytes),
        };

        if (parameter.unit) {
          command.value = OBDConvertor.convert(command.value, parameter.unit);
        }

        commands.push(command);
      }
    }

    return commands;
  }
}

module.exports = OBDCommand;
