$(document).ready(function() {
  var mode = 0;
  var socket = io();


  socket.on('receiveAutoMode', function (receivedData) {
    console.log(receivedData);
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

  socket.on('receiveOnColour', function(receivedData) {
    console.log(receivedData);
    $("#ColorInput").wheelColorPicker('setColor', receivedData);
    var colour = $('#ColorInput').val();
    $('.jQWCP-wWheelCursor').css('background', '#' + colour);
    $('.slider').val(receivedData.a * 100);
    getSliderVal();
    updateSliderGradient();
  });

  //
  // $('#modeButton0').click(function () {
  //     mode = 0;
  //     socket.emit('modeChange', mode);
  //     $("button.selected").removeClass("selected");
  //     $("#modeButton" + 0).addClass("selected");
  //     console.log("modeChange", mode);
  // });
  // $('#modeButton1').click(function () {
  //     mode = 1;
  //     socket.emit('modeChange', mode);
  //     $("button.selected").removeClass("selected");
  //     $("#modeButton" + 1).addClass("selected");
  //     console.log("modeChange", mode);
  // });
  // $('#modeButton2').click(function () {
  //     mode = 2;
  //     socket.emit('modeChange', mode);
  //     $("button.selected").removeClass("selected");
  //     $("#modeButton" + 2).addClass("selected");
  //     console.log("modeChange", mode);
  // });

  $('#toggle-mode-auto').click(function() {
    var currentVal = $(this).hasClass("on");
    if(currentVal) {
      $(this).removeClass("on").addClass("off").attr("src", "img/_assets/toggle--off.png");
    } else {
      $(this).removeClass("off").addClass("on").attr("src", "img/_assets/toggle--on.png");
    }
    socket.emit('autoModeChange', !currentVal);
  });

  $('#toggle-mode-crying').click(function() {
    var currentVal = $(this).hasClass("on");
    if(currentVal) {
      $(this).removeClass("on").addClass("off").attr("src", "img/_assets/toggle--off.png");
    } else {
      $(this).removeClass("off").addClass("on").attr("src", "img/_assets/toggle--on.png");
    }
    socket.emit('cryingModeChange', !currentVal);
  });

  $('#toggle-mode-feeding').click(function() {
    var currentVal = $(this).hasClass("on");
    if(currentVal) {
      $(this).removeClass("on").addClass("off").attr("src", "img/_assets/toggle--off.png");
    } else {
      $(this).removeClass("off").addClass("on").attr("src", "img/_assets/toggle--on.png");
    }
    socket.emit('feedingModeChange', !currentVal);
  });

  $('.jQWCP-wWidget.jQWCP-block').mouseup(function() {
    var colourVal = $('#ColorInput').wheelColorPicker('getColor');
    var colour = $('#ColorInput').val();
    console.log(colour, colourVal);
    $('.jQWCP-wWheelCursor').css('background', '#' + colour);

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

  if($(".container").hasClass("colour-picker")) {
    socket.emit("sendOnColour", true);

    document.querySelector("input[type=range]").addEventListener("input", function() {
      updateSliderGradient();
  	});

    // getSliderVal();
  }

});
