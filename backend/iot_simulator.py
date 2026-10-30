"""
IoT Sensor Simulator (ESP32 Edge Node Emulation)
Project: AIoT-Based Adaptive Smart Home Automation Using DNN and Generative AI
Label: AIoT Software Prototype — IoT sensors and DNN predictions are currently simulated.
"""

import time
import math
import random
from typing import Dict, Any, List
from datetime import datetime

class IoTSimulator:
    def __init__(self):
        self.device_id = "ESP32-AIOT-NODE-01"
        self.firmware = "FreeRTOS-v2.4.1-EdgeAI"
        self.mac_address = "24:6F:28:B1:7A:4C"
        self.is_online = True
        self.packet_count = 1420
        self.created_at = time.time()
        
        # State variables
        self.temperature = 25.4      # Celsius
        self.humidity = 58.0         # %
        self.light_lux = 420.0       # Lux
        self.pir_motion = 1          # 1: Detected, 0: None
        self.occupancy = True        # Active room occupancy
        self.aqi_ppm = 42            # Air Quality (PPM equivalent)
        self.door_window_open = False # Reed switch sensor
        self.voltage = 230.2         # Volts AC
        self.override_active = False # Manual override flag
        self.override_data: Dict[str, Any] = {}
        
        # Time-series telemetry buffer for charts (last 24 data points)
        self.telemetry_history: List[Dict[str, Any]] = []
        self._initialize_history()

    def _initialize_history(self):
        now = time.time()
        for i in range(24, 0, -1):
            t_offset = now - (i * 180) # 3-minute steps
            t_str = datetime.fromtimestamp(t_offset).strftime("%H:%M")
            base_temp = 24.0 + 3.0 * math.sin((i / 24.0) * math.pi) + random.uniform(-0.4, 0.4)
            base_hum = 55.0 + random.uniform(-4, 4)
            base_pwr = 450 + 800 * (1 if (8 < (i % 24) < 22) else 0.2) + random.uniform(-50, 50)
            self.telemetry_history.append({
                "time": t_str,
                "temperature": round(base_temp, 1),
                "humidity": round(base_hum, 1),
                "power": round(base_pwr, 1),
                "light_lux": int(300 + 400 * max(0, math.sin(i / 3.8))),
                "aqi": int(35 + random.uniform(0, 15))
            })

    def update_tick(self, appliance_power: float = 0.0) -> Dict[str, Any]:
        """Perform autonomous simulation cycle with realistic physical micro-drifts."""
        self.packet_count += 1
        now_ts = time.time()
        
        if not self.override_active:
            # Natural micro-fluctuation with mean reversion
            t_delta = (random.random() - 0.49) * 0.15
            self.temperature = max(18.0, min(38.0, self.temperature + t_delta))
            
            h_delta = (random.random() - 0.49) * 0.3
            self.humidity = max(30.0, min(90.0, self.humidity + h_delta))
            
            # Subtle lux variance (cloud simulation / indoor lights)
            l_delta = (random.random() - 0.5) * 8.0
            self.light_lux = max(10.0, min(1200.0, self.light_lux + l_delta))
            
            # Motion & occupancy persistence
            if random.random() < 0.05:
                self.pir_motion = 1 if self.pir_motion == 0 else 1
            if random.random() < 0.03:
                self.pir_motion = 0
            
            # AQI subtle drift
            if random.random() < 0.1:
                self.aqi_ppm = max(20, min(160, self.aqi_ppm + random.choice([-1, 0, 1])))
        else:
            # Apply user overrides
            for key, val in self.override_data.items():
                if hasattr(self, key):
                    setattr(self, key, val)

        # Baseline standby load + appliance power + slight noise
        base_standby = 48.0 + random.uniform(-2.0, 2.0)
        total_power = round(base_standby + appliance_power, 1)
        self.voltage = round(230.0 + random.uniform(-1.5, 1.5), 1)
        current_amps = round(total_power / max(1.0, self.voltage), 2)
        
        # CRC checksum simulation for packet authenticity
        crc_val = f"0x{(self.packet_count * 1337) % 0xFFFF:04X}"

        current_data = {
            "device_id": self.device_id,
            "firmware": self.firmware,
            "mac_address": self.mac_address,
            "is_online": self.is_online,
            "packet_count": self.packet_count,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "temperature": round(self.temperature, 1),
            "humidity": round(self.humidity, 1),
            "light_lux": round(self.light_lux, 0),
            "pir_motion": self.pir_motion,
            "occupancy": self.occupancy,
            "aqi_ppm": int(self.aqi_ppm),
            "door_window_open": self.door_window_open,
            "voltage": self.voltage,
            "current_amps": current_amps,
            "power_consumption": total_power,
            "crc_checksum": crc_val,
            "simulation_mode": "MANUAL_OVERRIDE" if self.override_active else "AUTONOMOUS_SIMULATION"
        }

        # Keep rolling telemetry history
        if self.packet_count % 3 == 0:
            time_label = datetime.now().strftime("%H:%M:%S")
            self.telemetry_history.append({
                "time": time_label,
                "temperature": round(self.temperature, 1),
                "humidity": round(self.humidity, 1),
                "power": total_power,
                "light_lux": int(self.light_lux),
                "aqi": int(self.aqi_ppm)
            })
            if len(self.telemetry_history) > 30:
                self.telemetry_history.pop(0)

        return current_data

    def set_override(self, overrides: Dict[str, Any]):
        """Inject forced sensor values for live demonstrations."""
        self.override_active = True
        self.override_data.update(overrides)
        for key, val in overrides.items():
            if hasattr(self, key):
                setattr(self, key, val)

    def clear_override(self):
        """Restore normal autonomous IoT telemetry simulation."""
        self.override_active = False
        self.override_data = {}

# Global singleton
iot_simulator = IoTSimulator()
