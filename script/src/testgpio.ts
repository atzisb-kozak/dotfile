import { openMcp3008 } from "./mcp-spi-adc";

const tempSensor1 = openMcp3008(0, {busNumber: 0, deviceNumber: 0, speedHz: 20000}, (err: any) => {
	if (err) throw err;

	setInterval(_ => {
		tempSensor1.read((err: any, reading: any) => {
			if (err) throw err;

			console.log(`GPIO 8 pin 0 Temp => ${reading.value * 40}`);
		});
	}, 1000);
});

const tempSensor2 = openMcp3008(4, {busNumber: 0, deviceNumber: 1, speedHz: 20000}, (err: any) => {

	setInterval(_ => {
		tempSensor2.read((err: any, reading: any) => {

			console.log(`GPIO 7 pin 4 Temp => ${reading.value * 40}`);
		});
	}, 1000);
});
