import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Brain,
  Sparkles,
  Sliders,
  Layers,
  Zap,
  ArrowDown,
  ArrowRight,
  Lock,
  Radio,
  CheckCircle2,
  FileCode2,
  AlertTriangle
} from 'lucide-react';

export default function SystemArchitecture() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>AIoT System Architecture & Hardware-AI Safety Pipeline</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            College Capstone Technical Specification • Multilayer Isolation Model
          </p>
        </div>
        <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-xl">
          Deterministic Safety Guardrails
        </span>
      </div>

      {/* Main Flowchart: User -> GenAI -> Structured Command -> Safety Validator -> Automation Engine -> Smart Appliance */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-slate-900/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Mandated 6-Stage Command & Actuation Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {/* STAGE 1 */}
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-sky-500/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-sky-400 block mb-1">STAGE 1</span>
              <h4 className="text-xs font-bold text-slate-100 font-mono">User Interface</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Natural speech or chat prompt (e.g., "Turn on the fan", "I am leaving home")
              </p>
            </div>
            <span className="text-[10px] font-mono text-sky-300 mt-3 pt-2 border-t border-slate-800">
              Raw Input (Unstructured)
            </span>
          </div>

          {/* STAGE 2 */}
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-1">STAGE 2</span>
              <h4 className="text-xs font-bold text-slate-100 font-mono">GenAI Assistant</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                NLU intent classification, parameter extraction, and context fusion
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 mt-3 pt-2 border-t border-slate-800">
              Zero-Key Edge AI
            </span>
          </div>

          {/* STAGE 3 */}
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-indigo-500/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 block mb-1">STAGE 3</span>
              <h4 className="text-xs font-bold text-slate-100 font-mono">Structured Command</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Translates fuzzy prompt to formal JSON schema: target, action, parameters
              </p>
            </div>
            <span className="text-[10px] font-mono text-indigo-300 mt-3 pt-2 border-t border-slate-800">
              JSON Specification
            </span>
          </div>

          {/* STAGE 4 (SAFETY VALIDATOR) */}
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-emerald-500/50 shadow-glow-green flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[9px] font-mono font-bold px-2 py-0.5 rounded-bl">
              FIREWALL
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 block mb-1">STAGE 4</span>
              <h4 className="text-xs font-bold text-emerald-300 font-mono">Safety Validator</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Physical invariant verification: Power budget (≤3.5kW), AC rapid-cycle delay, door/window conflict
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 mt-3 pt-2 border-t border-slate-800 font-bold">
              PASS / REJECT / MODIFY
            </span>
          </div>

          {/* STAGE 5 */}
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-purple-500/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-purple-400 block mb-1">STAGE 5</span>
              <h4 className="text-xs font-bold text-slate-100 font-mono">Automation Engine</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                State machine evaluating active mode (Home, Away, Sleep, Eco, Emergency)
              </p>
            </div>
            <span className="text-[10px] font-mono text-purple-300 mt-3 pt-2 border-t border-slate-800">
              Adaptive Controller
            </span>
          </div>

          {/* STAGE 6 */}
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-1">STAGE 6</span>
              <h4 className="text-xs font-bold text-slate-100 font-mono">Smart Appliances</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Physical relay actuation: Lights, Fan speed, AC thermostat, Exhaust, Security
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 mt-3 pt-2 border-t border-slate-800">
              Hardware Relay Actuation
            </span>
          </div>
        </div>
      </div>

      {/* Deep Dive: Why the Safety Validator Layer is Mandatory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>The Danger of Direct GenAI Actuation</span>
          </h3>
          <ul className="space-y-2 text-slate-300 list-disc list-inside leading-relaxed text-[11px]">
            <li>
              <strong className="text-slate-100">LLM Hallucinations:</strong> A generative model could misunderstand numbers or invent fictitious pin states, turning appliances on/off unpredictably.
            </li>
            <li>
              <strong className="text-slate-100">Rapid Compressor Cycling:</strong> Toggling AC compressors on/off every few seconds destroys compressor bearings due to head-pressure lock.
            </li>
            <li>
              <strong className="text-slate-100">Electrical Overload:</strong> Simultaneous high-draw actuators (AC + Geyser + Oven) can trip the home's 16A/32A main breaker.
            </li>
            <li>
              <strong className="text-slate-100">Security Compromise:</strong> Prompt injection could trick an LLM into unlocking doors or disabling security while residents are away.
            </li>
          </ul>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>How Our Safety Layer Guarantees Integrity</span>
          </h3>
          <ul className="space-y-2 text-slate-300 list-disc list-inside leading-relaxed text-[11px]">
            <li>
              <strong className="text-slate-100">Formal Schema Gate:</strong> Raw LLM text is never sent to relays. Only strictly validated JSON schemas are accepted.
            </li>
            <li>
              <strong className="text-slate-100">Mathematical Bounds:</strong> Capped AC setpoints (18°C - 30°C) and Fan speeds (1 - 5) prevent invalid configurations.
            </li>
            <li>
              <strong className="text-slate-100">Sensor-Grounding Checks:</strong> Verifies physical realities (e.g. alerts if AC turned on with balcony door open).
            </li>
            <li>
              <strong className="text-slate-100">Audit Logging:</strong> Every safety check is recorded immutably with timestamp, invariants checked, and outcome.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
