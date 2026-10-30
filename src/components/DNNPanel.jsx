import React from 'react';
import {
  Cpu,
  Brain,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
  Zap,
  Info,
  Layers,
  Thermometer,
  ShieldAlert
} from 'lucide-react';

export default function DNNPanel({ dnnData = {}, sensors = {} }) {
  const label = dnnData.label || "DNN Prototype / Simulated Prediction";
  const coolingReq = dnnData.cooling_requirement || "LOW";
  const coolingConf = dnnData.cooling_confidence || 88.5;
  const probs = dnnData.cooling_probabilities || { LOW: 85, MEDIUM: 10, HIGH: 5 };
  const occupancyPred = dnnData.occupancy_prediction || "OCCUPIED";
  const occupancyProb = dnnData.occupancy_probability || 94.2;
  const comfort = dnnData.comfort_status || "COMFORTABLE";
  const comfortDesc = dnnData.comfort_description || "Optimal comfort envelope";
  const predKwh = dnnData.predicted_energy_next_hour_kwh || 0.65;
  const anomalyDetected = !!dnnData.anomaly_detected;
  const anomalyScore = dnnData.anomaly_score || 0.04;
  const explanation = dnnData.explanation || "DNN evaluated current thermal and presence inputs.";
  const features = dnnData.feature_importance || [
    { feature: 'Indoor Temperature', weight: 45.0, value: `${sensors.temperature || 25}°C` },
    { feature: 'Occupancy Presence', weight: 30.0, value: occupancyPred },
    { feature: 'Relative Humidity', weight: 15.0, value: `${sensors.humidity || 55}%` },
    { feature: 'Diurnal / Time Profile', weight: 10.0, value: 'Current Hour' },
  ];

  const getCoolingBadge = (req) => {
    switch (req) {
      case 'HIGH':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const getComfortBadge = (c) => {
    switch (c) {
      case 'UNCOMFORTABLE':
        return 'text-rose-400 bg-rose-950/60 border-rose-500/40';
      case 'MODERATELY WARM':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      case 'CHILLY':
        return 'text-sky-400 bg-sky-950/60 border-sky-500/40';
      default:
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* Title & Clear Presentation Disclaimer Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
              <span>Deep Neural Network (DNN) Intelligence Hub</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Edge Multi-Task Neural Classifier & Thermal Predictive Regression
            </p>
          </div>
        </div>

        {/* REQUIRED HONEST LABEL */}
        <div className="px-3 py-1 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm">
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          <span>Label: {label}</span>
        </div>
      </div>

      {/* Top Prediction Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* HEAD 1: COOLING REQUIREMENT */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Cooling Requirement</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border ${getCoolingBadge(coolingReq)}`}>
                {coolingReq}
              </span>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-extrabold font-mono text-slate-100">
                {coolingReq} Demand
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Model Confidence: <strong className="text-cyan-300 font-mono">{coolingConf}%</strong>
              </p>
            </div>
          </div>

          {/* Softmax Probability Distribution */}
          <div className="mt-3 space-y-1 text-[11px] font-mono">
            <div className="flex justify-between text-slate-400">
              <span>LOW: {probs.LOW}%</span>
              <span>MED: {probs.MEDIUM}%</span>
              <span>HIGH: {probs.HIGH}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 flex overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${probs.LOW}%` }} />
              <div className="bg-amber-400 h-full" style={{ width: `${probs.MEDIUM}%` }} />
              <div className="bg-rose-500 h-full" style={{ width: `${probs.HIGH}%` }} />
            </div>
          </div>
        </div>

        {/* HEAD 2: OCCUPANCY PREDICTION */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Occupancy Inference</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {occupancyProb}% Sigmoid
              </span>
            </div>
            <div className="mt-2.5">
              <span className={`text-2xl font-extrabold font-mono ${occupancyPred === 'OCCUPIED' ? 'text-emerald-400' : 'text-slate-400'}`}>
                {occupancyPred}
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                PIR + Lux + Diurnal Temporal Fusion
              </p>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${occupancyPred === 'OCCUPIED' ? 'bg-emerald-400' : 'bg-slate-600'} transition-all`}
              style={{ width: `${occupancyProb}%` }}
            />
          </div>
        </div>

        {/* HEAD 3: THERMAL COMFORT INDEX */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Comfort Status</span>
              <Thermometer className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2.5">
              <span className={`inline-block px-2.5 py-1 rounded-lg text-sm font-extrabold font-mono border ${getComfortBadge(comfort)}`}>
                {comfort}
              </span>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                {comfortDesc}
              </p>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            ASHRAE Standard 55 Alignment
          </span>
        </div>

        {/* HEAD 4: PREDICTED NEXT-HOUR ENERGY & ANOMALY */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Next 1h Energy Pred.</span>
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-extrabold font-mono text-purple-300">
                {predKwh} kWh
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Anomaly Loss: <strong className={anomalyDetected ? 'text-rose-400' : 'text-emerald-400'}>{anomalyScore} ({anomalyDetected ? 'ANOMALOUS' : 'NORMAL'})</strong>
              </p>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            Neural Regression + Autoencoder Loss
          </span>
        </div>
      </div>

      {/* Deep Neural Network Architecture & Explainable AI (XAI) Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* EXPLAINABILITY (XAI) & NATURAL LANGUAGE RATIONALE */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/70 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Explainable AI (XAI) — Feature Attribution</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              SHAP / Weight Proxy
            </span>
          </div>

          <div className="space-y-2">
            {features.map((f, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{f.feature} ({f.value})</span>
                  <span className="text-cyan-300 font-bold">{f.weight}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                    style={{ width: `${f.weight}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Rationale Explanation Box */}
          <div className="mt-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-300">
            <span className="font-mono text-cyan-400 font-bold block mb-1">
              INFERENCE RATIONALE:
            </span>
            <p className="leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>

        {/* MODEL ARCHITECTURE VISUALIZER */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/70 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Multi-Layer Perceptron (MLP) Topology</span>
            </h3>
            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
              Forward Pass Ready
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono py-2">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">INPUT</span>
              <strong className="text-base text-cyan-400 block">7</strong>
              <span className="text-[9px] text-slate-500">Sensor Features</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">HIDDEN 1</span>
              <strong className="text-base text-indigo-400 block">16</strong>
              <span className="text-[9px] text-slate-500">Dense ReLU</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">HIDDEN 2</span>
              <strong className="text-base text-purple-400 block">8</strong>
              <span className="text-[9px] text-slate-500">Dense ReLU</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">OUTPUT</span>
              <strong className="text-base text-emerald-400 block">Multi</strong>
              <span className="text-[9px] text-slate-500">5 Task Heads</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1 font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex justify-between">
              <span>Task Head 1:</span>
              <span className="text-slate-300">Cooling Classification (Softmax)</span>
            </div>
            <div className="flex justify-between">
              <span>Task Head 2:</span>
              <span className="text-slate-300">Occupancy Detection (Sigmoid)</span>
            </div>
            <div className="flex justify-between">
              <span>Task Head 3:</span>
              <span className="text-slate-300">Comfort PMV Index (Categorical)</span>
            </div>
            <div className="flex justify-between">
              <span>Task Head 4:</span>
              <span className="text-slate-300">Hourly Energy Regressor (Linear)</span>
            </div>
            <div className="flex justify-between">
              <span>Task Head 5:</span>
              <span className="text-slate-300">Autoencoder Anomaly Residual</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
