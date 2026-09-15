import React, { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, Building2, FileCheck, ShieldCheck, Award } from 'lucide-react';
import { INDUSTRY_ROADMAP_STEPS } from '../../data/industryRules';

export default function ComplianceRoadmap() {
  const [completedSteps, setCompletedSteps] = useState([1, 2, 3]);

  const toggleStep = (stepNum) => {
    if (completedSteps.includes(stepNum)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNum));
    } else {
      setCompletedSteps([...completedSteps, stepNum]);
    }
  };

  const progressPercentage = Math.round((completedSteps.length / INDUSTRY_ROADMAP_STEPS.length) * 100);

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
            <Building2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Industry & MSME BIS Certification Roadmap
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/40">
                Manakonline Workflow
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 9-step step-by-step roadmap to obtain BIS ISI Mark or CRS Registration for your factory
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-slate-400">Readiness Score:</span>
          <span className="text-emerald-400 font-bold bg-slate-900 px-3 py-1 rounded border border-slate-800">
            {progressPercentage}% Completed
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2.5 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {INDUSTRY_ROADMAP_STEPS.map((s) => {
          const isDone = completedSteps.includes(s.step);
          return (
            <div
              key={s.step}
              onClick={() => toggleStep(s.step)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isDone
                  ? 'bg-slate-900/90 border-emerald-500/60 text-slate-100'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400">STEP 0{s.step}</span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <h3 className="text-xs font-bold mb-1 text-slate-200">{s.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
