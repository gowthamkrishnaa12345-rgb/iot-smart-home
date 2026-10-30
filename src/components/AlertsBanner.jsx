import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export default function AlertsBanner({ alerts = [] }) {
  const [dismissed, setDismissed] = useState([]);

  const activeAlerts = alerts.filter(a => !dismissed.includes(a.id));

  const handleDismiss = (id) => {
    setDismissed(prev => [...prev, id]);
  };

  if (!activeAlerts || activeAlerts.length === 0) {
    return null;
  }

  const getAlertStyles = (level) => {
    switch (level) {
      case 'critical':
        return {
          border: 'border-rose-500/40',
          bg: 'bg-rose-950/40 text-rose-200',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
        };
      case 'warning':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/40 text-amber-200',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        };
      default:
        return {
          border: 'border-cyan-500/40',
          bg: 'bg-cyan-950/40 text-cyan-200',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        };
    }
  };

  return (
    <div className="space-y-2">
      {activeAlerts.map((alt) => {
        const style = getAlertStyles(alt.level);
        return (
          <div
            key={alt.id}
            className={`p-3 rounded-xl border ${style.border} ${style.bg} flex items-start justify-between gap-3 shadow-md backdrop-blur-md animate-fadeIn`}
          >
            <div className="flex items-start gap-2.5">
              {style.icon}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono tracking-wide">
                    {alt.title}
                  </span>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.2 rounded-full border ${style.badge}`}>
                    {alt.level}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {alt.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  {alt.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDismiss(alt.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Dismiss Alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
