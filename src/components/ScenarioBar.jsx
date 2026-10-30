import React, { useState } from 'react';
import { Flame, LogOut, MessageSquareText, RotateCcw, CheckCircle2, Play } from 'lucide-react';

export default function ScenarioBar({ onTriggerScenario, onResetSimulation }) {
  const [activeScenario, setActiveScenario] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleScenarioClick = async (scenarioId, label) => {
    setActiveScenario(scenarioId);
    setFeedbackMsg(`Triggering ${label}...`);
    try {
      const res = await onTriggerScenario(scenarioId);
      setFeedbackMsg(`✓ ${res.title || label} Activated Successfully`);
      setTimeout(() => setFeedbackMsg(''), 5000);
    } catch (err) {
      setFeedbackMsg(`Failed to trigger scenario: ${err.message}`);
    }
  };

  const handleReset = async () => {
    setActiveScenario(null);
    setFeedbackMsg('Restoring autonomous simulation...');
    try {
      await onResetSimulation();
      setFeedbackMsg('✓ Autonomous IoT Simulation & Adaptive Rules Restored');
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      setFeedbackMsg(`Reset failed: ${err.message}`);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-3 border border-cyan-500/20 shadow-lg bg-gradient-to-r from-slate-900/90 via-slate-950/95 to-slate-900/90">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Scenario Header */}
        <div className="flex items-center gap-2.5">
          <div className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-semibold flex items-center gap-1.5">
            <Play className="w-3 h-3 text-indigo-400 fill-indigo-400" />
            <span>COLLEGE VIVA / DEMO SCENARIOS:</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            1-Click instant presentation testing buttons
          </span>
        </div>

        {/* 3 Scenario Buttons + Reset */}
        <div className="flex flex-wrap items-center gap-2">
          {/* SCENARIO 1 */}
          <button
            onClick={() => handleScenarioClick(1, 'Scenario 1 (High Temp)')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeScenario === 1
                ? 'bg-rose-500 text-black shadow-glow-red font-bold'
                : 'bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300'
            }`}
            title="Sets Temp=33°C, Humidity=75%, Occupancy=YES. Triggers Cooling=HIGH, AC & Fan=ON."
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>SCENARIO 1: High Temperature</span>
          </button>

          {/* SCENARIO 2 */}
          <button
            onClick={() => handleScenarioClick(2, 'Scenario 2 (Leaving Home)')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeScenario === 2
                ? 'bg-amber-400 text-black shadow-glow-amber font-bold'
                : 'bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300'
            }`}
            title="Sets Occupancy=NO, Light=OFF, Fan=OFF, AC=OFF, Security=ON (Armed-Away)."
          >
            <LogOut className="w-3.5 h-3.5 text-amber-400" />
            <span>SCENARIO 2: Leaving Home</span>
          </button>

          {/* SCENARIO 3 */}
          <button
            onClick={() => handleScenarioClick(3, 'Scenario 3 (AI Explanation)')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeScenario === 3
                ? 'bg-cyan-400 text-black shadow-glow-cyan font-bold'
                : 'bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300'
            }`}
            title="Asks GenAI 'Why did you turn on the fan?' and returns sensor-grounded reasoning."
          >
            <MessageSquareText className="w-3.5 h-3.5 text-cyan-400" />
            <span>SCENARIO 3: AI Explanation</span>
          </button>

          {/* RESET BUTTON */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
            title="Reset to autonomous sensor simulation & clear overrides"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Auto</span>
          </button>
        </div>
      </div>

      {/* Dynamic Feedback Notification Bar */}
      {feedbackMsg && (
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-cyan-300">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {feedbackMsg}
          </span>
          <span className="text-[11px] text-slate-400">
            Hardware & DNN state synchronized
          </span>
        </div>
      )}
    </div>
  );
}
