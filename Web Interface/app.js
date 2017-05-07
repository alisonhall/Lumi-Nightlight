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

// Configure Serial Port
var SerialPort = require('serialport');
var port = new SerialPort('/dev/tty.usbmodem1421', {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: SerialPort.parsers.readline("\r\n")
});



var status = 1;
var offMode = false; // mode 0
var onMode = true; // mode 1
var autoMode = true; // mode 2
var cryingMode = true; // mode 3
var feedingMode = true; // mode 4

var currentColour = {
  r: 1,
  g: 1,
  b: 1,
  a: 1,
  h: 1,
  s: 1,
  v: 1,
}
var offColour = {
  r: 0,
  g: 0,
  b: 0,
  a: 0,
  h: 1,
  s: 1,
  v: 1,
}
var onColour = {
  r: 1,
  g: 1,
  b: 1,
  a: 1,
  h: 1,
  s: 1,
  v: 1,
}
var cryingColour = {
  r: 1,
  g: 0,
  b: 0,
  a: 1,
  h: 1,
  s: 1,
  v: 1,
}
var feedingColour = {
  r: 0,
  g: 1,
  b: 0,
  a: 1,
  h: 1,
  s: 1,
  v: 1,
}


port.on('open', function () {
    console.log("Open Serial Communication");
    // Handles incoming data

    port.on('data', function (data) {
        var string = data.split(',');
        console.log('Data: ', data,' = ', string);
        if (string[0] == 'M') {
          io.emit('readMode', string[1]);
        } else if (string[0] == 'S') {
          status = string[1];
          io.emit('receiveStatus', status);
        } else if (string[0] == 'C') {
          if (string[1] == 0) {
            offColour.r = string[2]/255;
            offColour.g = string[3]/255;
            offColour.b = string[4]/255;
            offColour.a = string[5]/100;
          } else if (string[1] == 1) {
            onColour.r = string[2]/255;
            onColour.g = string[3]/255;
            onColour.b = string[4]/255;
            onColour.a = string[5]/100;
          } else if (string[1] == 2) {
            onColour.r = string[2]/255;
            onColour.g = string[3]/255;
            onColour.b = string[4]/255;
            onColour.a = string[5]/100;
          } else if (string[1] == 3) {
            cryingColour.r = string[2]/255;
            cryingColour.g = string[3]/255;
            cryingColour.b = string[4]/255;
            cryingColour.a = string[5]/100;
          } else if (string[1] == 4) {
            feedingColour.r = string[2]/255;
            feedingColour.g = string[3]/255;
            feedingColour.b = string[4]/255;
            feedingColour.a = string[5]/100;
          }
        }
    });
    console.log("finish opening serial communication");
});



// Send data from server to serial port
io.on('connection', function(socket) {
    console.log("user connected to server");

    socket.on("sendModeSettings", function(data) {
      socket.emit("receiveAutoMode", autoMode);
      socket.emit("receiveCryingMode", cryingMode);
      socket.emit("receiveFeedingMode", feedingMode);
    });

    socket.on("sendStatus", function(data) {
      socket.emit("receiveStatus", status);
    })

    socket.on("sendCurrentColour", function(data) {
      socket.emit("receiveCurrentColour", currentColour);
    });

    socket.on("sendOffColour", function(data) {
      socket.emit("receiveOffColour", offColour);
    });

    socket.on("sendOnColour", function(data) {
      socket.emit("receiveOnColour", onColour);
    });

    socket.on("sendCryingColour", function(data) {
      socket.emit("receiveCryingColour", cryingColour);
    });

    socket.on("sendFeedingColour", function(data) {
      socket.emit("receiveFeedingColour", feedingColour);
    });

    socket.on("saveColourData", function(data) {
      onColour = currentColour;
    });

    socket.on('autoModeChange', function(data) {
        console.log('M,2,', data);
        port.write('M,2,' + data);
        autoMode = data;
    });

    socket.on('cryingModeChange', function(data) {
        console.log('M,3,', data);
        port.write('M,3,' + data);
        cryingMode = data;
    });

    socket.on('feedingModeChange', function(data) {
        console.log('M,4,', data);
        port.write('M,4,' + data);
        feedingMode = data;
    });

    socket.on('onColourChange', function(data) {
      var tempR = Math.round(data.r * 255);
      var tempG = Math.round(data.g * 255);
      var tempB = Math.round(data.b * 255);
      currentColour.r = data.r;
      currentColour.g = data.g;
      currentColour.b = data.b;
      console.log('C,1,', tempR, ',', tempG, ',', tempB);
      port.write('C,1,' + tempR + ',' + tempG + ',' + tempB);
    });

    socket.on('onBrightnessChange', function(data) {
      currentColour.a = data/100;
      console.log('B,1,', data);
      port.write('B,1,' + data);
    });

});



// Start server
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Our server is listening at", addr.address + ":" + addr.port);
});
