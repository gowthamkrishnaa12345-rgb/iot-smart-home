import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  ShieldCheck,
  Bot,
  User,
  ArrowRight,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Terminal,
  Clock
} from 'lucide-react';

export default function GenAIChat({ onSendMessage, isProcessing }) {
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "Hello! I am your AIoT GenAI Assistant. I interpret your natural language requests, inspect live IoT sensor metrics & DNN models, and forward structured commands through our Safety Validator before triggering hardware automation.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      structured_command: null,
      safety_result: null
    }
  ]);
  const messagesEndRef = useRef(null);

  const samplePrompts = [
    "Turn on the fan",
    "I am leaving home",
    "Set the home to sleep mode",
    "Why did you turn on the fan?",
    "How can I reduce energy consumption?",
    "What is the current temperature?",
    "Is the room comfortable?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || isProcessing) return;

    const userEntry = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userEntry]);
    if (!textToSend) setInputMsg('');

    try {
      const response = await onSendMessage(text);
      const botEntry = {
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structured_command: response.structured_command,
        safety_result: response.safety_result
      };
      setMessages((prev) => [...prev, botEntry]);
    } catch (err) {
      const errEntry = {
        sender: 'assistant',
        text: `Error communicating with GenAI server: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errEntry]);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 flex flex-col h-[650px] shadow-xl bg-slate-950/70">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-glow-cyan">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
              <span>GenAI Assistant & Natural Language Engine</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Zero-Key Edge AI • Natural Language to Hardware Safety Pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Safety Validator Active</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar border-b border-slate-800/60">
        <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap pl-1">
          Suggestions:
        </span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isProcessing}
            className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 whitespace-nowrap text-xs font-sans transition-all cursor-pointer disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
        {messages.map((m, idx) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={idx}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-500 font-mono">
                {isUser ? (
                  <>
                    <span>You</span>
                    <Clock className="w-3 h-3 ml-1" />
                    <span>{m.timestamp}</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-400 font-medium">Aegis GenAI</span>
                    <span className="ml-1">{m.timestamp}</span>
                  </>
                )}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md rounded-tr-none'
                    : 'glass-card border border-slate-800 bg-slate-900/90 text-slate-200 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {m.text}
                </div>

                {/* Structured Command & Safety Validator Inspection Box */}
                {!isUser && m.structured_command && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 font-mono text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between text-cyan-300 border-b border-slate-800 pb-1">
                      <span className="flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-cyan-400" />
                        Stage 3: Structured Command
                      </span>
                      <span className="text-[10px] text-slate-400">JSON Payload</span>
                    </div>
                    <pre className="text-slate-400 text-[10px] overflow-x-auto">
                      {JSON.stringify(m.structured_command, null, 2)}
                    </pre>

                    {m.safety_result && (
                      <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[11px]">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Stage 4 Safety Status:
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.safety_result.safety_status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {m.safety_result.safety_status}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isProcessing && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 p-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>GenAI reasoning & safety validating...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-3 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Ask a question or issue a command (e.g., 'Turn on the fan', 'Why did you turn on the fan?')..."
          disabled={isProcessing}
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!inputMsg.trim() || isProcessing}
          className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-cyan cursor-pointer"
          title="Send Command"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
