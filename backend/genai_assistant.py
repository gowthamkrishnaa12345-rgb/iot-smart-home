"""
Generative AI Smart Home Assistant & Reasoning Engine
Project: AIoT-Based Adaptive Smart Home Automation Using DNN and Generative AI

MANDATE:
Does NOT mutate appliance hardware directly.
Emits a Structured Command → Safety Validator → Automation Engine → Appliance.
"""

import re
from typing import Dict, Any, List, Optional
from datetime import datetime
from safety_validator import safety_validator

class GenAIAssistant:
    def __init__(self):
        self.name = "Aegis-GenAI Assistant"
        self.model = "GenAI Local Reasoning Engine (Zero-Key Edge AI)"
        self.conversation_history: List[Dict[str, Any]] = []
        self._seed_conversation()

    def _seed_conversation(self):
        self.conversation_history.append({
            "sender": "assistant",
            "text": "Hello! I am your AIoT Smart Home Assistant. I monitor sensor telemetry, coordinate with the DNN prediction model, and route all actions through our real-time Safety Validator layer. How can I assist you today?",
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "structured_command": None,
            "safety_result": None
        })

    def process_message(
        self,
        user_message: str,
        sensors: Dict[str, Any],
        dnn_pred: Dict[str, Any],
        appliances: Dict[str, Any],
        active_mode: str,
        automation_engine
    ) -> Dict[str, Any]:
        """
        Process user natural language message through the 6-stage architecture:
        User → GenAI → Structured Command → Safety Validator → Automation Engine → Smart Appliance
        """
        msg = user_message.strip()
        msg_lower = msg.lower()
        now_time = datetime.now().strftime("%H:%M:%S")

        temp = sensors.get("temperature", 25.0)
        hum = sensors.get("humidity", 55.0)
        power = sensors.get("power_consumption", 380.0)
        aqi = sensors.get("aqi_ppm", 42)
        occupancy = dnn_pred.get("occupancy_prediction", "OCCUPIED")
        cooling_req = dnn_pred.get("cooling_requirement", "LOW")
        cooling_conf = dnn_pred.get("cooling_confidence", 92.0)
        comfort = dnn_pred.get("comfort_status", "COMFORTABLE")

        structured_command: Optional[Dict[str, Any]] = None
        safety_result: Optional[Dict[str, Any]] = None
        assistant_reply = ""
        action_executed = False

        # --- INTENT 1: "Why did you turn on the fan?" (Scenario 3) ---
        if ("why" in msg_lower and "fan" in msg_lower) or ("reason" in msg_lower and "fan" in msg_lower):
            fan = appliances.get("smart_fan", {})
            fan_speed = fan.get("speed", 3)
            fan_state = "ON" if fan.get("is_on") else "OFF"
            
            if fan_state == "ON":
                assistant_reply = (
                    f"The smart fan is currently ON (Speed {fan_speed}) because the indoor temperature "
                    f"is elevated at {temp}°C with {hum}% relative humidity, and active room occupancy was confirmed "
                    f"by the PIR motion sensor. Our Deep Neural Network (DNN) classified the cooling demand as "
                    f"'{cooling_req}' with {cooling_conf}% confidence, prioritizing air circulation before or alongside AC."
                )
            else:
                assistant_reply = (
                    f"The fan is currently OFF because the room is either vacant (Occupancy: {occupancy}) or "
                    f"ambient conditions ({temp}°C, {hum}% RH) are within the comfortable threshold with LOW cooling demand."
                )

        # --- INTENT 2: "Why is the AC on?" or General DNN Explanations ---
        elif "why" in msg_lower and "ac" in msg_lower:
            assistant_reply = (
                f"The AC recommendation is driven by the DNN inference model. Indoor temperature is {temp}°C "
                f"against the 24°C comfort target. With cooling requirement classified as '{cooling_req}', "
                f"the automation engine operates the inverter AC to bring room temperature down to the ASHRAE-55 envelope."
            )

        # --- INTENT 3: "I am leaving home" / Away Mode (Scenario 2) ---
        elif any(phrase in msg_lower for phrase in ["leaving home", "leave home", "i'm leaving", "away mode", "going out"]):
            structured_command = {
                "command_type": "MODE_CHANGE",
                "target_mode": "Away",
                "source": "GENAI_ASSISTANT",
                "action": "ACTIVATE_MODE"
            }
            # Route via Safety Validator
            safety_result = safety_validator.validate_command(
                command=structured_command,
                current_sensors=sensors,
                current_appliances=appliances,
                current_mode=active_mode
            )

            if safety_result["is_valid"]:
                automation_engine.set_mode("Away", dnn_pred, sensors)
                action_executed = True
                assistant_reply = (
                    "Understood. Initiating 'Leaving Home' protocol through the Safety Validator:\n"
                    "• Switched off Smart Lights\n"
                    "• Switched off Ceiling Fan\n"
                    "• Deactivated Inverter AC\n"
                    "• Armed Perimeter Security System (Ultrasonic + Reed Switches active)\n"
                    "Your home is now secured in low-power Away mode."
                )
            else:
                assistant_reply = f"Safety Validator blocked mode change: {safety_result['reason']}"

        # --- INTENT 4: "Set the home to sleep mode" ---
        elif any(phrase in msg_lower for phrase in ["sleep mode", "go to sleep", "going to bed", "good night"]):
            structured_command = {
                "command_type": "MODE_CHANGE",
                "target_mode": "Sleep",
                "source": "GENAI_ASSISTANT",
                "action": "ACTIVATE_MODE"
            }
            safety_result = safety_validator.validate_command(
                command=structured_command,
                current_sensors=sensors,
                current_appliances=appliances,
                current_mode=active_mode
            )

            if safety_result["is_valid"]:
                automation_engine.set_mode("Sleep", dnn_pred, sensors)
                action_executed = True
                assistant_reply = (
                    "Activated Sleep Mode:\n"
                    "• Lights switched OFF\n"
                    "• AC adjusted to 24°C whisper quiet Eco mode\n"
                    "• Fan set to gentle night speed (2)\n"
                    "• Perimeter security engaged while allowing internal movement."
                )
            else:
                assistant_reply = f"Safety Validator blocked request: {safety_result['reason']}"

        # --- INTENT 5: Appliance Control: Turn on / off Fan ---
        elif "turn on" in msg_lower and "fan" in msg_lower:
            structured_command = {
                "command_type": "APPLIANCE_CONTROL",
                "target_appliance": "smart_fan",
                "action": "TURN_ON",
                "parameters": {"is_on": True, "speed": 4},
                "source": "GENAI_ASSISTANT"
            }
            safety_result = safety_validator.validate_command(
                command=structured_command,
                current_sensors=sensors,
                current_appliances=appliances,
                current_mode=active_mode
            )

            if safety_result["is_valid"]:
                automation_engine.manual_control("smart_fan", {"is_on": True, "speed": 4, "auto_mode": False}, sensors)
                action_executed = True
                assistant_reply = (
                    f"Fan command validated and dispatched! Ceiling fan is now ON at Speed 4. "
                    f"Power load increased by ~56W (Safety check: APPROVED)."
                )
            else:
                assistant_reply = f"Safety Validator alert: {safety_result['reason']}"

        elif "turn off" in msg_lower and "fan" in msg_lower:
            structured_command = {
                "command_type": "APPLIANCE_CONTROL",
                "target_appliance": "smart_fan",
                "action": "TURN_OFF",
                "parameters": {"is_on": False},
                "source": "GENAI_ASSISTANT"
            }
            safety_result = safety_validator.validate_command(
                command=structured_command,
                current_sensors=sensors,
                current_appliances=appliances,
                current_mode=active_mode
            )
            if safety_result["is_valid"]:
                automation_engine.manual_control("smart_fan", {"is_on": False, "auto_mode": False}, sensors)
                action_executed = True
                assistant_reply = "Fan turned OFF. Hardware relay opened successfully."
            else:
                assistant_reply = f"Safety Validator alert: {safety_result['reason']}"

        # --- INTENT 6: Appliance Control: AC ---
        elif "turn on" in msg_lower and "ac" in msg_lower:
            structured_command = {
                "command_type": "APPLIANCE_CONTROL",
                "target_appliance": "smart_ac",
                "action": "TURN_ON",
                "parameters": {"is_on": True, "temperature": 23, "mode": "Cool"},
                "source": "GENAI_ASSISTANT"
            }
            safety_result = safety_validator.validate_command(
                command=structured_command,
                current_sensors=sensors,
                current_appliances=appliances,
                current_mode=active_mode
            )
            if safety_result["is_valid"]:
                params = safety_result.get("parameters", {"temperature": 23})
                automation_engine.manual_control("smart_ac", {"is_on": True, "temperature": params.get("temperature", 23), "auto_mode": False}, sensors)
                action_executed = True
                assistant_reply = (
                    f"AC command passed safety validation ({safety_result['safety_status']}): "
                    f"Inverter AC turned ON set to {params.get('temperature', 23)}°C. "
                    f"{safety_result['reason']}"
                )
            else:
                assistant_reply = f"AC activation prevented by Safety Validator: {safety_result['reason']}"

        elif "turn off" in msg_lower and "ac" in msg_lower:
            structured_command = {
                "command_type": "APPLIANCE_CONTROL",
                "target_appliance": "smart_ac",
                "action": "TURN_OFF",
                "parameters": {"is_on": False},
                "source": "GENAI_ASSISTANT"
            }
            safety_result = safety_validator.validate_command(
                command=structured_command,
                current_sensors=sensors,
                current_appliances=appliances,
                current_mode=active_mode
            )
            if safety_result["is_valid"]:
                automation_engine.manual_control("smart_ac", {"is_on": False, "auto_mode": False}, sensors)
                action_executed = True
                assistant_reply = "Inverter AC compressor powered down safely."
            else:
                assistant_reply = f"Safety Validator alert: {safety_result['reason']}"

        # --- INTENT 7: Appliance Control: Lights ---
        elif ("turn on" in msg_lower or "switch on" in msg_lower) and "light" in msg_lower:
            structured_command = {
                "command_type": "APPLIANCE_CONTROL",
                "target_appliance": "smart_light",
                "action": "TURN_ON",
                "parameters": {"is_on": True, "brightness": 85},
                "source": "GENAI_ASSISTANT"
            }
            safety_result = safety_validator.validate_command(
                command=structured_command,
                current_sensors=sensors,
                current_appliances=appliances,
                current_mode=active_mode
            )
            if safety_result["is_valid"]:
                automation_engine.manual_control("smart_light", {"is_on": True, "brightness": 85, "auto_mode": False}, sensors)
                action_executed = True
                assistant_reply = "Living room smart lights powered ON at 85% brightness."
            else:
                assistant_reply = f"Action blocked by Safety Validator: {safety_result['reason']}"

        elif ("turn off" in msg_lower or "switch off" in msg_lower) and "light" in msg_lower:
            structured_command = {
                "command_type": "APPLIANCE_CONTROL",
                "target_appliance": "smart_light",
                "action": "TURN_OFF",
                "parameters": {"is_on": False},
                "source": "GENAI_ASSISTANT"
            }
            safety_result = safety_validator.validate_command(
                command=structured_command,
                current_sensors=sensors,
                current_appliances=appliances,
                current_mode=active_mode
            )
            if safety_result["is_valid"]:
                automation_engine.manual_control("smart_light", {"is_on": False, "auto_mode": False}, sensors)
                action_executed = True
                assistant_reply = "Smart lighting switched OFF."
            else:
                assistant_reply = f"Action blocked: {safety_result['reason']}"

        # --- INTENT 8: "What is the current temperature?" ---
        elif "temperature" in msg_lower:
            assistant_reply = (
                f"The ambient indoor temperature measured by our ESP32 sensor node is {temp}°C "
                f"with {hum}% relative humidity. The DNN model interprets this as {comfort}."
            )

        # --- INTENT 9: "Is the room comfortable?" ---
        elif "comfortable" in msg_lower or "comfort" in msg_lower:
            desc = dnn_pred.get("comfort_description", "Comfort level normal")
            assistant_reply = (
                f"Current Room Comfort Assessment: **{comfort}**\n"
                f"• Temperature: {temp}°C\n"
                f"• Relative Humidity: {hum}%\n"
                f"• Diagnostic: {desc}\n"
                f"• DNN Cooling Requirement: {cooling_req} ({cooling_conf}% confidence)."
            )

        # --- INTENT 10: "How can I reduce energy consumption?" ---
        elif "energy" in msg_lower or "power" in msg_lower or "reduce" in msg_lower or "save" in msg_lower:
            assistant_reply = (
                f"Based on real-time telemetry (Current load: {power}W), here are the top 3 energy-saving strategies:\n"
                f"1. **Raise AC Setpoint**: Increasing AC from 22°C to 25°C reduces cooling compressor draw by ~18%.\n"
                f"2. **Utilize Ceiling Fan Airflow**: Combining fan air velocity (Speed 2-3) with moderate cooling saves up to 450W hourly.\n"
                f"3. **Daylight Harvesting**: With ambient light at {int(sensors.get('light_lux', 400))} Lux, smart lights can be dimmed to 30%.\n"
                f"You can also activate 'Energy Saving Mode' anytime via the automation selector."
            )

        # --- INTENT 11: General queries / Fallback ---
        else:
            assistant_reply = (
                f"I processed your message: \"{msg}\".\n"
                f"System Snapshot: Indoor Temp {temp}°C, Humidity {hum}%, Active Mode '{active_mode}', "
                f"DNN Comfort '{comfort}'. You can ask me to control appliances, query energy tips, "
                f"or ask explanations such as 'Why did you turn on the fan?'"
            )

        user_entry = {"sender": "user", "text": msg, "timestamp": now_time}
        bot_entry = {
            "sender": "assistant",
            "text": assistant_reply,
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "structured_command": structured_command,
            "safety_result": safety_result,
            "action_executed": action_executed
        }

        self.conversation_history.append(user_entry)
        self.conversation_history.append(bot_entry)

        if len(self.conversation_history) > 40:
            self.conversation_history = self.conversation_history[-40:]

        return {
            "reply": assistant_reply,
            "structured_command": structured_command,
            "safety_result": safety_result,
            "action_executed": action_executed,
            "conversation_history": self.conversation_history
        }

# Global singleton
genai_assistant = GenAIAssistant()
