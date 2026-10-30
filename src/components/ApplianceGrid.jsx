import React from 'react';
import {
  Lightbulb,
  Fan,
  Wind,
  ShieldCheck,
  Power,
  RotateCw,
  Gauge,
  Sliders,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function ApplianceGrid({ appliances = {}, onControlAppliance }) {
  const getApplianceList = () => [
    { key: 'smart_light', data: appliances.smart_light || {} },
    { key: 'smart_fan', data: appliances.smart_fan || {} },
    { key: 'smart_ac', data: appliances.smart_ac || {} },
    { key: 'exhaust_fan', data: appliances.exhaust_fan || {} },
    { key: 'security_system', data: appliances.security_system || {} },
  ];

  const handleTogglePower = (key, currentStatus) => {
    onControlAppliance(key, { is_on: !currentStatus });
  };

  const handleToggleAuto = (key, currentAuto) => {
    onControlAppliance(key, { auto_mode: !currentAuto });
  };

  const handleFanSpeed = (key, speed) => {
    onControlAppliance(key, { speed, auto_mode: false });
  };

  const handleAcTemp = (key, currentTemp, delta) => {
    const newTemp = Math.max(18, Math.min(30, currentTemp + delta));
    onControlAppliance(key, { temperature: newTemp, auto_mode: false });
  };

  const handleLightBrightness = (key, brightness) => {
    onControlAppliance(key, { brightness: Number(brightness), auto_mode: false });
  };

  const renderIcon = (key, isOn) => {
    const iconClass = `w-5 h-5 ${isOn ? 'text-cyan-400' : 'text-slate-500'}`;
    switch (key) {
      case 'smart_light':
        return <Lightbulb className={iconClass} />;
      case 'smart_fan':
        return <Fan className={`${iconClass} ${isOn ? 'animate-spin-slow' : ''}`} />;
      case 'smart_ac':
        return <Wind className={iconClass} />;
      case 'exhaust_fan':
        return <RotateCw className={`${iconClass} ${isOn ? 'animate-spin-slow' : ''}`} />;
      case 'security_system':
        return <ShieldCheck className={iconClass} />;
      default:
        return <Power className={iconClass} />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-300 flex items-center gap-2 font-mono">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Smart Appliance Automation & Actuator Grid</span>
        </h2>
        <span className="text-[11px] text-slate-500 font-mono">
          Edge Hardware Relay Simulation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {getApplianceList().map(({ key, data }) => {
          const isOn = !!data.is_on;
          const isAuto = !!data.auto_mode;
          const power = data.power_watts ?? 0.0;
          const reason = data.status_reason || 'Autonomous regulation active';

          return (
            <div
              key={key}
              className={`glass-card rounded-2xl p-4 border flex flex-col justify-between transition-all duration-300 ${
                isOn
                  ? 'border-cyan-500/40 bg-gradient-to-b from-cyan-950/30 to-slate-900/80 shadow-glow-cyan'
                  : 'border-slate-800/80 bg-slate-950/50 opacity-90'
              }`}
            >
              {/* Header: Icon, Name, and Auto/Manual Mode */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                      isOn ? 'bg-cyan-500/20 border-cyan-500/40' : 'bg-slate-900 border-slate-800'
                    }`}>
                      {renderIcon(key, isOn)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-100 font-sans tracking-wide">
                        {data.name || key}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">
                        {data.rated_power ? `${data.rated_power}W rated` : 'Relay Actuator'}
                      </span>
                    </div>
                  </div>

                  {/* Auto/Manual Toggle Switch */}
                  <button
                    onClick={() => handleToggleAuto(key, isAuto)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold transition-all border cursor-pointer ${
                      isAuto
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                    title="Click to toggle between Autonomous DNN Adaptive Mode and User Manual Override"
                  >
                    {isAuto ? 'AUTO' : 'MANUAL'}
                  </button>
                </div>

                {/* State & Power Metrics */}
                <div className="mt-3.5 flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      isOn ? 'bg-emerald-400 shadow-glow-green animate-pulse' : 'bg-slate-600'
                    }`} />
                    <span className="text-xs font-mono font-bold tracking-wider">
                      {isOn ? 'ACTIVE (ON)' : 'STANDBY (OFF)'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {power.toFixed(1)}W
                    </span>
                  </div>
                </div>

                {/* Interactive Appliance Controls */}
                <div className="mt-3 space-y-2">
                  {key === 'smart_light' && isOn && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>Brightness</span>
                        <span className="text-cyan-300">{data.brightness || 75}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={data.brightness || 75}
                        onChange={(e) => handleLightBrightness(key, e.target.value)}
                        className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  )}

                  {key === 'smart_fan' && isOn && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>Speed Level</span>
                        <span className="text-cyan-300 font-bold">{data.speed || 3} / 5</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => handleFanSpeed(key, lvl)}
                            className={`py-1 text-[10px] rounded font-mono font-semibold transition-colors cursor-pointer ${
                              (data.speed || 3) === lvl
                                ? 'bg-cyan-500 text-black font-bold'
                                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {key === 'smart_ac' && isOn && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>Thermostat</span>
                        <span className="text-cyan-300 font-bold">{data.temperature || 24}°C ({data.mode || 'Cool'})</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleAcTemp(key, data.temperature || 24, -1)}
                          className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded font-bold transition-colors cursor-pointer"
                        >
                          - 1°C
                        </button>
                        <span className="text-xs font-mono font-bold text-slate-200">
                          {data.temperature || 24}°C
                        </span>
                        <button
                          onClick={() => handleAcTemp(key, data.temperature || 24, 1)}
                          className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded font-bold transition-colors cursor-pointer"
                        >
                          + 1°C
                        </button>
                      </div>
                    </div>
                  )}

                  {key === 'security_system' && (
                    <div className="text-[11px] font-mono text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span>Status:</span>
                      <span className="text-cyan-300 font-semibold">{data.armed_mode || (isOn ? 'Armed' : 'Disarmed')}</span>
                    </div>
                  )}

                  {key === 'exhaust_fan' && (
                    <div className="text-[11px] font-mono text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span>Purge Mode:</span>
                      <span className="text-cyan-300 font-semibold">{isOn ? 'Active Air Purge' : 'Standby / Healthy'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Reason Explanation Banner */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex flex-col gap-2">
                <div className="text-[11px] text-slate-400 leading-snug line-clamp-3 bg-slate-950/70 p-2 rounded-lg border border-slate-800/60">
                  <span className="text-slate-500 font-mono block text-[10px] mb-0.5">CURRENT REASON / TRIGGER:</span>
                  {reason}
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={() => handleTogglePower(key, isOn)}
                  className={`w-full py-1.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isOn
                      ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                      : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isOn ? 'Turn OFF' : 'Turn ON'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
