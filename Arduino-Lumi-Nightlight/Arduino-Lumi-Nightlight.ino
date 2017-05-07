#include <Adafruit_NeoPixel.h>
#include <SoftwareSerial.h>
#include <TimeLib.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
//#include <MedianFilter.h>
#include <SharpDistSensor.h>



#define RING_PIN                          10
#define NUM_RING_PIXELS                   16

#define PROXIMITY_PIN                     A0
#define FEEDING_PROXIMITY_DETECTION       700
#define FEEDING_MODE_DURATION             500

#define PHOTOCELL_PIN                     A1
#define LIGHT_DETECTION_LIMIT             250

#define MICROPHONE_PIN                    A2
#define CRYING_DETECTION_LIMIT            700




// Window size of the median filter (odd number, 1 = no filtering)
const byte mediumFilterWindowSize = 5;

// Create an object instance of the SharpDistSensor class
SharpDistSensor sensor(PROXIMITY_PIN, mediumFilterWindowSize);

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_RING_PIXELS, RING_PIN, NEO_GRB + NEO_KHZ800);

bool firstSerialLoop = true;

int mode = 1;
int prevMode = 0;
int dirLED_r = 0;
int dirLED_g = 0;
int dirLED_b = 255;

int photocellReading;
int microphoneReading;
int proximityReading;

bool offMode = false; // mode 0
bool onMode = true; // mode 1
bool autoMode = false; // mode 2
bool cryingMode = true; // mode 3
bool feedingMode = true; // mode 4

bool lightDetected = true;
bool cryingDetected = false;
bool proximityDetected = false;

int offColour_r = 0;
int offColour_g = 0;
int offColour_b = 0;
int offColour_a = 0;

int onColour_r = 0;
int onColour_g = 0;
int onColour_b = 255;
int onColour_a = 100;

int cryingColour_r = 255;
int cryingColour_g = 0;
int cryingColour_b = 0;
int cryingColour_a = 100;

int feedingColour_r = 0;
int feedingColour_g = 255;
int feedingColour_b = 0;
int feedingColour_a = 100;

void setup()
{
  Serial.begin(9600);
  strip.begin();
  strip.setBrightness(40);
  strip.show(); // Initialize all pixels to 'off'
}

void loop() // run over and over again
{
  if(!Serial) {
    firstSerialLoop = true;
    
  } else if(Serial && firstSerialLoop) {
    Serial.print('S');
    Serial.print(',');
    Serial.println(mode);

    Serial.print('C');
    Serial.print(',');
    Serial.print(0);
    Serial.print(',');
    Serial.print(offColour_r);
    Serial.print(',');
    Serial.print(offColour_g);
    Serial.print(',');
    Serial.print(offColour_b);
    Serial.print(',');
    Serial.println(offColour_a);

    Serial.print('C');
    Serial.print(',');
    Serial.print(1);
    Serial.print(',');
    Serial.print(onColour_r);
    Serial.print(',');
    Serial.print(onColour_g);
    Serial.print(',');
    Serial.print(onColour_b);
    Serial.print(',');
    Serial.println(onColour_a);

    Serial.print('C');
    Serial.print(',');
    Serial.print(3);
    Serial.print(',');
    Serial.print(cryingColour_r);
    Serial.print(',');
    Serial.print(cryingColour_g);
    Serial.print(',');
    Serial.print(cryingColour_b);
    Serial.print(',');
    Serial.println(cryingColour_a);

    Serial.print('C');
    Serial.print(',');
    Serial.print(4);
    Serial.print(',');
    Serial.print(feedingColour_r);
    Serial.print(',');
    Serial.print(feedingColour_g);
    Serial.print(',');
    Serial.print(feedingColour_b);
    Serial.print(',');
    Serial.println(feedingColour_a);
    
    firstSerialLoop = false;
  }

  photocellReading = analogRead(PHOTOCELL_PIN);

  if(photocellReading < LIGHT_DETECTION_LIMIT) {
    lightDetected = true;
  } else {
    lightDetected = false;
  }

//  microphoneReading = analogRead(MICROPHONE_PIN);
  if(microphoneReading > CRYING_DETECTION_LIMIT) {
    cryingDetected = true;
  } else {
    cryingDetected = false;
  }
  
  // Get distance from sensor
  proximityReading = sensor.getDist();

  if(proximityReading < FEEDING_PROXIMITY_DETECTION) {
    proximityDetected = true;
  } else {
    proximityDetected = false;
  }
  
  // Will run code when data is being sent to the arduino
  while (Serial.available() > 0) {

      char received = Serial.read();

      if (received == 'M') {
        // Change the mode
        int mode = Serial.parseInt();
        int modeVal = Serial.parseInt();

        if(mode == 0) {
          if(modeVal == 0) {
            offMode = false;
          } else {
            offMode = true;
          }
        } else if(mode == 1) {
          if(modeVal == 0) {
            onMode = false;
          } else {
            onMode = true;
          }
        } else if (mode == 2) {
          if(modeVal == 0) {
            autoMode = false;
          } else {
            autoMode = true;
          }
        } else if (mode == 3) {
          if(modeVal == 0) {
            cryingMode = false;
          } else {
            cryingMode = true;
          }
        } else if (mode == 4) {
          if(modeVal == 0) {
            feedingMode = false;
          } else {
            feedingMode = true;
          }
        }

        // prevMode = mode;
        // colorWipe(strip.Color(0, 0, 0), 20);

      } else if (received == 'C') {
        int mode = Serial.parseInt();
        float r = Serial.parseInt();
        float g = Serial.parseInt();
        float b = Serial.parseInt();

        if(mode == 1 || mode == 2) {
          onColour_r = r;
          onColour_g = g;
          onColour_b = b;
        }
      } else if (received == 'B') {
        int mode = Serial.parseInt();
        int a = Serial.parseInt();
        if(mode == 1 || mode == 2) {
          onColour_a = a;
        }
      }

      Serial.flush();
  }
  

  int prevMode = mode;
  
  if (offMode == true) {
    mode = 0;
    offModeOn(); // mode 0
  } else if (onMode == true) {
    if ((feedingMode == true && proximityDetected == true) && ((autoMode == false) || (autoMode == true && lightDetected == true))) {
      mode = 4;
      feedingModeOn();
      delay(FEEDING_MODE_DURATION);
    } else if ((cryingMode == true && cryingDetected == true) && ((autoMode == false) || (autoMode == true && lightDetected == true))) {
      mode = 3;
      cryingModeOn();
    } else if (autoMode == true && lightDetected == true) {
      mode = 2;
      autoModeOn();
    } else if (autoMode == true && lightDetected == false) {
      mode = 2;
      offModeOn();
    } else {
      mode = 1;
      onModeOn();
    }
  }

  if (mode != prevMode) {
    Serial.print('S');
    Serial.print(',');
    Serial.println(mode);
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

void setRGB(int r, int g, int b, int a) {
  dirLED_r = r;
  dirLED_g = g;
  dirLED_b = b;
  strip.setBrightness(a);
  colorWipe(strip.Color(dirLED_r, dirLED_g, dirLED_b), 25);
}

void offModeOn() {
  setRGB(offColour_r, offColour_g, offColour_b, offColour_a);
}

void onModeOn() {
//          Serial.print("onModeOn ");
//          Serial.print(onColour_r);
//          Serial.print(",");
//          Serial.print(onColour_g);
//          Serial.print(",");
//          Serial.println(onColour_b);
  setRGB(onColour_r, onColour_g, onColour_b, onColour_a);
}

void autoModeOn() {
  setRGB(onColour_r, onColour_g, onColour_b, onColour_a);
}

void cryingModeOn() {
  setRGB(cryingColour_r, cryingColour_g, cryingColour_b, cryingColour_a);
}

void feedingModeOn() {
  setRGB(feedingColour_r, feedingColour_g, feedingColour_b, feedingColour_a);
}
