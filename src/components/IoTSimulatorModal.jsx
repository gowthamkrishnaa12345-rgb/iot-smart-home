import React, { useState } from 'react';
import {
  X,
  Sliders,
  Cpu,
  RotateCcw,
  CheckCircle2,
  Activity,
  Zap,
  Radio,
  Wifi
} from 'lucide-react';

export default function IoTSimulatorModal({
  isOpen,
  onClose,
  sensors = {},
  onOverride,
  onReset
}) {
  if (!isOpen) return null;

  const [temp, setTemp] = useState(sensors.temperature || 25.4);
  const [hum, setHum] = useState(sensors.humidity || 55.0);
  const [lux, setLux] = useState(sensors.light_lux || 420);
  const [aqi, setAqi] = useState(sensors.aqi_ppm || 42);
  const [motion, setMotion] = useState(sensors.pir_motion === 1);
  const [doorOpen, setDoorOpen] = useState(!!sensors.door_window_open);
  const [feedback, setFeedback] = useState('');

  const handleApplyOverride = async () => {
    try {
      await onOverride({
        temperature: Number(temp),
        humidity: Number(hum),
        light_lux: Number(lux),
        aqi_ppm: Number(aqi),
        pir_motion: motion ? 1 : 0,
        occupancy: motion,
        door_window_open: doorOpen
      });
      setFeedback('✓ Sensor overrides applied to simulated ESP32 node!');
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      setFeedback(`Failed to apply override: ${err.message}`);
    }
  };

  const handleResetAutonomous = async () => {
    try {
      await onReset();
      setFeedback('✓ Restored autonomous physical simulation!');
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      setFeedback(`Reset failed: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 max-w-2xl w-full bg-[#0a0f1d] shadow-2xl space-y-5 animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                <span>ESP32 Edge Node Telemetry & Hardware Emulation</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Hardware Node: {sensors.device_id || 'ESP32-AIOT-NODE-01'} • MAC: {sensors.mac_address || '24:6F:28:B1:7A:4C'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live ESP32 Hardware Diagnostics Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
          <div>
            <span className="text-slate-500 text-[10px] block">LINK STATUS</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Wifi className="w-3 h-3" /> ONLINE (WiFi)
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">FIRMWARE</span>
            <span className="text-slate-300">FreeRTOS v2.4</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">PACKETS SENT</span>
            <span className="text-cyan-300 font-bold">#{sensors.packet_count || 1420}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">CRC CHECKSUM</span>
            <span className="text-purple-300 font-bold">{sensors.crc_checksum || '0x4A1F'}</span>
          </div>
        </div>

        {/* Manual Sensor Override Sliders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Manual Sensor Overrides (Live Presentation Testing)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Overrides natural simulation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            {/* Temperature */}
            <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Temperature</span>
                <span className="text-cyan-300 font-bold">{temp}°C</span>
              </div>
              <input
                type="range"
                min="16"
                max="40"
                step="0.5"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Humidity */}
            <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Relative Humidity</span>
                <span className="text-cyan-300 font-bold">{hum}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                step="1"
                value={hum}
                onChange={(e) => setHum(e.target.value)}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Light Lux */}
            <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Light Intensity (Lux)</span>
                <span className="text-amber-300 font-bold">{lux} Lux</span>
              </div>
              <input
                type="range"
                min="0"
                max="1200"
                step="20"
                value={lux}
                onChange={(e) => setLux(e.target.value)}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Air Quality (AQI) */}
            <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Air Quality (AQI)</span>
                <span className="text-emerald-300 font-bold">{aqi} PPM</span>
              </div>
              <input
                type="range"
                min="15"
                max="200"
                step="5"
                value={aqi}
                onChange={(e) => setAqi(e.target.value)}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Binary Sensor Toggles (PIR Motion & Door Switch) */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <button
              onClick={() => setMotion(!motion)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                motion
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <span>PIR Motion Sensor:</span>
              <span className="font-bold">{motion ? 'DETECTED' : 'IDLE'}</span>
            </button>

            <button
              onClick={() => setDoorOpen(!doorOpen)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                doorOpen
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <span>Door Reed Switch:</span>
              <span className="font-bold">{doorOpen ? 'OPEN' : 'CLOSED'}</span>
            </button>
          </div>
        </div>

        {feedback && (
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleResetAutonomous}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Auto Simulation</span>
          </button>

          <button
            onClick={handleApplyOverride}
            className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-glow-cyan transition-all cursor-pointer"
          >
            Apply Sensor Overrides
          </button>
        </div>
      </div>
    </div>
  );
}
