import React from 'react';
import { Cpu, ShieldCheck, Activity, Zap, Sparkles, Sliders, AlertTriangle } from 'lucide-react';

export default function Navbar({
  systemData,
  activeTab,
  setActiveTab,
  onOpenSimulator,
  onModeChange,
  isLiveLoading
}) {
  const mode = systemData?.mode || 'Home';
  const overallStatus = systemData?.overall_status || 'OPTIMAL';
  const sensors = systemData?.sensors || {};

  const modes = [
    { id: 'Home', label: 'Home', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30' },
    { id: 'Away', label: 'Away', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' },
    { id: 'Sleep', label: 'Sleep', color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/30' },
    { id: 'Energy Saving', label: 'Eco Save', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' },
    { id: 'Emergency', label: 'Emergency', color: 'text-rose-400 border-rose-500/40 bg-rose-950/30' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CRITICAL ALERT':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-glow-red animate-pulse';
      case 'ADAPTIVE COOLING':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-glow-cyan';
      case 'ENERGY SAVING':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-green';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-green';
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cyan-900/40 bg-[#070b13]/90">
      {/* Presentation Disclaimer Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-cyan-950/80 border-b border-cyan-500/20 px-4 py-1.5 text-center text-xs tracking-wide">
        <span className="inline-flex items-center gap-1.5 text-cyan-300 font-medium">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          AIoT Software Prototype — IoT sensors and DNN predictions are currently simulated.
        </span>
        <span className="hidden md:inline text-slate-400 ml-3 text-[11px]">
          [ESP32 Edge Node: {sensors.device_id || 'ESP32-AIOT-NODE-01'} | CRC: {sensors.crc_checksum || '0x4A1F'}]
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan">
            <Cpu className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                AIoT Adaptive Smart Home
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                DNN + GenAI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              College Capstone Engineering Prototype • Multi-Modal Edge Automation
            </p>
          </div>
        </div>

        {/* Live ESP32 Badge & Overall Status */}
        <div className="flex flex-wrap items-center gap-2">
          {/* ESP32 Simulation Status Button */}
          <button
            onClick={onOpenSimulator}
            title="Click to open ESP32 hardware telemetry and live manual overrides"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/50 text-xs font-mono transition-colors group cursor-pointer"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 group-hover:text-cyan-300 font-medium">
              ESP32 / IoT Simulation: <strong className="text-emerald-400">ONLINE</strong>
            </span>
            <Sliders className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 ml-1" />
          </button>

          {/* Overall Health Status */}
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wider font-mono flex items-center gap-1.5 ${getStatusBadge(overallStatus)}`}>
            <Activity className="w-3.5 h-3.5" />
            <span>{overallStatus}</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            {modes.map((m) => {
              const isSelected = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onModeChange(m.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    isSelected
                      ? `${m.color} border shadow-sm`
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 border-t border-slate-800/60 overflow-x-auto text-xs py-1.5">
        {[
          { id: 'dashboard', label: 'Main Dashboard', icon: Activity },
          { id: 'dnn', label: 'DNN Intelligence Hub', icon: Cpu },
          { id: 'genai', label: 'GenAI Assistant & Safety', icon: Sparkles },
          { id: 'energy', label: 'Energy Monitoring', icon: Zap },
          { id: 'architecture', label: 'System Architecture', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
