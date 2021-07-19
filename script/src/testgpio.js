import * as mcpadc from 'mcp-spi-adc';

const tempSensor1 = mcpadc.open(0, {busNumber: 0, deviceNumber: 0, speedHz: 20000}, err => {
  if (err) throw err;

  setInterval(_ => {
    tempSensor1.read((err, reading) => {
      if (err) throw err;

      console.log(`GPIO 8 pin 0 Temp => ${reading.value * 40}`);
    });
  }, 1000);
});

const tempSensor2 = mcpadc.open(4, {busNumber: 0, deviceNumber: 1, speedHz: 20000}, err => {

  setInterval(_ => {
    tempSensor2.read((err, reading) => {

      console.log(`GPIO 7 pin 4 Temp => ${reading.value * 40}`);
    });
  }, 1000);
});
