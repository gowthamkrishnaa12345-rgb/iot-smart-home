"""
Automation Engine & Adaptive Smart Home Controller
Project: AIoT-Based Adaptive Smart Home Automation Using DNN and Generative AI
"""

from typing import Dict, Any, List
from datetime import datetime
from safety_validator import safety_validator

class AutomationEngine:
    def __init__(self):
        self.active_mode = "Home"  # Modes: Home, Away, Sleep, Energy Saving, Emergency
        
        # Appliances Definition
        self.appliances: Dict[str, Dict[str, Any]] = {
            "smart_light": {
                "id": "smart_light",
                "name": "Smart Living Light",
                "icon": "lightbulb",
                "is_on": True,
                "auto_mode": True,
                "power_watts": 28.5,
                "rated_power": 35.0,
                "brightness": 75, # %
                "status_reason": "Active: Room occupied, ambient lux optimal (420 Lux)"
            },
            "smart_fan": {
                "id": "smart_fan",
                "name": "Adaptive Ceiling Fan",
                "icon": "fan",
                "is_on": True,
                "auto_mode": True,
                "power_watts": 48.0,
                "rated_power": 65.0,
                "speed": 3, # 1 to 5
                "status_reason": "Adaptive: Running at speed 3 to maintain room airflow"
            },
            "smart_ac": {
                "id": "smart_ac",
                "name": "Inverter AC Unit",
                "icon": "air-vent",
                "is_on": False,
                "auto_mode": True,
                "power_watts": 0.0,
                "rated_power": 1250.0,
                "temperature": 24, # °C
                "mode": "Cool",    # Cool, Eco, Dry
                "status_reason": "Standby: Ambient temperature (25.4°C) is within comfort band"
            },
            "exhaust_fan": {
                "id": "exhaust_fan",
                "name": "Smart Exhaust Fan",
                "icon": "wind",
                "is_on": False,
                "auto_mode": True,
                "power_watts": 0.0,
                "rated_power": 55.0,
                "status_reason": "Standby: Indoor AQI (42 PPM) is healthy"
            },
            "security_system": {
                "id": "security_system",
                "name": "AIoT Perimeter Security",
                "icon": "shield-check",
                "is_on": False,
                "auto_mode": True,
                "power_watts": 12.0,
                "rated_power": 15.0,
                "armed_mode": "Disarmed", # Disarmed, Armed-Away, Armed-Sleep, Perimeter
                "status_reason": "Disarmed: Home mode active, room presence detected"
            }
        }
        
        self.automation_log: List[Dict[str, str]] = []
        self._log_event("Automation Engine initialized in Home Mode.")

    def _log_event(self, message: str):
        self.automation_log.insert(0, {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "event": message
        })
        if len(self.automation_log) > 30:
            self.automation_log.pop()

    def get_total_appliance_power(self) -> float:
        total = 0.0
        for app in self.appliances.values():
            if app["is_on"]:
                total += app["power_watts"]
        return round(total, 1)

    def set_mode(self, mode: str, dnn_pred: Dict[str, Any], sensors: Dict[str, Any]) -> Dict[str, Any]:
        """Switch overall system mode and enforce corresponding automation policy."""
        valid_modes = ["Home", "Away", "Sleep", "Energy Saving", "Emergency"]
        if mode not in valid_modes:
            return {"success": False, "error": f"Invalid mode. Choose from {valid_modes}"}

        self.active_mode = mode
        self._log_event(f"System switched to {mode.upper()} Mode.")

        if mode == "Away":
            # SCENARIO 2 / AWAY: Turn off lights, fan, AC, arm security
            self.appliances["smart_light"]["is_on"] = False
            self.appliances["smart_light"]["power_watts"] = 0.0
            self.appliances["smart_light"]["status_reason"] = "Away Protocol: Switched OFF to eliminate idle waste."

            self.appliances["smart_fan"]["is_on"] = False
            self.appliances["smart_fan"]["power_watts"] = 0.0
            self.appliances["smart_fan"]["status_reason"] = "Away Protocol: Switched OFF."

            self.appliances["smart_ac"]["is_on"] = False
            self.appliances["smart_ac"]["power_watts"] = 0.0
            self.appliances["smart_ac"]["status_reason"] = "Away Protocol: Compressor deactivated."

            self.appliances["exhaust_fan"]["is_on"] = False
            self.appliances["exhaust_fan"]["power_watts"] = 0.0
            self.appliances["exhaust_fan"]["status_reason"] = "Away Protocol: Standby."

            self.appliances["security_system"]["is_on"] = True
            self.appliances["security_system"]["armed_mode"] = "Armed-Away"
            self.appliances["security_system"]["power_watts"] = 14.5
            self.appliances["security_system"]["status_reason"] = "Away Protocol: Perimeter reed switches & PIR active."

        elif mode == "Sleep":
            self.appliances["smart_light"]["is_on"] = False
            self.appliances["smart_light"]["power_watts"] = 0.0
            self.appliances["smart_light"]["status_reason"] = "Sleep Protocol: Illumination extinguished."

            self.appliances["smart_fan"]["is_on"] = True
            self.appliances["smart_fan"]["speed"] = 2
            self.appliances["smart_fan"]["power_watts"] = 32.0
            self.appliances["smart_fan"]["status_reason"] = "Sleep Protocol: Gentle whisper airflow (Speed 2)."

            self.appliances["smart_ac"]["is_on"] = True
            self.appliances["smart_ac"]["temperature"] = 24
            self.appliances["smart_ac"]["mode"] = "Eco"
            self.appliances["smart_ac"]["power_watts"] = 720.0
            self.appliances["smart_ac"]["status_reason"] = "Sleep Protocol: Thermal comfort envelope (24°C Eco)."

            self.appliances["security_system"]["is_on"] = True
            self.appliances["security_system"]["armed_mode"] = "Armed-Sleep"
            self.appliances["security_system"]["power_watts"] = 12.0
            self.appliances["security_system"]["status_reason"] = "Sleep Protocol: Outer boundary armed, interior bypass active."

        elif mode == "Energy Saving":
            self.appliances["smart_light"]["is_on"] = True
            self.appliances["smart_light"]["brightness"] = 35
            self.appliances["smart_light"]["power_watts"] = 12.0
            self.appliances["smart_light"]["status_reason"] = "Energy Saving: Dimmed to 35% to conserve power."

            self.appliances["smart_fan"]["is_on"] = True
            self.appliances["smart_fan"]["speed"] = 2
            self.appliances["smart_fan"]["power_watts"] = 30.0
            self.appliances["smart_fan"]["status_reason"] = "Energy Saving: Speed capped at 2 for low energy draw."

            self.appliances["smart_ac"]["is_on"] = False
            self.appliances["smart_ac"]["power_watts"] = 0.0
            self.appliances["smart_ac"]["status_reason"] = "Energy Saving: Standby; fan utilized for eco-cooling."

            self.appliances["security_system"]["armed_mode"] = "Low-Power Guard"

        elif mode == "Emergency":
            self.appliances["exhaust_fan"]["is_on"] = True
            self.appliances["exhaust_fan"]["power_watts"] = 55.0
            self.appliances["exhaust_fan"]["status_reason"] = "EMERGENCY: Max ventilation active for air purge."

            self.appliances["smart_light"]["is_on"] = True
            self.appliances["smart_light"]["brightness"] = 100
            self.appliances["smart_light"]["power_watts"] = 35.0
            self.appliances["smart_light"]["status_reason"] = "EMERGENCY: Max illumination for exit egress path."

            self.appliances["smart_ac"]["is_on"] = False
            self.appliances["smart_ac"]["power_watts"] = 0.0
            self.appliances["smart_ac"]["status_reason"] = "EMERGENCY: HVAC isolated to stop smoke propagation."

            self.appliances["security_system"]["armed_mode"] = "Evacuation-Unlocked"
            self.appliances["security_system"]["status_reason"] = "EMERGENCY: Smart deadbolts disengaged for egress."

        elif mode == "Home":
            # Re-evaluate DNN adaptive rules
            self.evaluate_adaptive_rules(dnn_pred, sensors)

        return {"success": True, "mode": self.active_mode, "appliances": self.appliances}

    def evaluate_adaptive_rules(self, dnn_pred: Dict[str, Any], sensors: Dict[str, Any]):
        """
        Closed-loop adaptive controller that translates DNN predictions and IoT sensor
        telemetry into proportional appliance states when in Auto mode.
        """
        if self.active_mode != "Home":
            return

        temp = sensors.get("temperature", 25.0)
        hum = sensors.get("humidity", 55.0)
        lux = sensors.get("light_lux", 400.0)
        aqi = sensors.get("aqi_ppm", 42)
        occupancy = dnn_pred.get("occupancy_prediction") == "OCCUPIED"
        cooling_req = dnn_pred.get("cooling_requirement", "LOW")

        # 1. SMART LIGHT ADAPTATION
        light = self.appliances["smart_light"]
        if light["auto_mode"]:
            if not occupancy:
                light["is_on"] = False
                light["power_watts"] = 0.0
                light["status_reason"] = "Auto-dimmed: Room is vacant (PIR idle)"
            else:
                light["is_on"] = True
                if lux < 150:
                    light["brightness"] = 90
                    light["power_watts"] = 32.0
                    light["status_reason"] = f"Auto-brightened: Ambient lux low ({int(lux)} Lux)"
                elif lux < 450:
                    light["brightness"] = 65
                    light["power_watts"] = 24.0
                    light["status_reason"] = f"Auto-balanced: Natural ambient light ({int(lux)} Lux)"
                else:
                    light["brightness"] = 30
                    light["power_watts"] = 12.0
                    light["status_reason"] = f"Auto-dimmed: Sufficient daylight ({int(lux)} Lux)"

        # 2. COOLING SYSTEM (FAN & AC) ADAPTATION
        fan = self.appliances["smart_fan"]
        ac = self.appliances["smart_ac"]

        if fan["auto_mode"]:
            if not occupancy:
                fan["is_on"] = False
                fan["power_watts"] = 0.0
                fan["status_reason"] = "Auto-standby: Room is vacant"
            elif cooling_req == "HIGH":
                fan["is_on"] = True
                fan["speed"] = 5
                fan["power_watts"] = 65.0
                fan["status_reason"] = f"Triggered by DNN: Cooling requirement HIGH (Temp {temp}°C, Humidity {hum}%)"
            elif cooling_req == "MEDIUM":
                fan["is_on"] = True
                fan["speed"] = 3
                fan["power_watts"] = 45.0
                fan["status_reason"] = f"Triggered by DNN: Cooling requirement MEDIUM (Temp {temp}°C)"
            else:
                fan["is_on"] = True
                fan["speed"] = 1
                fan["power_watts"] = 28.0
                fan["status_reason"] = "DNN Low Cooling: Whisper airflow maintained"

        if ac["auto_mode"]:
            if not occupancy:
                if ac["is_on"]:
                    ac["is_on"] = False
                    ac["power_watts"] = 0.0
                    ac["status_reason"] = "Auto-shutdown: Room vacant (Energy conservation)"
            elif cooling_req == "HIGH":
                # High cooling demand recommendation
                ac["is_on"] = True
                ac["temperature"] = 22
                ac["mode"] = "Cool"
                ac["power_watts"] = 1280.0
                ac["status_reason"] = f"Triggered by DNN: Active cooling to counter high temp ({temp}°C) & heat index"
            elif cooling_req == "MEDIUM" and temp > 27.0:
                ac["is_on"] = True
                ac["temperature"] = 24
                ac["mode"] = "Eco"
                ac["power_watts"] = 850.0
                ac["status_reason"] = f"Adaptive Eco AC: Moderate cooling to restore {temp}°C to comfort band"
            else:
                ac["is_on"] = False
                ac["power_watts"] = 0.0
                ac["status_reason"] = f"Standby: Room temperature ({temp}°C) within comfort zone; Fan cooling sufficient"

        # 3. EXHAUST FAN ADAPTATION
        exhaust = self.appliances["exhaust_fan"]
        if exhaust["auto_mode"]:
            if aqi > 80:
                exhaust["is_on"] = True
                exhaust["power_watts"] = 52.0
                exhaust["status_reason"] = f"Auto-Purge: Elevated AQI detected ({aqi} PPM)"
            else:
                exhaust["is_on"] = False
                exhaust["power_watts"] = 0.0
                exhaust["status_reason"] = f"Standby: Air quality is healthy ({aqi} PPM)"

        # 4. SECURITY SYSTEM ADAPTATION
        sec = self.appliances["security_system"]
        if sec["auto_mode"]:
            if not occupancy:
                sec["is_on"] = True
                sec["armed_mode"] = "Armed-Away"
                sec["power_watts"] = 12.0
                sec["status_reason"] = "Auto-Armed: Vacancy detected over threshold"
            else:
                sec["is_on"] = False
                sec["armed_mode"] = "Disarmed"
                sec["power_watts"] = 5.0
                sec["status_reason"] = "Disarmed: Verified occupant presence"

    def manual_control(
        self,
        appliance_id: str,
        updates: Dict[str, Any],
        sensors: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Apply manual control directly via safety validator."""
        if appliance_id not in self.appliances:
            return {"success": False, "error": f"Appliance '{appliance_id}' not found"}

        app = self.appliances[appliance_id]
        
        # Check through safety validator
        action = "TURN_ON" if updates.get("is_on", app["is_on"]) else "TURN_OFF"
        validation = safety_validator.validate_command(
            command={
                "target_appliance": appliance_id,
                "action": action,
                "parameters": updates,
                "source": "MANUAL_USER_CONTROL"
            },
            current_sensors=sensors,
            current_appliances=self.appliances,
            current_mode=self.active_mode
        )

        if not validation["is_valid"]:
            return {
                "success": False,
                "error": validation["reason"],
                "safety_status": validation["safety_status"]
            }

        # Apply updates
        if "is_on" in updates:
            app["is_on"] = updates["is_on"]
            if not app["is_on"]:
                app["power_watts"] = 0.0
                app["status_reason"] = "Manually turned OFF by user"
            else:
                # Assign power based on rated appliance
                app["power_watts"] = app["rated_power"]
                app["status_reason"] = "Manually activated by user"

        if "auto_mode" in updates:
            app["auto_mode"] = updates["auto_mode"]
            if app["auto_mode"]:
                app["status_reason"] = "Switched to Autonomous Adaptive Mode"
            else:
                app["status_reason"] = "Manual Override Active (Autonomous rules paused)"

        if "speed" in updates and appliance_id == "smart_fan":
            spd = max(1, min(5, int(updates["speed"])))
            app["speed"] = spd
            app["power_watts"] = round(20.0 + (spd * 9.0), 1)
            app["status_reason"] = f"Manual fan speed set to {spd}"

        if "brightness" in updates and appliance_id == "smart_light":
            br = max(10, min(100, int(updates["brightness"])))
            app["brightness"] = br
            app["power_watts"] = round(10.0 + (br * 0.25), 1)
            app["status_reason"] = f"Manual brightness set to {br}%"

        if "temperature" in updates and appliance_id == "smart_ac":
            temp_set = max(18, min(30, int(updates["temperature"])))
            app["temperature"] = temp_set
            app["status_reason"] = f"Target temperature manually set to {temp_set}°C"

        self._log_event(f"Manual override on {app['name']}: {updates}")
        return {"success": True, "appliance": app, "safety_validation": validation}

# Global singleton
automation_engine = AutomationEngine()
