// Include our libraries
var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var express = require('express');
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

// Use router to point requests to the 'client' folder
router.use(express.static(path.resolve(__dirname, 'public')));

// // Configure Serial Port
// var SerialPort = require('serialport');
// var port = new SerialPort('/dev/tty.usbmodem1421', {
//     baudRate: 9600,
//     dataBits: 8,
//     parity: 'none',
//     stopBits: 1,
//     flowControl: false,
//     parser: SerialPort.parsers.readline("\r\n")
// });
//
//
// port.on('open', function () {
//     console.log("Open Serial Communication");
//     // Handles incoming data
//     port.on('data', function (data) {
//         var string = data.split(',');
//         console.log('Data: ', data,' = ', string);
//         if (string[0] == 'M') {
//           io.emit('readMode', string[1]);
//         }
//     });
//     console.log("finish opening serial communication");
// });


var onMode = true;
var autoMode = false;
var cryingMode = false;
var feedingMode = true;

var onColour = {
  r: 1,
  g: 1,
  b: 1,
  a: 0.5,
  h: 1,
  s: 1,
  v: 1,
}

// Send data from server to serial port
io.on('connection', function(socket) {
    console.log("user connected to server");

    socket.on("sendModeSettings", function(data) {
      socket.emit("receiveAutoMode", autoMode);
      socket.emit("receiveCryingMode", cryingMode);
      socket.emit("receiveFeedingMode", feedingMode);
    });

    socket.on("sendOnColour", function(data) {
      socket.emit("receiveOnColour", onColour);
    });

    socket.on('autoModeChange', function(data) {
        console.log('M,A,', data);
        // port.write('M,A,' + data);
        autoMode = data;
    });

    socket.on('cryingModeChange', function(data) {
        console.log('M,C,', data);
        // port.write('M,C,' + data);
        cryingMode = data;
    });

    socket.on('feedingModeChange', function(data) {
        console.log('M,F,', data);
        // port.write('M,F,' + data);
        feedingMode = data;
    });

    socket.on('onColourChange', function(data) {
      onColour.r = data.r;
      onColour.g = data.g;
      onColour.b = data.b;
      console.log('C,O,', data.r, ',', data.g, ',', data.b);
      // port.write('C,O,' + data.r + ',' + data.g + ',' + data.b);
    });

    socket.on('onBrightnessChange', function(data) {
      onColour.a = data/100;
      console.log('B,O,', data);
      // port.write('B,O,' + data);
    });

});



// Start server
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Our server is listening at", addr.address + ":" + addr.port);
});
