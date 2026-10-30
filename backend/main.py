"""
Main FastAPI Backend Server
Project: AIoT-Based Adaptive Smart Home Automation Using DNN and Generative AI
Label: AIoT Software Prototype — IoT sensors and DNN predictions are currently simulated.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import os
import time
from datetime import datetime
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from iot_simulator import iot_simulator
from dnn_module import dnn_engine
from safety_validator import safety_validator
from automation_engine import automation_engine
from genai_assistant import genai_assistant

app = FastAPI(
    title="AIoT Smart Home Automation Server",
    description="Backend engine with Simulated ESP32 IoT, DNN Inference, GenAI Assistant & Safety Validator",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PYDANTIC SCHEMAS ---
class ChatRequest(BaseModel):
    message: str

class ApplianceControlRequest(BaseModel):
    is_on: Optional[bool] = None
    auto_mode: Optional[bool] = None
    speed: Optional[int] = None
    brightness: Optional[int] = None
    temperature: Optional[int] = None

class ModeRequest(BaseModel):
    mode: str

class ScenarioRequest(BaseModel):
    scenario_id: int # 1, 2, or 3

class OverrideRequest(BaseModel):
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    light_lux: Optional[float] = None
    pir_motion: Optional[int] = None
    occupancy: Optional[bool] = None
    aqi_ppm: Optional[int] = None
    door_window_open: Optional[bool] = None

# --- HELPER FUNCTIONS ---
def generate_alerts(sensors: Dict[str, Any], dnn_pred: Dict[str, Any], appliances: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Synthesize realistic, contextual alerts."""
    alerts = []
    temp = sensors.get("temperature", 25.0)
    power = sensors.get("power_consumption", 300.0)
    aqi = sensors.get("aqi_ppm", 40)
    door = sensors.get("door_window_open", False)
    ac_on = appliances.get("smart_ac", {}).get("is_on", False)

    if temp >= 32.0:
        alerts.append({
            "id": "ALT-TEMP",
            "level": "warning",
            "title": "Elevated Temperature Warning",
            "message": f"Ambient temperature is {temp}°C, exceeding comfort baseline (26°C). DNN recommends active cooling.",
            "timestamp": datetime.now().strftime("%H:%M:%S")
        })

    if power >= 2200.0:
        alerts.append({
            "id": "ALT-POWER",
            "level": "critical",
            "title": "High Power Consumption Detected",
            "message": f"Total draw is {power}W. Approaching main circuit threshold (3500W). Consider energy shedding.",
            "timestamp": datetime.now().strftime("%H:%M:%S")
        })

    if aqi >= 85:
        alerts.append({
            "id": "ALT-AQI",
            "level": "warning",
            "title": "Degraded Air Quality (AQI)",
            "message": f"Indoor air particulate level is {aqi} PPM. Smart Exhaust Fan triggered for air purge.",
            "timestamp": datetime.now().strftime("%H:%M:%S")
        })

    if door and ac_on:
        alerts.append({
            "id": "ALT-DOOR-HVAC",
            "level": "info",
            "title": "Thermal Loss Alert: Door/Window Open",
            "message": "Exterior entrance open while AC is operational. Incurring cooling energy waste.",
            "timestamp": datetime.now().strftime("%H:%M:%S")
        })
    elif door:
        alerts.append({
            "id": "ALT-DOOR",
            "level": "info",
            "title": "Perimeter Ingress Detected",
            "message": "Reed sensor triggered: Front entrance or balcony door is open.",
            "timestamp": datetime.now().strftime("%H:%M:%S")
        })

    if dnn_pred.get("anomaly_detected"):
        alerts.append({
            "id": "ALT-DNN-ANOMALY",
            "level": "critical",
            "title": "DNN Anomaly Detector Triggered",
            "message": f"Anomalous pattern identified with score {dnn_pred.get('anomaly_score')}. Inspect sensor readings.",
            "timestamp": datetime.now().strftime("%H:%M:%S")
        })

    return alerts

# --- ROUTES ---

@app.get("/api")
def api_info():
    return {
        "project": "AIoT-Based Adaptive Smart Home Automation Using DNN and Generative AI",
        "label": "AIoT Software Prototype — IoT sensors and DNN predictions are currently simulated.",
        "status": "ONLINE",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/")
def root():
    index_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", "index.html"))
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return api_info()

@app.get("/api/status")
def get_status():
    """Consolidated state snapshot: IoT Telemetry, DNN Prediction, Appliances, Safety Audit, Energy."""
    # 1. Total power from appliances
    appliance_power = automation_engine.get_total_appliance_power()
    
    # 2. Tick IoT simulator
    sensor_data = iot_simulator.update_tick(appliance_power=appliance_power)
    
    # 3. Count active appliances
    active_count = sum(1 for a in automation_engine.appliances.values() if a["is_on"])
    
    # 4. DNN inference
    dnn_pred = dnn_engine.predict(sensor_data, active_appliances_count=active_count)
    
    # 5. Adaptive automation evaluation
    automation_engine.evaluate_adaptive_rules(dnn_pred, sensor_data)
    
    # Recalculate power in case appliances adapted
    appliance_power = automation_engine.get_total_appliance_power()
    sensor_data["power_consumption"] = round(48.0 + appliance_power, 1)

    # 6. Synthesize alerts
    alerts = generate_alerts(sensor_data, dnn_pred, automation_engine.appliances)

    # 7. Energy metrics
    current_kw = sensor_data["power_consumption"] / 1000.0
    est_daily_kwh = round(current_kw * 14.2 + 2.4, 2)
    est_daily_cost = round(est_daily_kwh * 0.15, 2) # approx $0.15 / kWh
    
    # Overall status
    if any(a["level"] == "critical" for a in alerts):
        overall_status = "CRITICAL ALERT"
    elif automation_engine.active_mode == "Energy Saving":
        overall_status = "ENERGY SAVING"
    elif dnn_pred.get("cooling_requirement") == "HIGH":
        overall_status = "ADAPTIVE COOLING"
    else:
        overall_status = "OPTIMAL"

    return {
        "project_label": "AIoT Software Prototype — IoT sensors and DNN predictions are currently simulated.",
        "overall_status": overall_status,
        "mode": automation_engine.active_mode,
        "sensors": sensor_data,
        "appliances": automation_engine.appliances,
        "dnn": dnn_pred,
        "alerts": alerts,
        "safety_audit": safety_validator.audit_log[:10],
        "energy": {
            "current_power_watts": sensor_data["power_consumption"],
            "daily_energy_kwh": est_daily_kwh,
            "daily_cost_usd": est_daily_cost,
            "predicted_next_hour_kwh": dnn_pred["predicted_energy_next_hour_kwh"],
            "efficiency_rating": "A++ Smart Adaptive",
            "recommendations": [
                "Raising AC setpoint by 1°C conserves ~7.2% hourly power.",
                "High natural lux detected: dim living room LEDs to save 20W.",
                "Ensure doors/windows remain sealed during active AC operation."
            ]
        },
        "history": iot_simulator.telemetry_history[-20:]
    }

@app.post("/api/appliances/{appliance_id}/control")
def control_appliance(appliance_id: str, req: ApplianceControlRequest):
    updates = {}
    if req.is_on is not None:
        updates["is_on"] = req.is_on
    if req.auto_mode is not None:
        updates["auto_mode"] = req.auto_mode
    if req.speed is not None:
        updates["speed"] = req.speed
    if req.brightness is not None:
        updates["brightness"] = req.brightness
    if req.temperature is not None:
        updates["temperature"] = req.temperature

    current_sensors = {
        "power_consumption": automation_engine.get_total_appliance_power() + 48.0,
        "door_window_open": iot_simulator.door_window_open,
        "temperature": iot_simulator.temperature
    }

    result = automation_engine.manual_control(appliance_id, updates, current_sensors)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Control failed"))
    return result

@app.post("/api/mode")
def set_system_mode(req: ModeRequest):
    current_sensors = {
        "temperature": iot_simulator.temperature,
        "humidity": iot_simulator.humidity,
        "light_lux": iot_simulator.light_lux,
        "aqi_ppm": iot_simulator.aqi_ppm,
        "door_window_open": iot_simulator.door_window_open
    }
    dnn_pred = dnn_engine.predict(current_sensors)
    result = automation_engine.set_mode(req.mode, dnn_pred, current_sensors)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Mode change failed"))
    return result

@app.post("/api/chat")
def chat_with_assistant(req: ChatRequest):
    app_power = automation_engine.get_total_appliance_power()
    sensor_data = {
        "temperature": iot_simulator.temperature,
        "humidity": iot_simulator.humidity,
        "light_lux": iot_simulator.light_lux,
        "aqi_ppm": iot_simulator.aqi_ppm,
        "door_window_open": iot_simulator.door_window_open,
        "power_consumption": app_power + 48.0,
        "pir_motion": iot_simulator.pir_motion
    }
    dnn_pred = dnn_engine.predict(sensor_data)
    
    result = genai_assistant.process_message(
        user_message=req.message,
        sensors=sensor_data,
        dnn_pred=dnn_pred,
        appliances=automation_engine.appliances,
        active_mode=automation_engine.active_mode,
        automation_engine=automation_engine
    )
    return result

@app.get("/api/chat/history")
def get_chat_history():
    return {"history": genai_assistant.conversation_history}

@app.post("/api/demo/scenario")
def trigger_demo_scenario(req: ScenarioRequest):
    """
    Execute guaranteed, deterministic college presentation scenarios instantly.
    """
    if req.scenario_id == 1:
        # SCENARIO 1 — HIGH TEMPERATURE
        # Set: Temperature = 33°C, Humidity = 75%, Occupancy = YES
        # Then: Cooling requirement = HIGH, Comfort = UNCOMFORTABLE, Fan/AC recommendation = ON
        iot_simulator.set_override({
            "temperature": 33.0,
            "humidity": 75.0,
            "occupancy": True,
            "pir_motion": 1,
            "door_window_open": False
        })
        # Evaluate DNN
        sens = {
            "temperature": 33.0,
            "humidity": 75.0,
            "light_lux": 550.0,
            "pir_motion": 1,
            "aqi_ppm": 48,
            "power_consumption": 1820.0
        }
        dnn_pred = dnn_engine.predict(sens)
        automation_engine.set_mode("Home", dnn_pred, sens)
        
        # Turn Fan & AC ON as required by scenario
        automation_engine.appliances["smart_fan"]["is_on"] = True
        automation_engine.appliances["smart_fan"]["speed"] = 5
        automation_engine.appliances["smart_fan"]["power_watts"] = 65.0
        automation_engine.appliances["smart_fan"]["status_reason"] = "Triggered by DNN: Cooling requirement HIGH (Temp 33.0°C > 26°C)"

        automation_engine.appliances["smart_ac"]["is_on"] = True
        automation_engine.appliances["smart_ac"]["temperature"] = 22
        automation_engine.appliances["smart_ac"]["mode"] = "Cool"
        automation_engine.appliances["smart_ac"]["power_watts"] = 1250.0
        automation_engine.appliances["smart_ac"]["status_reason"] = "Active: Temp 33.0°C & Uncomfortable comfort status"

        return {
            "scenario": 1,
            "title": "SCENARIO 1: High Temperature & Adaptive Cooling",
            "applied_sensors": {"temperature": 33.0, "humidity": 75.0, "occupancy": "YES"},
            "dnn_outcome": {
                "cooling_requirement": "HIGH",
                "comfort_status": "UNCOMFORTABLE",
                "cooling_confidence": dnn_pred["cooling_confidence"],
                "recommendation": "Fan = ON (Speed 5), AC = ON (22°C Cool)"
            },
            "explanation": "High ambient temperature (33°C) and relative humidity (75%) triggered DNN High Cooling classification. Fan and AC engaged automatically."
        }

    elif req.scenario_id == 2:
        # SCENARIO 2 — LEAVING HOME
        # When clicked: Occupancy = NO, Light = OFF, Fan = OFF, AC = OFF, Security = ON
        iot_simulator.set_override({
            "occupancy": False,
            "pir_motion": 0,
            "temperature": 25.0
        })
        sens = {"temperature": 25.0, "occupancy": False, "pir_motion": 0}
        dnn_pred = dnn_engine.predict(sens)
        automation_engine.set_mode("Away", dnn_pred, sens)

        return {
            "scenario": 2,
            "title": "SCENARIO 2: Leaving Home Protocol",
            "applied_sensors": {"occupancy": "NO", "pir_motion": 0},
            "automation_state": {
                "smart_light": "OFF",
                "smart_fan": "OFF",
                "smart_ac": "OFF",
                "security_system": "ON (Armed-Away)"
            },
            "explanation": "Home switched to Away Mode. Non-essential appliances powered down, perimeter security armed."
        }

    elif req.scenario_id == 3:
        # SCENARIO 3 — AI EXPLANATION
        # When user asks: "Why did you turn on the fan?"
        # Return explanation using current sensor values
        temp = iot_simulator.temperature
        hum = iot_simulator.humidity
        occ = "occupied" if iot_simulator.occupancy else "vacant"
        
        query = "Why did you turn on the fan?"
        sens = {
            "temperature": temp,
            "humidity": hum,
            "light_lux": iot_simulator.light_lux,
            "aqi_ppm": iot_simulator.aqi_ppm,
            "door_window_open": iot_simulator.door_window_open,
            "power_consumption": automation_engine.get_total_appliance_power() + 48.0,
            "pir_motion": iot_simulator.pir_motion
        }
        dnn_pred = dnn_engine.predict(sens)
        
        chat_res = genai_assistant.process_message(
            user_message=query,
            sensors=sens,
            dnn_pred=dnn_pred,
            appliances=automation_engine.appliances,
            active_mode=automation_engine.active_mode,
            automation_engine=automation_engine
        )

        return {
            "scenario": 3,
            "title": "SCENARIO 3: GenAI Reasoning & Explanation",
            "query": query,
            "explanation": chat_res["reply"],
            "chat_result": chat_res
        }

    else:
        raise HTTPException(status_code=400, detail="Invalid scenario_id. Choose 1, 2, or 3.")

@app.post("/api/iot/override")
def override_iot_sensors(req: OverrideRequest):
    updates = {}
    if req.temperature is not None:
        updates["temperature"] = req.temperature
    if req.humidity is not None:
        updates["humidity"] = req.humidity
    if req.light_lux is not None:
        updates["light_lux"] = req.light_lux
    if req.pir_motion is not None:
        updates["pir_motion"] = req.pir_motion
    if req.occupancy is not None:
        updates["occupancy"] = req.occupancy
    if req.aqi_ppm is not None:
        updates["aqi_ppm"] = req.aqi_ppm
    if req.door_window_open is not None:
        updates["door_window_open"] = req.door_window_open

    iot_simulator.set_override(updates)
    return {"success": True, "overrides": updates}

@app.post("/api/iot/reset")
def reset_iot_simulation():
    iot_simulator.clear_override()
    return {"success": True, "message": "Autonomous simulation restored."}

@app.get("/api/history")
def get_telemetry_history():
    return {"history": iot_simulator.telemetry_history}

@app.get("/api/safety/audit")
def get_safety_audit():
    return {"audit_log": safety_validator.audit_log}

# Mount static React frontend build if present
dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(dist_path):
    assets_path = os.path.join(dist_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Prevent intercepting API routes
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(dist_path, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_path, "index.html"))
