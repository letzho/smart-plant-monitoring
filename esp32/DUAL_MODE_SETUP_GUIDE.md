# Smart Plant Monitor - Dual Mode Setup Guide

## Overview

The ESP32 Smart Plant Monitor now supports a dual-mode setup system that automatically adapts based on whether the device has been previously configured or not.

## How It Works

### Mode 1: First-Time Setup (For Organizer)
**Trigger**: ESP32 powers on for the very first time (no passcode saved in memory)

**Portal Shows**:
- Wi-Fi Network Name
- Wi-Fi Password  
- Tag ID (5 digits) - editable

**Organizer Actions**:
1. Connect to "PlantMonitor_Setup" Wi-Fi network
2. Open browser and go to 192.168.4.1
3. Fill in all 3 fields:
   - Wi-Fi Network: Your event Wi-Fi
   - Wi-Fi Password: Your event Wi-Fi password
   - Tag ID: 5-digit device ID (e.g., 98765)
4. Click "Save"
5. Device connects to Wi-Fi and saves settings permanently
6. A default passcode (12345) is automatically set internally

### Mode 2: Re-Configuring Wi-Fi (For Visitor)
**Trigger**: ESP32 powers on at visitor's home, fails to find event Wi-Fi, but has passcode saved

**Portal Shows**:
- Wi-Fi Network Name
- Wi-Fi Password
- Tag ID (5 digits) - READ ONLY

**Visitor Actions**:
1. Connect to "PlantMonitor_Setup" Wi-Fi network
2. Open browser and go to 192.168.4.1
3. Fill in only 2 fields:
   - Wi-Fi Network: Visitor's home Wi-Fi
   - Wi-Fi Password: Visitor's home Wi-Fi password
4. Tag ID is shown but cannot be changed
5. Click "Save"
6. Device connects to visitor's Wi-Fi
7. Tag ID and internal passcode remain unchanged

## Technical Implementation

### Key Features

1. **Preferences Library**: Uses ESP32 Preferences library for persistent storage
2. **Automatic Mode Detection**: Checks for existing passcode to determine mode
3. **Secure Storage**: Passcode stored in non-volatile memory
4. **Fallback Protection**: Default values if setup fails

### Code Structure

```cpp
// Check if first-time setup
bool isFirstTimeSetup() {
  preferences.begin("plant-monitor", false);
  passcode = preferences.getString("passcode", "");
  preferences.end();
  return passcode.length() == 0;
}

// Mode 1: Show Wi-Fi fields and Tag ID
if (firstTime) {
  // Add only serial parameter
  wifiManager.addParameter(&custom_serial);
}

// Mode 2: Show Wi-Fi fields and Tag ID (read-only)
else {
  // Add only serial parameter (read-only)
  wifiManager.addParameter(&custom_serial);
}
```

## Setup Instructions

### For Organizer (First Time)

1. **Upload Code**: Upload `smart_plant_monitor_dual_mode.ino` to ESP32
2. **Power On**: ESP32 will start in Mode 1
3. **Connect to Setup Network**: Connect to "PlantMonitor_Setup" Wi-Fi
4. **Configure**: Fill in all fields in the portal
5. **Test**: Verify device connects and sends data

### For Visitors

1. **Power On**: ESP32 will start in Mode 2
2. **Connect to Setup Network**: Connect to "PlantMonitor_Setup" Wi-Fi  
3. **Configure Wi-Fi**: Fill in only Wi-Fi details
4. **Verify**: Device should connect and start sending data

## Testing

### Reset to Factory Settings

To test Mode 1 again, you can reset the device:

```cpp
// Add this function call in setup() for testing
resetToFactory();
```

### Serial Monitor Output

The device provides detailed feedback via Serial Monitor:

```
=== Smart Plant Monitor Setup ===
First time setup: YES
Current serial number: 00001
Mode 1: First-time setup - showing Wi-Fi fields and Tag ID
Portal will show: Wi-Fi Network, Wi-Fi Password, Tag ID
Serial number saved: 98765
Default passcode set: 12345
=== Setup Complete ===
Connected to WiFi!
IP Address: 192.168.1.100
Serial Number: 98765
Passcode: 12345
Setup complete. Starting sensor monitoring...
MQTT Topic: plant/98765/data
```

## Troubleshooting

### Common Issues

1. **Portal Not Loading**: Check if connected to "PlantMonitor_Setup" network
2. **Wi-Fi Connection Fails**: Verify Wi-Fi credentials are correct
3. **Device Stuck in Setup**: Check Serial Monitor for error messages
4. **Wrong Mode**: Reset device to factory settings if needed

### Debug Commands

Add these to Serial Monitor for debugging:

```cpp
// Check current settings
Serial.print("Serial: "); Serial.println(serialNumber);
Serial.print("Passcode: "); Serial.println(passcode);
Serial.print("WiFi: "); Serial.println(WiFi.SSID());
```

## MQTT Data Format

Once configured, the device sends data to:
- **Topic**: `plant/{serialNumber}/data`
- **Format**: JSON
- **Example**: `{"temperature":28.7,"humidity":68.4,"moisture":3}`

## Security Notes

- Default passcode (12345) is automatically set internally
- Passcode is stored in ESP32's non-volatile memory but not shown in portal
- Visitors cannot access or change the passcode
- Tag ID is protected in Mode 2
- Wi-Fi credentials are not stored permanently

## File Structure

```
esp32/
├── smart_plant_monitor.ino          # Original code
├── smart_plant_monitor_dual_mode.ino # New dual-mode code
└── DUAL_MODE_SETUP_GUIDE.md        # This guide
```

## Next Steps

1. Test the dual-mode system with your ESP32
2. Verify MQTT data is received by the Heroku backend
3. Check that dashboard shows real sensor values
4. Prepare devices for Open House 2025
