import React from 'react';
import {
  Thermometer,
  Droplets,
  Users,
  Sun,
  Wind,
  Zap,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function SensorGrid({ sensors = {}, energy = {}, overallStatus = 'OPTIMAL', onOpenSimulator }) {
  const temp = sensors.temperature ?? 25.4;
  const hum = sensors.humidity ?? 55.0;
  const occ = sensors.occupancy ?? true;
  const motion = sensors.pir_motion ?? 1;
  const lux = sensors.light_lux ?? 420;
  const aqi = sensors.aqi_ppm ?? 42;
  const power = sensors.power_consumption ?? 380;
  const dailyKwh = energy.daily_energy_kwh ?? 7.8;
  const dailyCost = energy.daily_cost_usd ?? 1.17;

  // Temperature status
  const getTempColor = (t) => {
    if (t >= 32) return { text: 'text-rose-400', border: 'border-rose-500/40', badge: 'High (Cooling Advised)', bg: 'from-rose-500/10' };
    if (t <= 20) return { text: 'text-sky-400', border: 'border-sky-500/40', badge: 'Chilly (Heating Advised)', bg: 'from-sky-500/10' };
    return { text: 'text-emerald-400', border: 'border-emerald-500/30', badge: 'Optimal Comfort', bg: 'from-emerald-500/10' };
  };

  // AQI status
  const getAqiColor = (a) => {
    if (a > 100) return { text: 'text-rose-400', badge: 'Poor / Hazardous', bar: 'bg-rose-500' };
    if (a > 60) return { text: 'text-amber-400', badge: 'Moderate Particulate', bar: 'bg-amber-400' };
    return { text: 'text-emerald-400', badge: 'Excellent / Pure', bar: 'bg-emerald-400' };
  };

  const tempStyle = getTempColor(temp);
  const aqiStyle = getAqiColor(aqi);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-300 flex items-center gap-2 font-mono">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Real-Time IoT Telemetry Stream (ESP32 Node)</span>
        </h2>
        <span className="text-[11px] text-slate-500 font-mono">
          Sample Rate: 3s • Packet CRC Checked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. TEMPERATURE */}
        <div className={`glass-card rounded-2xl p-4 border bg-gradient-to-b ${tempStyle.bg} to-slate-900/60 relative overflow-hidden group`}>
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">1. Indoor Temperature</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <Thermometer className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${tempStyle.text}`}>
              {temp.toFixed(1)}°C
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({((temp * 9/5) + 32).toFixed(1)}°F)
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-[11px] font-medium text-slate-300">
              {tempStyle.badge}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Ref: 24°C</span>
          </div>
          {/* Visual bar */}
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${temp >= 30 ? 'bg-rose-500' : 'bg-emerald-400'}`}
              style={{ width: `${Math.min(100, Math.max(10, ((temp - 15) / 25) * 100))}%` }}
            />
          </div>
        </div>

        {/* 2. HUMIDITY */}
        <div className="glass-card rounded-2xl p-4 border border-cyan-500/20 bg-gradient-to-b from-cyan-500/10 to-slate-900/60 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">2. Relative Humidity</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-cyan-300">
              {hum.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">RH</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-[11px] font-medium text-slate-300">
              {hum > 70 ? 'High Moisture' : hum < 35 ? 'Dry Air' : 'Comfortable'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Target: 45-60%</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, hum))}%` }}
            />
          </div>
        </div>

        {/* 3. ROOM OCCUPANCY */}
        <div className="glass-card rounded-2xl p-4 border border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-slate-900/60 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">3. Room Occupancy</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${occ ? 'text-emerald-400' : 'text-slate-400'}`}>
              {occ ? 'OCCUPIED' : 'VACANT'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <span className={`w-2 h-2 rounded-full ${motion ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              PIR Motion: {motion ? 'Active' : 'Idle'}
            </span>
            <span className="text-[11px] text-indigo-300 font-mono">Presence Fuse</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${occ ? 'bg-emerald-400 w-full' : 'bg-slate-600 w-0'}`}
            />
          </div>
        </div>

        {/* 4. LIGHT INTENSITY */}
        <div className="glass-card rounded-2xl p-4 border border-amber-500/20 bg-gradient-to-b from-amber-500/10 to-slate-900/60 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">4. Light Intensity</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-amber-300">
              {Math.round(lux)}
            </span>
            <span className="text-xs text-slate-400 font-mono">Lux</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-[11px] font-medium text-slate-300">
              {lux > 600 ? 'Bright Daylight' : lux > 250 ? 'Ambient Normal' : 'Dim Interior'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">BH1750 Sensor</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, (lux / 1000) * 100))}%` }}
            />
          </div>
        </div>

        {/* 5. AIR QUALITY (AQI) */}
        <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-slate-900/60 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">5. Air Quality Index</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Wind className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${aqiStyle.text}`}>
              {aqi}
            </span>
            <span className="text-xs text-slate-400 font-mono">PPM / AQI</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-[11px] font-medium text-slate-300">
              {aqiStyle.badge}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">MQ-135 Sensor</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${aqiStyle.bar} transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(10, (aqi / 150) * 100))}%` }}
            />
          </div>
        </div>

        {/* 6. CURRENT POWER CONSUMPTION */}
        <div className="glass-card rounded-2xl p-4 border border-purple-500/20 bg-gradient-to-b from-purple-500/10 to-slate-900/60 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">6. Real-Time Power</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${power > 2000 ? 'text-rose-400' : 'text-purple-300'}`}>
              {Math.round(power)}
            </span>
            <span className="text-xs text-slate-400 font-mono">Watts</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-[11px] font-medium text-slate-300">
              {(power / 1000).toFixed(2)} kW • {sensors.current_amps || '1.6'}A @ 230V
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Limit 3500W</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${power > 2200 ? 'bg-rose-500' : 'bg-purple-400'}`}
              style={{ width: `${Math.min(100, Math.max(5, (power / 3500) * 100))}%` }}
            />
          </div>
        </div>

        {/* 7. ESTIMATED ENERGY USAGE */}
        <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-slate-900/60 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">7. Estimated Daily Energy</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-emerald-300">
              {dailyKwh}
            </span>
            <span className="text-xs text-slate-400 font-mono">kWh / day</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-[11px] font-medium text-emerald-400 font-mono">
              ~${dailyCost} USD / day
            </span>
            <span className="text-[11px] text-slate-500 font-mono">A++ Smart Eco</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${Math.min(100, (dailyKwh / 15) * 100)}%` }}
            />
          </div>
        </div>

        {/* 8. OVERALL HOME STATUS */}
        <div className="glass-card rounded-2xl p-4 border border-cyan-500/20 bg-gradient-to-b from-cyan-500/10 to-slate-900/60 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">8. Overall Home Status</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-cyan-300 truncate">
              {overallStatus}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-medium text-cyan-300">
              Autonomous AI Loop
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Door: {sensors.door_window_open ? 'OPEN' : 'CLOSED'}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 w-full animate-pulse-slow" />
          </div>
        </div>
      </div>
    </div>
  );
}
