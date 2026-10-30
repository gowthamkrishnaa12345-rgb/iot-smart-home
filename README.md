# AIoT-Based Adaptive Smart Home Automation Using DNN and Generative AI

> **IMPORTANT PRESENTATION LABEL:**  
> **“AIoT Software Prototype — IoT sensors and DNN predictions are currently simulated.”**

---

## 📌 Project Overview
This software prototype demonstrates a next-generation **Artificial Intelligence of Things (AIoT)** smart home management platform. It fuses:
1. **Simulated ESP32 Edge IoT Node Telemetry**: Generates realistic physical sensor streams (Temperature, Humidity, Light Lux, PIR Motion/Occupancy, Air Quality MQ-135, Current/Power CT clamp, Reed Door Switch).
2. **Deep Neural Network (DNN) Multi-Task Inference Engine**: Predicts cooling demand (LOW/MED/HIGH), occupancy likelihood, thermal comfort (ASHRAE-55), hourly energy consumption, and autoencoder anomaly scores, with Explainable AI (XAI) feature importance.
3. **Generative AI Natural Language Assistant**: A zero-key edge conversational reasoning assistant capable of answering diagnostic queries, explaining decisions ("Why did you turn on the fan?"), and translating natural requests into structured commands.
4. **Deterministic Safety Validator & Invariants Layer**: Enforces physical electrical bounds, compressor anti-cycling guards, thermal loss prevention, and mode permissions *before* commands reach hardware actuators.
5. **Adaptive Automation Engine**: Dynamically arbitrates between 5 operating modes (`Home`, `Away`, `Sleep`, `Energy Saving`, `Emergency`).

---

## 🏗️ System Architecture & Safety Layer

```
+---------------+      +-------------------+      +---------------------+
| User Input    | ---> | GenAI Assistant   | ---> | Structured Command  |
| (Voice / Text)|      | (Zero-Key Edge AI)|      | (Validated JSON)    |
+---------------+      +-------------------+      +---------------------+
                                                             |
                                                             v
+---------------+      +-------------------+      +---------------------+
| Smart Relay   | <--- | Automation Engine | <--- | Safety Validator    |
| Actuators     |      | (Mode Controller) |      | (Invariants Check)  |
+---------------+      +-------------------+      +---------------------+
```

### Safety Invariants Enforced:
- **Maximum Power Budget**: Shuts down or rejects loads exceeding the 3,500W main breaker capacity.
- **Compressor Anti-Cycle Protection**: Enforces minimum delay on AC compressors to avoid hydraulic pressure damage.
- **Thermal Window Guard**: Prevents full AC operation when doors/windows are open.
- **Emergency Lockout**: Locks out arbitrary appliance deactivations during active Emergency protocol.

---

## 📂 Project Directory Structure

```
aiot-smart-home/
├── backend/
│   ├── main.py                  # FastAPI REST Server & Static Asset Mounts
│   ├── iot_simulator.py         # ESP32 Edge Telemetry Simulator (CRC, Packets)
│   ├── dnn_module.py            # Multi-head DNN Prototype & XAI Feature Attribution
│   ├── genai_assistant.py       # Local GenAI NLU & Natural Language Reasoning
│   ├── safety_validator.py      # Deterministic Safety Invariants & Live Audit Log
│   ├── automation_engine.py     # 5-Mode Adaptive Controller (Home, Away, Sleep, Eco, Alert)
│   ├── requirements.txt         # Python Dependencies
│   └── start_backend.bat        # 1-Click Backend Server Launcher
│
├── frontend/
│   ├── index.html               # Web Application Entry Point
│   ├── package.json             # NPM Dependencies (React, Recharts, Lucide, Tailwind)
│   ├── vite.config.js           # Vite Server & API Reverse Proxy Configuration
│   ├── tailwind.config.js       # Cyber Dark Theme & Glassmorphism Design Tokens
│   ├── postcss.config.js        # PostCSS Plugins
│   ├── start_frontend.bat       # 1-Click Frontend Dev Server Launcher
│   └── src/
│       ├── main.jsx             # React DOM Root
│       ├── App.jsx              # Main App State, Polling Loop & Tab Coordinator
│       ├── index.css            # Custom Glassmorphism, Glows & Neon Accents
│       ├── services/
│       │   └── api.js           # Unified Fetch Client for REST Endpoints
│       └── components/
│           ├── Navbar.jsx           # Top Bar, Status Badge & Mode Pills
│           ├── ScenarioBar.jsx      # Instant 1-Click Presentation Scenario Runner
│           ├── SensorGrid.jsx       # 8 Primary IoT Metrics (Temp, Hum, Lux, AQI, etc.)
│           ├── ApplianceGrid.jsx    # 5 Appliance Cards with Auto/Manual Controls & Reasons
│           ├── DNNPanel.jsx         # Neural Network Head Outputs, Topology & XAI Bars
│           ├── GenAIChat.jsx        # Conversational AI Assistant with Command Inspector
│           ├── SafetyPipeline.jsx   # 6-Stage Visual Architecture & Live Audit Trail
│           ├── EnergyAnalytics.jsx  # Recharts Historical Graph & AI Conservation Tips
│           ├── IoTSimulatorModal.jsx# ESP32 Node Diagnostics & Manual Slider Overrides
│           └── AlertsBanner.jsx     # Realistic Dismissable Critical/Warning Alerts
│
├── run_project.bat              # Master 1-Click Launcher (Starts both Backend & Frontend)
└── README.md                    # Complete Documentation & Presentation Guide
```

---

## ⚙️ Installation Instructions

### Prerequisites
- **Python**: 3.10+ (Python 3.14 installed)
- **Node.js**: v18+ (Node v20 LTS included in `C:\Users\Asus\nodejs`)

### 1. Backend Setup
Open a terminal in the `backend/` directory:
```bash
cd C:\Users\Asus\.gemini\antigravity\scratch\aiot-smart-home\backend
python -m pip install -r requirements.txt
```

### 2. Frontend Setup
Open a terminal in the `frontend/` directory:
```bash
cd C:\Users\Asus\.gemini\antigravity\scratch\aiot-smart-home\frontend
npm install
```

---

## 🚀 How to Run the Project

### Option A: Master 1-Click Launcher (Recommended)
Double-click:
```bash
C:\Users\Asus\.gemini\antigravity\scratch\aiot-smart-home\run_project.bat
```
This script automatically starts the Python backend, launches the Vite dev server, and opens your browser at `http://localhost:5173`.

### Option B: Manual Execution
**Terminal 1 — Backend:**
```bash
cd C:\Users\Asus\.gemini\antigravity\scratch\aiot-smart-home\backend
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd C:\Users\Asus\.gemini\antigravity\scratch\aiot-smart-home\frontend
npm run dev
```

---

## 🔬 Module Descriptions

| Module | Location | Purpose |
|---|---|---|
| **IoT Telemetry Simulator** | `backend/iot_simulator.py` | Emulates physical ESP32 edge microcontroller with FreeRTOS packet structures, CRC-16 checks, micro-fluctuations, and override hooks. |
| **DNN Prediction Engine** | `backend/dnn_module.py` | Multi-Head neural architecture `[7 -> 16 -> 8 -> Multi-Head]` performing simultaneous cooling classification, occupancy detection, thermal comfort calculation, and SHAP-based feature importance. |
| **Safety Validator Layer** | `backend/safety_validator.py` | Deterministic rules engine that acts as a physical security firewall between GenAI natural language intents and appliance relays. |
| **Automation Engine** | `backend/automation_engine.py` | Closed-loop adaptive controller executing system policies for 5 discrete operational modes (`Home`, `Away`, `Sleep`, `Energy Saving`, `Emergency`). |
| **GenAI Assistant** | `backend/genai_assistant.py` | Offline natural language processing engine parsing conversational intent, generating telemetry-grounded explanations, and formatting structured JSON commands. |
| **Glassmorphism UI** | `frontend/src/` | Futuristic responsive dark dashboard built in React 18, Tailwind CSS, Lucide icons, and Recharts. |

---

## 🎓 College Viva / Demo Walkthrough Guide

Use the **Scenario Bar** at the top of the dashboard for instant, guaranteed live demonstrations during your presentation:

### 🎯 SCENARIO 1 — High Temperature & Adaptive Cooling
1. **Click the red button**: `SCENARIO 1: High Temperature` on the Scenario Bar.
2. **What Happens Instantly**:
   - Simulated ESP32 sensors update to: `Temperature = 33.0°C`, `Humidity = 75%`, `Occupancy = YES`.
   - The **DNN Hub** immediately predicts:
     - `Cooling Requirement = HIGH` (with >95% confidence).
     - `Thermal Comfort = UNCOMFORTABLE` (exceeding ASHRAE-55 baseline).
   - The **Automation Engine** automatically engages:
     - `Smart Fan = ON` (Speed 5, ~65W).
     - `Inverter AC = ON` (Cool Mode, 22°C target).
   - Appliance cards reflect: *"Triggered by DNN: Cooling requirement HIGH (Temp 33.0°C > 26°C)"*.
3. **Viva Talking Point**:
   > *"Notice how the closed-loop edge automation does not rely on static thresholds alone. The multi-feature DNN fuses humidity with ambient temperature and occupancy to proportionally step up cooling power while explaining its feature attributions."*

---

### 🎯 SCENARIO 2 — Leaving Home (Away Mode Automation)
1. **Click the amber button**: `SCENARIO 2: Leaving Home`.
2. **What Happens Instantly**:
   - System mode switches to **Away**.
   - Room occupancy drops to `VACANT` (`PIR = 0`).
   - The system immediately powers down:
     - `Smart Light = OFF`
     - `Smart Fan = OFF`
     - `Inverter AC = OFF`
   - Simultaneously arms the **AIoT Security System**:
     - `Security = ON` (`Armed-Away` mode with perimeter reed sensors active).
   - Total home electrical draw immediately drops to minimal standby baseline (~48W).
3. **Viva Talking Point**:
   > *"When the occupant leaves, the system switches to Away mode. To eliminate vampire power and prevent thermal energy waste, all non-essential actuators are safely turned off while perimeter sensors are armed."*

---

### 🎯 SCENARIO 3 — Explainable AI (XAI) & GenAI Reasoning
1. **Click the cyan button**: `SCENARIO 3: AI Explanation` (or open the **GenAI Assistant & Safety** tab and click the prompt chip: *"Why did you turn on the fan?"*).
2. **What Happens**:
   - The GenAI assistant inspects the live sensor telemetry and current DNN inference states.
   - It synthesizes a context-grounded explanation:
     > *"The smart fan was recommended and activated because the room temperature is elevated at 33.0°C (exceeding the 26.0°C comfort threshold) with 75% relative humidity while active room occupancy was confirmed by the PIR sensor. The DNN model classified the cooling requirement as HIGH (96.4% confidence)."*
   - Underneath the assistant message, notice the **Stage 3 Structured Command** and **Stage 4 Safety Validator Pass** badges.
3. **Viva Talking Point**:
   > *"Unlike black-box models, our system provides full Explainable AI (XAI). The user can query in plain English why any automated decision was made, and the GenAI assistant references live IoT telemetry and neural confidence scores to provide transparent reasoning."*

---

## 🔒 Mandatory Safety Layer Demonstration
To demonstrate the safety firewall to the evaluators:
1. Open the **GenAI Assistant & Safety** tab.
2. Notice the **6-Stage Visual Architecture Pipeline**:
   $$\text{User} \longrightarrow \text{GenAI} \longrightarrow \text{Structured Command} \longrightarrow \text{Safety Validator} \longrightarrow \text{Automation Engine} \longrightarrow \text{Relays}$$
3. Show the **Safety Validator Live Audit Log**:
   - Points out verified invariants: *Power Budget Check (≤3500W)*, *Compressor Anti-Cycle (5s-15s delay)*, *Window/Door Thermal Conflict*.
4. Emphasize that **GenAI never directly toggles hardware relays**, eliminating LLM hallucination risks.

---

## 🛡️ License
Built for Academic Evaluation & College Capstone Engineering Demonstration.
