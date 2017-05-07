$(document).ready(function() {
  var mode = 0;
  var socket = io();

  var status;
  var currentColour;
  var offColour;
  var onColour;
  var cryingColour;
  var feedingColour;

  //Function to convert a rgb color to hex format
  function rgb2hex(rgb){
   rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
   return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  }

  function setLumiColour(data) {
    // var colour = rgb2hex('rgb(' + Math.round(data.r*255) + ',' + Math.round(data.g*255) + ',' + Math.round(data.b*255) + ')');
    // var colour = rgba(Math.round(data.r*255), Math.round(data.g*255), Math.round(data.b*255), Math.round(data.a*100));
    // var colour = 'rgba(' + Math.round(data.r*255) + ',' + Math.round(data.g*255) + ',' + Math.round(data.b*255) + ',' + data.a + ')';
    var colour = 'rgb(' + Math.round(data.r*255) + ',' + Math.round(data.g*255) + ',' + Math.round(data.b*255) + ')';

    $('.lumi-container #lumi-glowing-layer').css('fill', colour);
    $('.lumi-container #lumi-body-color').css('fill', colour);
    $('.lumi-container #lumi--eyes').css('fill', colour);
    $('.lumi-container #brow--left').css('fill', colour);
    $('.lumi-container #brow--right').css('fill', colour);
    $('.lumi-container #lumi-mouth').css('fill', colour);
    $('.lumi-container #tears-group').css('fill', colour);
  }

  function setMenuColour(data) {
    // var colour = rgb2hex('rgb(' + Math.round(data.r*255) + ',' + Math.round(data.g*255) + ',' + Math.round(data.b*255) + ')');
    // var colour = rgba(Math.round(data.r*255), Math.round(data.g*255), Math.round(data.b*255), data.a);
    // var colour = 'rgba(' + Math.round(data.r*255) + ',' + Math.round(data.g*255) + ',' + Math.round(data.b*255) + ',' + data.a + ')';
    var colour = 'rgb(' + Math.round(data.r*255) + ',' + Math.round(data.g*255) + ',' + Math.round(data.b*255) + ')';

    $('.lumi-menu #lumi-glowing-layer').css('fill', colour);
    $('.lumi-menu #lumi-body-color').css('fill', colour);
    $('.lumi-menu #lumi--eyes').css('fill', colour);
    $('.lumi-menu #brow--left').css('fill', colour);
    $('.lumi-menu #brow--right').css('fill', colour);
    $('.lumi-menu #lumi-mouth').css('fill', colour);
    $('.lumi-menu #tears-group').css('fill', colour);
  }

  function setColourWheel(receivedData) {
    $("#ColorInput").wheelColorPicker('setColor', receivedData);
    var colour = $('#ColorInput').val();
    $('.jQWCP-wWheelCursor').css('background', '#' + colour);

    setLumiColour(receivedData);

    $('.slider').val(receivedData.a * 100);
    getSliderVal();
    updateSliderGradient();
  }

  socket.on('receiveStatus', function (receivedData) {
    console.log(receivedData);
    status = receivedData;
    if(status == 0) {
      socket.emit('sendOffColour', true);
    } else if(status == 1) {
      socket.emit('sendOnColour', true);
    } else if (status == 2) {
      socket.emit('sendOnColour', true);
    } else if(status == 3) {
      socket.emit('sendCryingColour', true);
    } else if(status == 4) {
      socket.emit('sendFeedingColour', true);
    }
  });

  socket.on('receiveAutoMode', function (receivedData) {
    if(receivedData) {
      $("#toggle-mode-auto").removeClass("off").addClass("on").attr("src", "img/_assets/toggle--on.png");
    } else {
      $("#toggle-mode-auto").removeClass("on").addClass("off").attr("src", "img/_assets/toggle--off.png");
    }
  });

  socket.on('receiveCryingMode', function (receivedData) {
    if(receivedData) {
      $("#toggle-mode-crying").removeClass("off").addClass("on").attr("src", "img/_assets/toggle--on.png");
    } else {
      $("#toggle-mode-crying").removeClass("on").addClass("off").attr("src", "img/_assets/toggle--off.png");
    }
  });

  socket.on('receiveFeedingMode', function (receivedData) {
    if(receivedData) {
      $("#toggle-mode-feeding").removeClass("off").addClass("on").attr("src", "img/_assets/toggle--on.png");
    } else {
      $("#toggle-mode-feeding").removeClass("on").addClass("off").attr("src", "img/_assets/toggle--off.png");
    }
  });

  socket.on('receiveCurrentColour', function(receivedData) {
    console.log(receivedData);
    currentColour = receivedData;
    setColourWheel(receivedData);
  });

  socket.on('receiveOffColour', function(receivedData) {
    console.log(receivedData);
    offColour = receivedData;
    setMenuColour(receivedData);
  });

  socket.on('receiveOnColour', function(receivedData) {
    console.log(receivedData);
    onColour = receivedData;
    setMenuColour(receivedData);
    if(status == 1 || status == 2) {
      setLumiColour(receivedData);
    }
    if($('.container').hasClass('colour-picker')) {
      setColourWheel(receivedData);
    }
  });

  socket.on('receiveCryingColour', function(receivedData) {
    console.log(receivedData);
    cryingColour = receivedData;
    setMenuColour(receivedData);
  });

  socket.on('receiveFeedingColour', function(receivedData) {
    console.log(receivedData);
    feedingColour = receivedData;
    setMenuColour(receivedData);
  });

  $('#save').click(function() {
    socket.emit('saveColourData', true);
  });

  $('#toggle-mode-auto').click(function() {
    var currentVal = $(this).hasClass("on");
    if(currentVal) {
      $(this).removeClass("on").addClass("off").attr("src", "img/_assets/toggle--off.png");
      socket.emit('autoModeChange', 0);
    } else {
      $(this).removeClass("off").addClass("on").attr("src", "img/_assets/toggle--on.png");
      socket.emit('autoModeChange', 1);
    }
  });

  $('#toggle-mode-crying').click(function() {
    var currentVal = $(this).hasClass("on");
    if(currentVal) {
      $(this).removeClass("on").addClass("off").attr("src", "img/_assets/toggle--off.png");
      socket.emit('cryingModeChange', 0);
    } else {
      $(this).removeClass("off").addClass("on").attr("src", "img/_assets/toggle--on.png");
      socket.emit('cryingModeChange', 1);
    }
  });

  $('#toggle-mode-feeding').click(function() {
    var currentVal = $(this).hasClass("on");
    if(currentVal) {
      $(this).removeClass("on").addClass("off").attr("src", "img/_assets/toggle--off.png");
      socket.emit('feedingModeChange', 0);
    } else {
      $(this).removeClass("off").addClass("on").attr("src", "img/_assets/toggle--on.png");
      socket.emit('feedingModeChange', 1);
    }
  });

  $('.jQWCP-wWidget.jQWCP-block').mouseup(function() {
    var colourVal = $('#ColorInput').wheelColorPicker('getColor');
    var colour = $('#ColorInput').val();
    console.log(colour, colourVal);
    $('.jQWCP-wWheelCursor').css('background', '#' + colour);

    $('.colour-picker .lumi-container #lumi-glowing-layer').css('fill', '#' + colour);
    $('.colour-picker .lumi-container #lumi-body-color').css('fill', '#' + colour);
    $('.colour-picker .lumi-container #lumi--eyes').css('fill', '#' + colour);
    $('.colour-picker .lumi-container #brow--left').css('fill', '#' + colour);
    $('.colour-picker .lumi-container #brow--right').css('fill', '#' + colour);
    $('.colour-picker .lumi-container #lumi-mouth').css('fill', '#' + colour);
    $('.colour-picker .lumi-container #tears-group').css('fill', '#' + colour);

    socket.emit('onColourChange', colourVal);
  });

  function getSliderVal() {
  	var sliderVal = $(".slider").val();
  	$(".slider-value").html(sliderVal + "%");
    return sliderVal;
  }

  function updateSliderGradient() {
    var self = document.querySelector("input[type=range]");
    var fillColor = "rgba(91, 171, 222, 0.75)";
    var emptyColor = "rgba(91, 171, 222, 0.25)";
    var percent = 100 * (self.value - self.min) / (self.max - self.min) + "%";

    self.style.backgroundImage = `linear-gradient( to right, ${fillColor}, ${fillColor} ${percent}, ${emptyColor} ${percent})`;
  }

  $(".slider").change(function() {
  	var sliderVal = getSliderVal();
    socket.emit('onBrightnessChange', sliderVal);
  });



  if($(".container").hasClass("settings")) {
    socket.emit("sendModeSettings", true);
  }

  if($(".container").hasClass("colour-recent")) {
    socket.emit("sendOnColour", true);
  }

  if($(".container").hasClass("colour-picker")) {
    socket.emit("sendOnColour", true);


    document.querySelector("input[type=range]").addEventListener("input", function() {
      updateSliderGradient();
  	});
  }



  socket.emit("sendStatus", true);
});
