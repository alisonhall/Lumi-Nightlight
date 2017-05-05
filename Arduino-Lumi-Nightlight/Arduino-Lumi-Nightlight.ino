
#include <Adafruit_NeoPixel.h>
#include <SoftwareSerial.h>
#include <TimeLib.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>


#define RING_PIN              10
#define NUM_RING_PIXELS       16

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_RING_PIXELS, RING_PIN, NEO_GRB + NEO_KHZ800);

int mode = 0;
int prevMode = 0;
int dirLED_r = 0;
int dirLED_g = 0;
int dirLED_b = 255;

void setup()
{
  Serial.begin(9600);
  strip.begin();
  strip.setBrightness(40);
  strip.show(); // Initialize all pixels to 'off'
}

void loop() // run over and over again
{

  // Will run code when data is being sent to the arduino
  while (Serial.available() > 0) {

      char received = Serial.read();

      if (received == 'M') {
        // Change the mode
        colorWipe(strip.Color(0, 0, 0), 20);
        prevMode = mode;
        mode = Serial.parseInt();
        Serial.flush();

      }

  }

  if (mode != prevMode) {
    colorWipe(strip.Color(0, 0, 0), 20);
    prevMode = mode;
  }

  if (mode == 0) {
    offMode();
  } else if (mode == 1) {
    cryingMode();
  } else if (mode == 2) {
    feedingMode();
  } else {
    autoMode();
  }
}

// Fill the dots one after the other with a color
void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, c);
    strip.show();
    delay(wait);
  }
}

void setRGB(int r, int g, int b) {
  dirLED_r = r;
  dirLED_g = g;
  dirLED_b = b;
  colorWipe(strip.Color(dirLED_r, dirLED_g, dirLED_b), 20);
}

void offMode() {
  setRGB(0, 0, 0);
}

void autoMode() {
  setRGB(0, 0, 255);
}

void cryingMode() {
  setRGB(255, 0, 0);
}

void feedingMode() {
  setRGB(0, 255, 0);
}
