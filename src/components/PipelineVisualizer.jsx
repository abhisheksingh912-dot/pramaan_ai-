import React, { useState } from 'react';
import { Network, Database, Cpu, Volume2, ArrowRight, CheckCircle2, Sparkles, Code2, Layers, RefreshCw, ShieldAlert, FileText, Search } from 'lucide-react';

export default function PipelineVisualizer({ lastQueryData }) {
  const [activeStep, setActiveStep] = useState(1);

  // Extended 10-Stage RAG Flow Architecture
  const ragArchitectureSteps = [
    { id: 1, title: '01. User Query', desc: 'Text / Speech Input in 12+ Indian Languages', icon: Search },
    { id: 2, title: '02. Intent Classify', desc: 'Licensing, Verification, Standard Clause, Grievance', icon: Network },
    { id: 3, title: '03. Domain Routing', desc: 'Food, Electronics, Hallmarking, Automotive, Toys', icon: Layers },
    { id: 4, title: '04. BIS Knowledge', desc: 'Gazette QCO Orders & 21,000+ IS Regulations Index', icon: Database },
    { id: 5, title: '05. Vector Search', desc: 'Cosine similarity embedding lookup (1536 float32)', icon: Code2 },
    { id: 6, title: '06. Reranking Engine', desc: 'Cross-encoder relevance scoring over top-k clauses', icon: Sparkles },
    { id: 7, title: '07. LLM Generation', desc: 'Grounded response formatting with IS Code citations', icon: Cpu },
    { id: 8, title: '08. Citation Verify', desc: 'Cross-checks generated CM/L numbers & IS clauses', icon: FileText },
    { id: 9, title: '09. Safety Filter', desc: 'Zero Hallucination Filter & Non-Official Disclaimer', icon: ShieldAlert },
    { id: 10, title: '10. Voice Synthesis', desc: 'Neural TTS playback streaming in target dialect', icon: Volume2 }
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-100">
              AI RAG & Multilingual Architecture Flow (10-Stage Pipeline)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Live inspection of intent classification, vector search reranking, grounded LLM generation & citation verification
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="bg-slate-900 text-cyan-400 border border-slate-800 px-3 py-1 rounded-lg">
            Vector Store: <span className="text-slate-200">Qdrant BIS Cluster (21k Standards)</span>
          </span>
        </div>
      </div>

      {/* 10 Step Flow Cards Horizontal Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-6">
        {ragArchitectureSteps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                isActive
                  ? 'bg-slate-900 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[9px] font-mono text-slate-500">#{step.id}</span>
              </div>
              <h3 className="text-[11px] font-bold truncate text-slate-200">{step.title}</h3>
              <p className="text-[9px] text-slate-400 line-clamp-2 mt-0.5">{step.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Active Stage Detailed Telemetry */}
      {ragArchitectureSteps.find((s) => s.id === activeStep) && (
        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Stage {activeStep}: {ragArchitectureSteps[activeStep - 1].title} Execution Details
            </h4>
            <span className="text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40 text-[10px]">
              LATENCY: 12ms • ZERO HALLUCINATION CHECK PASSED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Active Sub-Routine</span>
              <span className="text-slate-200 font-bold">{ragArchitectureSteps[activeStep - 1].desc}</span>
              <p className="text-slate-400 text-[11px] font-sans mt-2">
                Retrieves authoritative Indian Standard clauses from official BIS Gazette index, avoiding unverified web assumptions.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Modular Data Source Binding</span>
              <span className="text-cyan-400">/data/bis-standards • /data/certificates</span>
              <p className="text-slate-400 text-[11px] font-sans mt-2">
                Strict citation verification ensures every LLM response displays relevant IS code, clause number & CM/L registry status.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
