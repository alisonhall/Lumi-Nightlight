$(document).ready(function() {
  var mode = 0;
  var socket = io();
  //
  // socket.on('readMode', function (receivedData) {
  //     console.log('readMode: ' + receivedData);
  //     if (receivedData == 0) {
  //         $("button.selected").removeClass("selected");
  //         $("#modeButton" + 0).addClass("selected");
  //         mode = 0;
  //     } else if (receivedData == 1) {
  //         $("button.selected").removeClass("selected");
  //         $("#modeButton" + 1).addClass("selected");
  //         mode = 1;
  //     } else {
  //         $("button.selected").removeClass("selected");
  //         $("#modeButton" + 2).addClass("selected");
  //         mode = 2;
  //     }
  // });

  $('#modeButton0').click(function () {
      mode = 0;
      socket.emit('modeChange', mode);
      $("button.selected").removeClass("selected");
      $("#modeButton" + 0).addClass("selected");
      console.log("modeChange", mode);
  });
  $('#modeButton1').click(function () {
      mode = 1;
      socket.emit('modeChange', mode);
      $("button.selected").removeClass("selected");
      $("#modeButton" + 1).addClass("selected");
      console.log("modeChange", mode);
  });
  $('#modeButton2').click(function () {
      mode = 2;
      socket.emit('modeChange', mode);
      $("button.selected").removeClass("selected");
      $("#modeButton" + 2).addClass("selected");
      console.log("modeChange", mode);
  });

});
