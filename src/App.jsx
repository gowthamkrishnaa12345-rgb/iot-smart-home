import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ScenarioBar from './components/ScenarioBar';
import SensorGrid from './components/SensorGrid';
import ApplianceGrid from './components/ApplianceGrid';
import DNNPanel from './components/DNNPanel';
import GenAIChat from './components/GenAIChat';
import SafetyPipeline from './components/SafetyPipeline';
import EnergyAnalytics from './components/EnergyAnalytics';
import SystemArchitecture from './components/SystemArchitecture';
import AlertsBanner from './components/AlertsBanner';
import IoTSimulatorModal from './components/IoTSimulatorModal';

import {
  fetchSystemStatus,
  controlAppliance,
  setSystemMode,
  sendChatMessage,
  triggerScenario,
  overrideSensor,
  resetSimulation
} from './services/api';

export default function App() {
  const [systemData, setSystemData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isChatProcessing, setIsChatProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Poll backend for real-time telemetry every 2.5 seconds
  const loadSystemStatus = async () => {
    try {
      const data = await fetchSystemStatus();
      setSystemData(data);
      setErrorMsg(null);
    } catch (err) {
      console.warn('Backend polling error:', err);
      // Keep previous data if any, show subtle status
    }
  };

  useEffect(() => {
    loadSystemStatus();
    const interval = setInterval(loadSystemStatus, 2500);
    return () => clearInterval(interval);
  }, []);

  // Appliance Control
  const handleControlAppliance = async (applianceId, updates) => {
    try {
      await controlAppliance(applianceId, updates);
      await loadSystemStatus();
    } catch (err) {
      alert(`Action could not be completed: ${err.message}`);
    }
  };

  // Mode Switch
  const handleModeChange = async (newMode) => {
    try {
      await setSystemMode(newMode);
      await loadSystemStatus();
    } catch (err) {
      alert(`Mode change failed: ${err.message}`);
    }
  };

  // Chat message send
  const handleSendMessage = async (msg) => {
    setIsChatProcessing(true);
    try {
      const res = await sendChatMessage(msg);
      await loadSystemStatus();
      return res;
    } finally {
      setIsChatProcessing(false);
    }
  };

  // Demo Scenarios 1, 2, 3
  const handleTriggerScenario = async (scenarioId) => {
    const res = await triggerScenario(scenarioId);
    await loadSystemStatus();
    // If scenario 3 was triggered, switch to genai tab so user sees the explanation!
    if (scenarioId === 3) {
      setActiveTab('genai');
    }
    return res;
  };

  // Sensor Overrides
  const handleOverrideSensor = async (updates) => {
    await overrideSensor(updates);
    await loadSystemStatus();
  };

  // Reset Simulation
  const handleResetSimulation = async () => {
    await resetSimulation();
    await loadSystemStatus();
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans">
      {/* Top Navbar */}
      <Navbar
        systemData={systemData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onModeChange={handleModeChange}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 space-y-4">
        {/* Presentation Demo Scenario Bar (Always available for instant 1-click tests) */}
        <ScenarioBar
          onTriggerScenario={handleTriggerScenario}
          onResetSimulation={handleResetSimulation}
        />

        {/* Dynamic Alerts Banner */}
        {systemData?.alerts && systemData.alerts.length > 0 && (
          <AlertsBanner alerts={systemData.alerts} />
        )}

        {/* TAB 1: MAIN DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5 animate-fadeIn">
            {/* 8 Main Dashboard Sensor Metrics */}
            <SensorGrid
              sensors={systemData?.sensors}
              energy={systemData?.energy}
              overallStatus={systemData?.overall_status}
              onOpenSimulator={() => setIsSimulatorOpen(true)}
            />

            {/* 5 Smart Appliance Cards */}
            <ApplianceGrid
              appliances={systemData?.appliances}
              onControlAppliance={handleControlAppliance}
            />

            {/* Side-by-side Highlights: DNN Overview & GenAI Quick Teaser */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wide">
                    DNN INFERENCE PREVIEW
                  </span>
                  <button
                    onClick={() => setActiveTab('dnn')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
                  >
                    Open Hub →
                  </button>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cooling Requirement:</span>
                    <strong className="text-slate-200">{systemData?.dnn?.cooling_requirement || 'LOW'} ({systemData?.dnn?.cooling_confidence || 90}%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Thermal Comfort:</span>
                    <strong className="text-emerald-400">{systemData?.dnn?.comfort_status || 'COMFORTABLE'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Occupancy Prediction:</span>
                    <strong className="text-cyan-300">{systemData?.dnn?.occupancy_prediction || 'OCCUPIED'} ({systemData?.dnn?.occupancy_probability || 94}%)</strong>
                  </div>
                </div>
                <p className="mt-3 p-2 rounded-lg bg-slate-950/80 text-[11px] text-slate-300 leading-snug border border-slate-800">
                  {systemData?.dnn?.explanation || 'DNN is dynamically optimizing cooling demand based on sensor telemetry.'}
                </p>
              </div>

              <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wide">
                      GENAI & SAFETY ENGINE
                    </span>
                    <button
                      onClick={() => setActiveTab('genai')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
                    >
                      Open Chat →
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Commands typed into GenAI pass through our <strong>Safety Validator</strong> before reaching hardware relays.
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-slate-400 space-y-1">
                    <div>• User: "Why did you turn on the fan?"</div>
                    <div>• User: "I am leaving home"</div>
                    <div>• User: "Turn on the fan"</div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('genai')}
                  className="mt-3 w-full py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Interact with GenAI Assistant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DNN INTELLIGENCE HUB */}
        {activeTab === 'dnn' && (
          <div className="animate-fadeIn">
            <DNNPanel
              dnnData={systemData?.dnn}
              sensors={systemData?.sensors}
            />
          </div>
        )}

        {/* TAB 3: GENAI ASSISTANT & SAFETY PIPELINE */}
        {activeTab === 'genai' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadeIn">
            <GenAIChat
              onSendMessage={handleSendMessage}
              isProcessing={isChatProcessing}
            />
            <SafetyPipeline
              safetyAudit={systemData?.safety_audit || []}
            />
          </div>
        )}

        {/* TAB 4: ENERGY MONITORING */}
        {activeTab === 'energy' && (
          <div className="animate-fadeIn">
            <EnergyAnalytics
              energy={systemData?.energy}
              history={systemData?.history}
            />
          </div>
        )}

        {/* TAB 5: SYSTEM ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="animate-fadeIn">
            <SystemArchitecture />
          </div>
        )}
      </main>

      {/* ESP32 Hardware Inspector / Sensor Override Modal */}
      <IoTSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        sensors={systemData?.sensors}
        onOverride={handleOverrideSensor}
        onReset={handleResetSimulation}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#06080d] py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AIoT-Based Adaptive Smart Home Automation Using DNN and Generative AI</span>
          <span>Label: AIoT Software Prototype — IoT sensors & DNN predictions simulated</span>
        </div>
      </footer>
    </div>
  );
}
