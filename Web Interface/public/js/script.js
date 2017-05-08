$(document).ready(function() {
  var mode = 0;
  var socket = io();

  var status;
  var currentColour;
  var offColour;
  var onColour;
  var cryingColour;
  var feedingColour;

  function setLumiColour(data) {
    var colour = 'rgb(' + Math.round(data.r*255) + ',' + Math.round(data.g*255) + ',' + Math.round(data.b*255) + ')';

    $('.lumi-container #lumi-glow').css('fill', colour);
    $('.lumi-container #lumi--body-color').css('fill', colour);
    $('.lumi-container #lumi-eyes').css('fill', colour);
    $('.lumi-container #lumi-glowing-layer').css('fill', colour);
    $('.lumi-container #lumi-body-color').css('fill', colour);
    $('.lumi-container #lumi--eyes').css('fill', colour);
    $('.lumi-container #brow--left').css('fill', colour);
    $('.lumi-container #brow--right').css('fill', colour);
    $('.lumi-container #lumi-mouth').css('fill', colour);
    $('.lumi-container #tears-group').css('fill', colour);
  }

  function setMenuColour(data) {
    var colour = 'rgb(' + Math.round(data.r*255) + ',' + Math.round(data.g*255) + ',' + Math.round(data.b*255) + ')';

    $('.lumi-menu #lumi-glow').css('fill', colour);
    $('.lumi-menu #lumi--body-color').css('fill', colour);
    $('.lumi-menu #lumi-eyes').css('fill', colour);
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

  socket.on('statusChange', function (receivedData) {
    console.log(receivedData);
    status = receivedData;

    if(status == 3) {
      if(window.location.href != "http://localhost:3000/crying.html") {
        window.location.href = "http://localhost:3000/crying.html";
      }
      $('.lumi-container .lumi-happy').hide();
      $('.lumi-container .lumi-crying').show();
      $('.lumi-menu .lumi-happy').hide();
      $('.lumi-menu .lumi-crying').show();
    } else {
      $('.lumi-container .lumi-happy').show();
      $('.lumi-container .lumi-crying').hide();
      $('.lumi-menu .lumi-happy').show();
      $('.lumi-menu .lumi-crying').hide();
    }

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

  socket.on('receiveStatus', function (receivedData) {
    console.log(receivedData);
    status = receivedData;

    if(status == 3) {
      $('.lumi-container .lumi-happy').hide();
      $('.lumi-container .lumi-crying').show();
      $('.lumi-menu .lumi-happy').hide();
      $('.lumi-menu .lumi-crying').show();
    } else {
      $('.lumi-container .lumi-happy').show();
      $('.lumi-container .lumi-crying').hide();
      $('.lumi-menu .lumi-happy').show();
      $('.lumi-menu .lumi-crying').hide();
    }

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
      $("#toggle-mode-auto").removeClass("off").addClass("on").attr("src", "img/assets--svg/buttons/toggles/toggle--on.svg");
    } else {
      $("#toggle-mode-auto").removeClass("on").addClass("off").attr("src", "img/assets--svg/buttons/toggles/toggle--off.svg");
    }
  });

  socket.on('receiveCryingMode', function (receivedData) {
    if(receivedData) {
      $("#toggle-mode-crying").removeClass("off").addClass("on").attr("src", "img/assets--svg/buttons/toggles/stepper--high.svg");
    } else {
      $("#toggle-mode-crying").removeClass("on").addClass("off").attr("src", "img/assets--svg/buttons/toggles/stepper--off.svg");
    }
  });

  socket.on('receiveFeedingMode', function (receivedData) {
    if(receivedData) {
      $("#toggle-mode-feeding").removeClass("off").addClass("on").attr("src", "img/assets--svg/buttons/toggles/toggle--on.svg");
    } else {
      $("#toggle-mode-feeding").removeClass("on").addClass("off").attr("src", "img/assets--svg/buttons/toggles/toggle--off.svg");
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
    if(status == 0 && $('.container').hasClass('home')) {
      setLumiColour(receivedData);
      $(".status-label").attr("src", "img/assets--svg/status-labels/label--quiet.svg").css("left", "148px");
    }
  });

  socket.on('receiveOnColour', function(receivedData) {
    console.log(receivedData);
    onColour = receivedData;
    setMenuColour(receivedData);
    if(status == 1 || status == 2) {
      setLumiColour(receivedData);
      if($('.container').hasClass('home')) {
        $(".status-label").attr("src", "img/assets--svg/status-labels/label--quiet.svg").css("left", "148px");
      }
    }
    if($('.container').hasClass('colour-picker')) {
      setColourWheel(receivedData);
    }
    if($('.container').hasClass('colour-recent')) {
      setLumiColour(receivedData);
    }
  });

  socket.on('receiveCryingColour', function(receivedData) {
    console.log(receivedData);
    cryingColour = receivedData;
    setMenuColour(receivedData);
    if(status == 3 && ($('.container').hasClass('home') || $('.container').hasClass('crying'))) {
      setLumiColour(receivedData);
      $(".status-label").attr("src", "img/assets--svg/status-labels/label--crying.svg").css("left", "142px").css("width", "65px");
      $('.lumi-menu .lumi-happy svg').css("display", "none");
      $('.lumi-menu .lumi-crying svg').css("display", "block")
    }
  });

  socket.on('receiveFeedingColour', function(receivedData) {
    console.log(receivedData);
    feedingColour = receivedData;
    setMenuColour(receivedData);
    if(status == 4 && $('.container').hasClass('home')) {
      setLumiColour(receivedData);
      $(".status-label").attr("src", "img/assets--svg/status-labels/label--feeding.svg").css("left", "137px");
    }
  });

  $('#save').click(function() {
    socket.emit('saveColourData', true);
  });

  $('#toggle-mode-auto').click(function() {
    var currentVal = $(this).hasClass("on");
    if(currentVal) {
      $(this).removeClass("on").addClass("off").attr("src", "img/assets--svg/buttons/toggles/toggle--off.svg");
      socket.emit('autoModeChange', 0);
    } else {
      $(this).removeClass("off").addClass("on").attr("src", "img/assets--svg/buttons/toggles/toggle--on.svg");
      socket.emit('autoModeChange', 1);
    }
  });

  $('#toggle-mode-crying').click(function() {
    var currentVal = $(this).hasClass("on");
    if(currentVal) {
      $(this).removeClass("on").addClass("off").attr("src", "img/assets--svg/buttons/toggles/stepper--off.svg");
      socket.emit('cryingModeChange', 0);
    } else {
      $(this).removeClass("off").addClass("on").attr("src", "img/assets--svg/buttons/toggles/stepper--high.svg");
      socket.emit('cryingModeChange', 1);
    }
  });

  $('#toggle-mode-feeding').click(function() {
    var currentVal = $(this).hasClass("on");
    if(currentVal) {
      $(this).removeClass("on").addClass("off").attr("src", "img/assets--svg/buttons/toggles/toggle--off.svg");
      socket.emit('feedingModeChange', 0);
    } else {
      $(this).removeClass("off").addClass("on").attr("src", "img/assets--svg/buttons/toggles/toggle--on.svg");
      socket.emit('feedingModeChange', 1);
    }
  });

  $('.jQWCP-wWidget.jQWCP-block').mouseup(function() {
    var colour = $('#ColorInput').val();
    console.log(colour);
    $('.jQWCP-wWheelCursor').css('background', '#' + colour);

    $('.colour-picker .lumi-container #lumi-glow').css('fill', colour);
    $('.colour-picker .lumi-container #lumi--body-color').css('fill', colour);
    $('.colour-picker .lumi-container #lumi-eyes').css('fill', colour);
    $('.colour-picker .lumi-container #lumi-glowing-layer').css('fill', '#' + colour);
    $('.colour-picker .lumi-container #lumi-body-color').css('fill', '#' + colour);
    $('.colour-picker .lumi-container #lumi--eyes').css('fill', '#' + colour);
    $('.colour-picker .lumi-container #brow--left').css('fill', '#' + colour);
    $('.colour-picker .lumi-container #brow--right').css('fill', '#' + colour);
    $('.colour-picker .lumi-container #lumi-mouth').css('fill', '#' + colour);
    $('.colour-picker .lumi-container #tears-group').css('fill', '#' + colour);
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

  var numMenuClicks = 0;
  $(".lumi-menu .main-icon").click(function() {
    $('.menu--overlay').show();
    if(numMenuClicks == 0) {
      $(".lumi-menu .main-icon > img").attr("src", "img/assets--svg/menu-icons/icon--home.svg");
      $(".lumi-menu .main-icon .lumi-happy").hide();
      $(".lumi-menu .main-icon .lumi-crying").hide();
      $(".lumi-menu .secondary-icons").show();
      numMenuClicks++;
    } else {
      window.location.href = "http://localhost:3000/index.html";
    }
  });

  $(".menu--overlay").click(function() {
    $('.menu--overlay').hide();
    $(".lumi-menu .main-icon > img").attr("src", "img/assets--svg/menu-icons/icon--menu.svg");
    $(".lumi-menu .main-icon .lumi-happy").show();
    $(".lumi-menu .main-icon .lumi-crying").show();
    $(".lumi-menu .secondary-icons").hide();
    numMenuClicks = 0;
  });

  $(".menu-icon--lamp").click(function() {
    var currentVal = $(this).hasClass("on");
    if(currentVal) {
      $(this).removeClass("on").addClass("off").attr("src", "img/assets--svg/menu-icons/menu-icon--lamp--off.svg");
      socket.emit('onModeChange', 0);
    } else {
      $(this).removeClass("off").addClass("on").attr("src", "img/assets--svg/menu-icons/menu-icon--lamp--on.svg");
      socket.emit('onModeChange', 1);
    }
  });

  $(".btn--primary").click(function() {
    var colourVal = $('#ColorInput').wheelColorPicker('getColor');
    socket.emit('onColourChange', colourVal);
  })


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
