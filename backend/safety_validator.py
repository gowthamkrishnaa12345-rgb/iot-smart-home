"""
Safety Validator Layer
Project: AIoT-Based Adaptive Smart Home Automation Using DNN and Generative AI

MANDATE:
The GenAI Assistant NEVER directly controls smart home hardware.
Pipeline:
User → GenAI → Structured Command → Safety Validator → Automation Engine → Smart Appliance
"""

import time
from typing import Dict, Any, List, Optional
from datetime import datetime

class SafetyValidator:
    def __init__(self):
        self.audit_log: List[Dict[str, Any]] = []
        self.last_ac_toggle_time = 0.0
        self.MAX_CIRCUIT_POWER_WATTS = 3500.0  # Main circuit breaker threshold
        
        # Populate initial realistic audit records
        self._seed_initial_audit()

    def _seed_initial_audit(self):
        self.audit_log.append({
            "id": "SEC-LOG-101",
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "source": "AUTOMATION_ENGINE",
            "target": "Smart AC",
            "proposed_action": "TURN_ON (Temp 24°C)",
            "safety_status": "APPROVED",
            "checks_passed": ["Power Budget OK", "Compressor Safe", "No Window Conflict"],
            "reason": "Temperature exceeded 26°C comfort envelope; power reserve 1800W available.",
            "action_taken": "Dispatched to hardware relay"
        })
        self.audit_log.append({
            "id": "SEC-LOG-102",
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "source": "GENAI_ASSISTANT",
            "target": "Smart Fan",
            "proposed_action": "TURN_ON (Speed 4)",
            "safety_status": "APPROVED",
            "checks_passed": ["Safety Rules OK", "Load Nominal (45W)"],
            "reason": "Natural language request passed safety validation rules.",
            "action_taken": "Dispatched to hardware relay"
        })

    def validate_command(
        self,
        command: Dict[str, Any],
        current_sensors: Dict[str, Any],
        current_appliances: Dict[str, Any],
        current_mode: str
    ) -> Dict[str, Any]:
        """
        Validates structured command against physical safety invariants before hardware execution.
        Returns validation result: APPROVED, MODIFIED, or REJECTED.
        """
        target = command.get("target_appliance", "").lower()
        action = command.get("action", "").upper() # e.g. "TURN_ON", "TURN_OFF", "SET_VALUE", "SET_MODE"
        params = command.get("parameters", {})
        source = command.get("source", "GENAI_ASSISTANT")
        now_ts = time.time()
        
        current_power = current_sensors.get("power_consumption", 400.0)
        door_open = current_sensors.get("door_window_open", False)
        temp = current_sensors.get("temperature", 25.0)

        checks_passed = []
        safety_status = "APPROVED"
        reason = "Command conforms to all safety invariants and power limits."
        action_taken = "Dispatched to Automation Engine"
        modified_params = dict(params)

        # CHECK 1: Emergency Mode Lockout
        if current_mode == "Emergency" and target != "security_system" and action == "TURN_OFF":
            safety_status = "REJECTED"
            reason = "SECURITY LOCKOUT: Appliances cannot be turned off during active Emergency Protocol."
            action_taken = "Blocked by Safety Validator"

        # CHECK 2: AC Specific Safety Invariants
        elif "ac" in target or target == "smart_ac":
            if action == "TURN_ON":
                # Check compressor rapid-cycling delay (min 5 seconds in simulation)
                if now_ts - self.last_ac_toggle_time < 5.0:
                    safety_status = "REJECTED"
                    reason = "COMPRESSOR PROTECTION: Rapid AC cycling detected. Waiting for pressure stabilization (5s delay)."
                    action_taken = "Blocked by Safety Validator"
                # Check exterior window open
                elif door_open:
                    safety_status = "MODIFIED"
                    reason = "THERMAL EFFICIENCY ALERT: Exterior door/window is open. AC allowed in Low-Power Eco mode only."
                    modified_params["mode"] = "Eco"
                    modified_params["temperature"] = 26
                    action_taken = "Modified to Eco Mode (26°C) & Alert Triggered"
                    self.last_ac_toggle_time = now_ts
                # Check power budget
                elif (current_power + 1200.0) > self.MAX_CIRCUIT_POWER_WATTS:
                    safety_status = "REJECTED"
                    reason = f"POWER BUDGET EXCEEDED: AC power (1200W) + Current ({current_power}W) exceeds circuit limit ({self.MAX_CIRCUIT_POWER_WATTS}W)."
                    action_taken = "Blocked to prevent breaker trip"
                else:
                    self.last_ac_toggle_time = now_ts
                    checks_passed.append("Compressor Timing OK")
                    checks_passed.append("Thermal Envelope OK")
                    checks_passed.append("Power Budget OK")

            # Check extreme set-point temperatures
            if "temperature" in modified_params:
                req_temp = modified_params["temperature"]
                if req_temp < 18:
                    safety_status = "MODIFIED"
                    modified_params["temperature"] = 18
                    reason = "TEMPERATURE BOUND: AC set-point capped at minimum safe limit of 18°C to prevent coil freezing."
                    action_taken = "Modified setpoint to 18°C"
                elif req_temp > 30:
                    safety_status = "MODIFIED"
                    modified_params["temperature"] = 30
                    reason = "TEMPERATURE BOUND: AC set-point capped at maximum reasonable limit of 30°C."
                    action_taken = "Modified setpoint to 30°C"

        # CHECK 3: Total Power Overload Protection for other appliances
        elif action == "TURN_ON":
            est_load = 100.0
            if "exhaust" in target:
                est_load = 75.0
            elif "fan" in target:
                est_load = 55.0
            elif "light" in target:
                est_load = 30.0

            if (current_power + est_load) > self.MAX_CIRCUIT_POWER_WATTS:
                safety_status = "REJECTED"
                reason = f"OVERLOAD PROTECTION: Turning ON {target} exceeds total safe power capacity."
                action_taken = "Blocked by Safety Validator"
            else:
                checks_passed.append("Power Capacity OK")
                checks_passed.append("Device Clearance OK")

        # CHECK 4: Away Mode Safeguard
        if current_mode == "Away" and action == "TURN_ON" and target != "security_system" and source == "AUTOMATION_ENGINE":
            safety_status = "REJECTED"
            reason = "AWAY MODE ENFORCED: Autonomous background activation blocked while home is set to Away mode."
            action_taken = "Suppressed by Safety Validator"

        log_entry = {
            "id": f"SEC-LOG-{len(self.audit_log) + 101}",
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "source": source,
            "target": target,
            "proposed_action": f"{action} {str(modified_params) if modified_params else ''}",
            "safety_status": safety_status,
            "checks_passed": checks_passed if checks_passed else ["Safety Rules Evaluated"],
            "reason": reason,
            "action_taken": action_taken
        }
        
        self.audit_log.insert(0, log_entry)
        if len(self.audit_log) > 50:
            self.audit_log.pop()

        return {
            "is_valid": safety_status in ["APPROVED", "MODIFIED"],
            "safety_status": safety_status,
            "reason": reason,
            "action_taken": action_taken,
            "parameters": modified_params,
            "audit_entry": log_entry
        }

# Global singleton
safety_validator = SafetyValidator()
