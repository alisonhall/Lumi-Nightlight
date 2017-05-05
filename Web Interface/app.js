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


// Send data from server to serial port
io.on('connection', function(socket) {
    console.log("user connected to server");

    socket.on('modeChange', function(data) {
        console.log('M', data);
        // port.write('M,' + data);
    });

});



// Start server
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Our server is listening at", addr.address + ":" + addr.port);
});
