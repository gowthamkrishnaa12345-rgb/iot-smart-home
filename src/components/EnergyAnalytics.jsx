import React, { useState } from 'react';
import {
  Zap,
  TrendingDown,
  Clock,
  Sparkles,
  BarChart3,
  Calendar,
  DollarSign,
  Leaf
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function EnergyAnalytics({ energy = {}, history = [] }) {
  const [metricTab, setMetricTab] = useState('power');

  const currentPower = energy.current_power_watts ?? 420;
  const dailyKwh = energy.daily_energy_kwh ?? 7.8;
  const dailyCost = energy.daily_cost_usd ?? 1.17;
  const predictedNextHour = energy.predicted_next_hour_kwh ?? 0.65;
  const recommendations = energy.recommendations || [
    "Raising AC setpoint by 1°C conserves ~7.2% hourly power.",
    "High natural lux detected: dim living room LEDs to save 20W.",
    "Ensure doors/windows remain sealed during active AC operation."
  ];

  // Format chart data
  const chartData = (history && history.length > 0) ? history : [
    { time: '12:00', power: 340, temperature: 24.5, humidity: 52 },
    { time: '13:00', power: 510, temperature: 26.2, humidity: 54 },
    { time: '14:00', power: 850, temperature: 28.1, humidity: 58 },
    { time: '15:00', power: 1200, temperature: 30.5, humidity: 62 },
    { time: '16:00', power: 980, temperature: 29.2, humidity: 60 },
    { time: '17:00', power: 460, temperature: 26.0, humidity: 55 },
  ];

  const getMetricConfig = () => {
    switch (metricTab) {
      case 'temperature':
        return {
          key: 'temperature',
          label: 'Temperature (°C)',
          stroke: '#f43f5e',
          fill: '#f43f5e',
          unit: '°C'
        };
      case 'humidity':
        return {
          key: 'humidity',
          label: 'Humidity (%)',
          stroke: '#06b6d4',
          fill: '#06b6d4',
          unit: '%'
        };
      default:
        return {
          key: 'power',
          label: 'Power Draw (Watts)',
          stroke: '#8b5cf6',
          fill: '#8b5cf6',
          unit: 'W'
        };
    }
  };

  const activeMetric = getMetricConfig();

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
            <Zap className="w-5 h-5 text-purple-400" />
            <span>Energy Intelligence & Microgrid Telemetry</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Dynamic load forecasting and ASHRAE-aligned conservation analytics
          </p>
        </div>
        <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 border border-purple-500/40 px-3 py-1 rounded-xl">
          Tariff Rate: $0.15 / kWh
        </span>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Live Power */}
        <div className="glass-card rounded-2xl p-4 border border-purple-500/30 bg-purple-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Live Circuit Load</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-3xl font-extrabold font-mono text-purple-300">
              {Math.round(currentPower)}
            </span>
            <span className="text-xs font-mono text-slate-400 ml-1">Watts</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            {(currentPower / 1000).toFixed(2)} kW instantaneous
          </span>
        </div>

        {/* Daily Energy */}
        <div className="glass-card rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Daily Consumption</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-3xl font-extrabold font-mono text-emerald-300">
              {dailyKwh}
            </span>
            <span className="text-xs font-mono text-slate-400 ml-1">kWh</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            Estimated Cost: ${dailyCost} USD
          </span>
        </div>

        {/* Predicted Next Hour */}
        <div className="glass-card rounded-2xl p-4 border border-cyan-500/30 bg-cyan-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">DNN Forecast (1h)</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-3xl font-extrabold font-mono text-cyan-300">
              {predictedNextHour}
            </span>
            <span className="text-xs font-mono text-slate-400 ml-1">kWh / hr</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono mt-1 block">
            Neural Regression Projection
          </span>
        </div>

        {/* Efficiency Rating */}
        <div className="glass-card rounded-2xl p-4 border border-indigo-500/30 bg-indigo-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Smart Efficiency</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-extrabold font-mono text-emerald-300">
              A++ Grade
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            ~24.8% savings vs baseline
          </span>
        </div>
      </div>

      {/* Historical Telemetry Chart (Recharts) */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Live Sensor & Power Historical Time-Series
            </h3>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setMetricTab('power')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                metricTab === 'power' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Power (Watts)
            </button>
            <button
              onClick={() => setMetricTab('temperature')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                metricTab === 'temperature' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Temp (°C)
            </button>
            <button
              onClick={() => setMetricTab('humidity')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                metricTab === 'humidity' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Humidity (%)
            </button>
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeMetric.fill} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={activeMetric.fill} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#f8fafc'
                }}
                formatter={(val) => [`${val} ${activeMetric.unit}`, activeMetric.label]}
              />
              <Area
                type="monotone"
                dataKey={activeMetric.key}
                stroke={activeMetric.stroke}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#metricGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Energy-Saving Recommendations */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60 space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Generative AI Energy-Saving Recommendations</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px] font-mono">
                {idx + 1}
              </span>
              <p className="leading-snug">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
