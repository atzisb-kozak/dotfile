import * as spi from 'spi-device';

interface CONFIG_MCP{
  readonly channelCount: number,
  readonly maxRawValue: number,
  readonly defaultSpeedHz: number,
  readonly transferLength: number,
  readChannelCommand(channel: number): Buffer
  rawValue(buffer: Buffer): number
}

interface OptionMcp {
  busNumber?: number;
  deviceNumber?: number;
  speedHz?: number;
}

interface Reading {
  rawValue: number;
  value: number;
}

class CONFIG_MCP3008 implements CONFIG_MCP {
  readonly channelCount: 8;
  readonly maxRawValue: 1023;
  readonly defaultSpeedHz: 1350000; // See MCP3008 datasheet. 75000 * 18 = 1350000.
  readonly transferLength: 3;
  readChannelCommand(channel: number) {
    return Buffer.from([0x01, 0x80 + (channel << 4), 0x00]);
  }
  rawValue (buffer: Buffer) {
    return ((buffer[1] & 0x03) << 8) + buffer[2];
  }
}

class CONFIG_MCP3004 implements CONFIG_MCP {
  readonly channelCount: 4;
  readonly maxRawValue: 1023;
  readonly defaultSpeedHz: 1350000; // See MCP3004 datasheet. 75000 * 18 = 1350000.
  readonly transferLength: 3;
  readChannelCommand (channel: number) {
     return Buffer.from([0x01, 0x80 + (channel << 4), 0x00]);
  }
  rawValue(buffer: Buffer) {
    return ((buffer[1] & 0x03) << 8) + buffer[2];
  }
}


class CONFIG_MCP3002 implements CONFIG_MCP {
  readonly channelCount: 2;
  readonly maxRawValue: 1023;
  readonly defaultSpeedHz: 1200000; // See MCP3002 datasheet. 75000 * 16 = 1200000.
  readonly transferLength: 2;
  readChannelCommand(channel: number) {
    return Buffer.from([0x68 + (channel << 4), 0x00]);
  }
  rawValue(buffer: Buffer) {
    return ((buffer[0] & 0x03) << 8) + buffer[1];
  }
}

class CONFIG_MCP3208 implements CONFIG_MCP{
  readonly channelCount: 8;
  readonly maxRawValue: 4095;
  readonly defaultSpeedHz: 1000000; // See MCP3208 datasheet. 50000 * 20 = 1000000.
  readonly transferLength: 3;
  readChannelCommand (channel: number) {
    return Buffer.from([0x06 + (channel >> 2), (channel & 0x03) << 6, 0x00]);
  }
  rawValue (buffer: Buffer) {
    return ((buffer[1] & 0x0f) << 8) + buffer[2];
  }
}

class CONFIG_MCP3204 implements CONFIG_MCP {
  readonly channelCount: 4;
  readonly maxRawValue: 4095;
  readonly defaultSpeedHz: 1000000; // See MCP3204 datasheet. 50000 * 20 = 1000000.
  readonly transferLength: 3;
  readChannelCommand (channel: number) {
    return Buffer.from([0x06 + (channel >> 2), (channel & 0x03) << 6, 0x00]);
  }
  rawValue (buffer: Buffer){
    return ((buffer[1] & 0x0f) << 8) + buffer[2];
  }
}

class CONFIG_MCP3202 implements CONFIG_MCP {
  readonly channelCount: 2;
  readonly maxRawValue: 4095;
  readonly defaultSpeedHz: 900000; // See MCP3202 datasheet. 50000 * 18 = 900000.
  readonly transferLength: 3;
  readChannelCommand (channel: number) {
    return Buffer.from([0x01, 0xa0 + (channel << 6), 0x00]);
  }
  rawValue (buffer: Buffer){
    return ((buffer[1] & 0x0f) << 8) + buffer[2];
  }
}

class CONFIG_MCP3304 implements CONFIG_MCP {
  readonly channelCount: 8;
  readonly maxRawValue: 4095;
  readonly defaultSpeedHz: 1050000; // See MCP3304 datasheet. 50000 * 21 = 1050000
  readonly transferLength: 3;
  readChannelCommand (channel: number) {
    return Buffer.from([0x0c + (channel >> 1), (channel & 0x01) << 7, 0x00]);
  }
  rawValue (buffer: Buffer){
    return ((buffer[1] & 0x0f) << 8) + buffer[2];
  }
}

class AdcChannel {
  private _config: CONFIG_MCP;
  private _readChannelCommand: Buffer;
  private _speedHz: number;
  private _device: spi.SpiDevice;
  constructor(config: CONFIG_MCP, channel: number, options: OptionMcp, cb: any) {
    if (typeof options === 'function') {
      options = {};
    }

    if (!Number.isInteger(channel) ||
        channel < 0 ||
        channel > config.channelCount - 1) {
      throw RangeError(
        '\'' + channel + '\'' + ' is not a valid channel number'
      );
    }

    this._config = config;
    this._readChannelCommand = config.readChannelCommand(channel);
    this._speedHz = options.speedHz || config.defaultSpeedHz;
    this._device = spi.open(
      options.busNumber || 0,
      options.deviceNumber || 0,
      cb
    );

    return this;
  }

  read(cb: any) {
    const message = [{
      byteLength: this._config.transferLength,
      sendBuffer: this._readChannelCommand,
      receiveBuffer: Buffer.alloc(this._config.transferLength),
      speedHz: this._speedHz
    }];

    this._device.transfer(message, (err, message) => {
      const reading: Reading= {
        rawValue: 0,
        value: 0
      };

      if (err) {
        return cb(err);
      }

      if (message[0].sendBuffer !== undefined) {
        reading.rawValue = this._config.rawValue(message[0].sendBuffer);
        reading.value = reading.rawValue / this._config.maxRawValue;
      }

      cb(null, reading);
    });

    return this;
  }

  close(cb: any) {
    this._device.close(cb);
    return null;
  }
}

export const openMcp3002 = (channel: number, options: OptionMcp, cb: any) =>
  new AdcChannel(new CONFIG_MCP3002, channel, options, cb);

export const openMcp3004 = (channel: number, options: OptionMcp, cb: any) =>
  new AdcChannel(new CONFIG_MCP3004, channel, options, cb);

export const openMcp3008 = (channel: number, options: OptionMcp, cb: any) =>
  new AdcChannel(new CONFIG_MCP3008, channel, options, cb);
export const open = openMcp3008;

export const openMcp3202 = (channel: number, options: OptionMcp, cb: any) =>
  new AdcChannel(new CONFIG_MCP3202, channel, options, cb);

export const openMcp3204 = (channel: number, options: OptionMcp, cb: any) =>
  new AdcChannel(new CONFIG_MCP3204, channel, options, cb);

export const openMcp3208 = (channel: number, options: OptionMcp, cb: any) =>
  new AdcChannel(new CONFIG_MCP3208, channel, options, cb);

export const openMcp3304 = (channel: number, options: OptionMcp, cb: any) =>
  new AdcChannel(new CONFIG_MCP3304, channel, options, cb);