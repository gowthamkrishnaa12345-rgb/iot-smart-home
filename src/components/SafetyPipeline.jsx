import React from 'react';
import {
  ShieldCheck,
  User,
  Sparkles,
  FileCode2,
  CheckCircle,
  Sliders,
  Cpu,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  History
} from 'lucide-react';

export default function SafetyPipeline({ safetyAudit = [] }) {
  const stages = [
    {
      step: 1,
      title: "1. User Input",
      desc: "Natural speech / text request (e.g., 'Turn on fan')",
      icon: User,
      color: "border-sky-500/40 text-sky-400 bg-sky-950/30"
    },
    {
      step: 2,
      title: "2. GenAI Engine",
      desc: "NLU Intent parsing & context telemetry fusion",
      icon: Sparkles,
      color: "border-cyan-500/40 text-cyan-400 bg-cyan-950/30"
    },
    {
      step: 3,
      title: "3. Structured Command",
      desc: "Strict JSON schema with target & parameters",
      icon: FileCode2,
      color: "border-indigo-500/40 text-indigo-400 bg-indigo-950/30"
    },
    {
      step: 4,
      title: "4. Safety Validator",
      desc: "Physical invariants & electrical load guard",
      icon: ShieldCheck,
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/30 shadow-glow-green"
    },
    {
      step: 5,
      title: "5. Automation Engine",
      desc: "Mode arbitration (Home/Away/Sleep/Eco/Emergency)",
      icon: Sliders,
      color: "border-purple-500/40 text-purple-400 bg-purple-950/30"
    },
    {
      step: 6,
      title: "6. Smart Appliance",
      desc: "Hardware relay actuation & live power tracking",
      icon: Cpu,
      color: "border-cyan-500/40 text-cyan-400 bg-cyan-950/30"
    },
  ];

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Safety-First AIoT Architecture Pipeline</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Strict isolation: GenAI cannot bypass deterministic Safety Validator rules
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-xl">
          Zero-Direct-Hardware Mutex
        </span>
      </div>

      {/* 6-Stage Visual Flow */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 relative">
          {stages.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className={`rounded-xl p-3 border ${st.color} flex flex-col justify-between relative group hover:scale-[1.02] transition-transform`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-80">
                      STAGE 0{st.step}
                    </span>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 mb-1 font-mono">
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Invariant Rules Overview */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">✓ Power Ceiling Lock</span>
            <p className="text-[11px] text-slate-400">Total home load cannot exceed 3,500W main breaker limit.</p>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">✓ Compressor Anti-Cycle</span>
            <p className="text-[11px] text-slate-400">Enforces minimum 15s hysteresis on AC compressor to avoid pressure shock.</p>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">✓ Thermal Window Guard</span>
            <p className="text-[11px] text-slate-400">Modifies AC to Eco mode or warns if exterior door/window is open.</p>
          </div>
        </div>
      </div>

      {/* Real-Time Safety Audit Trail */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Safety Validator Live Audit Log</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-500">
            Immutable Decision Trail
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2 font-medium">Log ID</th>
                <th className="pb-2 font-medium">Time</th>
                <th className="pb-2 font-medium">Source</th>
                <th className="pb-2 font-medium">Target</th>
                <th className="pb-2 font-medium">Proposed Action</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Safety Invariant & Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {safetyAudit.slice(0, 6).map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 text-cyan-400 font-bold">{log.id || `LOG-${idx}`}</td>
                  <td className="py-2.5 text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 text-slate-300">{log.source}</td>
                  <td className="py-2.5 text-slate-200 font-semibold">{log.target}</td>
                  <td className="py-2.5 text-slate-400 truncate max-w-[150px]">{log.proposed_action}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.safety_status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : log.safety_status === 'MODIFIED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {log.safety_status}
                    </span>
                  </td>
                  <td className="py-2.5 text-[11px] text-slate-400 leading-tight max-w-[280px]">
                    {log.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
