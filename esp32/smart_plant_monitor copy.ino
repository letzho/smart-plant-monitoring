#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <WiFiManager.h>
#include <EEPROM.h>

#define DHTPIN 4
#define DHTTYPE DHT11
#define MOISTURE_PIN 34
DHT dht(DHTPIN, DHTTYPE);

const char* mqtt_server = "broker.mqttgo.io";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);
WiFiManager wifiManager;

String serialNumber = "";

// Custom parameters for WiFi Manager
WiFiManagerParameter custom_serial("serial", "Tag ID (5 digits)", "00001", 6);

// Moisture sensor calibration values
const int MOISTURE_WET = 590;    // Fully wet reading
const int MOISTURE_DRY = 2520;   // Dry reading

// Function to convert moisture sensor reading to percentage
int convertMoistureToPercentage(int rawValue) {
  // Constrain the raw value to the calibration range
  int constrainedValue = constrain(rawValue, MOISTURE_WET, MOISTURE_DRY);
  
  // Convert to percentage (inverted because lower values = wetter)
  int percentage = map(constrainedValue, MOISTURE_WET, MOISTURE_DRY, 100, 0);
  
  // Ensure percentage is within 0-100 range
  return constrain(percentage, 0, 100);
}

void setup() {
  Serial.begin(115200);
  EEPROM.begin(256);

  // Read serial number from EEPROM
  serialNumber = EEPROM.readString(96);
  if (serialNumber.length() != 5) {
    serialNumber = "00001"; // fallback default
  }

  // Always add the custom parameter, pre-filled with current serial number
  WiFiManagerParameter custom_serial("serial", "Tag ID (5 digits)", serialNumber.c_str(), 6);
  wifiManager.addParameter(&custom_serial);

  if (!wifiManager.autoConnect("PlantMonitor_Setup")) {
    Serial.println("Failed to connect and hit timeout");
    delay(3000);
    ESP.restart();
  }

  // Get the value entered by the user
  String enteredSerial = custom_serial.getValue();
  if (enteredSerial.length() == 5 && enteredSerial != serialNumber) {
    serialNumber = enteredSerial;
    EEPROM.writeString(96, serialNumber);
    EEPROM.commit();
    Serial.print("Serial number saved: ");
    Serial.println(serialNumber);
  } else {
    Serial.print("Serial number loaded from EEPROM: ");
    Serial.println(serialNumber);
  }

  Serial.println("Connected to WiFi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Serial Number: ");
  Serial.println(serialNumber);
  
  // Initialize sensors and MQTT
  dht.begin();
  client.setServer(mqtt_server, mqtt_port);
  
  Serial.println("Setup complete. Starting sensor monitoring...");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" retry in 5 seconds");
      delay(5000);
    }
  }
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi connection lost. Restarting...");
    delay(1000);
    ESP.restart();
  }
  
  // Handle MQTT connection
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Read sensor data
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  int moistureRaw = analogRead(MOISTURE_PIN);
  int moisturePercentage = convertMoistureToPercentage(moistureRaw);

  // Check if sensor reads failed
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    delay(2000);
    return;
  }

  // Convert to strings for MQTT
  char tempStr[8], humStr[8], moistStr[8];
  dtostrf(temperature, 1, 2, tempStr);
  dtostrf(humidity, 1, 2, humStr);
  itoa(moisturePercentage, moistStr, 10);

  // Publish to MQTT
  String payload = String("{\"temperature\":") + tempStr +
                   ",\"humidity\":" + humStr +
                   ",\"moisture\":" + moistStr + "}";
  client.publish(("plant/" + serialNumber + "/data").c_str(), payload.c_str());

  // Print to Serial for debugging
  Serial.print("Serial: ");
  Serial.print(serialNumber);
  Serial.print(" | Temp: ");
  Serial.print(tempStr);
  Serial.print("°C | Humidity: ");
  Serial.print(humStr);
  Serial.print("% | Moisture: ");
  Serial.print(moisturePercentage);
  Serial.print("% (Raw: ");
  Serial.print(moistureRaw);
  Serial.println(")");

  delay(5000); // 5 seconds
} 