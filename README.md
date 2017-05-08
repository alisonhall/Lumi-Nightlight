# Lumi-Nightlight

To run the Lumi Nightlight project, follow the following steps:

1. Make sure you have Node.js and npm installed on your computer
2. Download and unzip the files from the GitHub repository https://github.com/alisonhall/Lumi-Nightlight.
3. Open the Arduino IDE program.
	1. Make sure that you have all of the requisite libraries installed (Adafruit_NeoPixel.h, SoftwareSerial.h, TimeLib.h, Wire.h, Adafruit_Sensor.h, SharpDistSensor.h). Some of the extra libraries you may not have installed can be found in the downloaded repository’s ‘Arduino Libraries’ folder.
	2. In the Arduino IDE program, open the 'Arduino-Lumi-Nightlight.ino’ file found in the 'Arduino-Lumi-Nightlight’ folder of the downloaded repository.
	3. Compile and upload this file to your Arduino.
4. Open the Terminal (or equivalent program)
	1. Navigate to the ‘Web Interface’ folder (Ex. `cd Web\ Interface`)
	2. Run the `npm install` command to make sure that the dependency modules for the project (express, serialport, socket.io) are installed in the ‘Web Interface’ folder.
	3. Run either the `node app.js` command, or the `npm start` command
5. Open the browser and navigate to http://localhost:3000/.
