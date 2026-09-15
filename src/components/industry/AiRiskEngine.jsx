import React, { useState } from 'react';
import { Cpu, AlertTriangle, ShieldCheck, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { calculateAiRiskScore } from '../../data/industryRules';

export default function AiRiskEngine() {
  const [params, setParams] = useState({
    isLicenseActive: true,
    isStiLogComplete: true,
    isLabTestCleared: true,
    isLabelCompliant: true,
    hasExpiredAlert: false
  });

  const riskResult = calculateAiRiskScore(params);

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
            <Cpu className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              AI Compliance Risk Score Calculator (0–100)
              <span className="text-[10px] font-mono bg-purple-950 text-purple-400 px-2 py-0.5 rounded border border-purple-800/40">
                Explainable Risk Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive AI audit readiness scoring based on license validity, STI logs, lab reports & label artwork
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
          Internal Audit Predictor v2.4
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Toggles Form */}
        <div className="lg:col-span-6 space-y-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-xs">
          <span className="text-slate-400 font-bold block mb-2">⚙️ Select Audit Verification Parameters:</span>

          <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
            <span className="text-slate-200">Active BIS CM/L or CRS License</span>
            <input
              type="checkbox"
              checked={params.isLicenseActive}
              onChange={(e) => setParams({ ...params, isLicenseActive: e.target.checked })}
              className="accent-purple-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
            <span className="text-slate-200">NABL Lab 6-Month Test Sample Clearance</span>
            <input
              type="checkbox"
              checked={params.isLabTestCleared}
              onChange={(e) => setParams({ ...params, isLabTestCleared: e.target.checked })}
              className="accent-purple-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
            <span className="text-slate-200">Daily Scheme of Testing & Inspection (STI) Logs Complete</span>
            <input
              type="checkbox"
              checked={params.isStiLogComplete}
              onChange={(e) => setParams({ ...params, isStiLogComplete: e.target.checked })}
              className="accent-purple-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
            <span className="text-slate-200">Product Label & ISI Artwork Fully Compliant</span>
            <input
              type="checkbox"
              checked={params.isLabelCompliant}
              onChange={(e) => setParams({ ...params, isLabelCompliant: e.target.checked })}
              className="accent-purple-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
            <span className="text-slate-200">Renewal Warning active (&lt; 30 Days Expiry)</span>
            <input
              type="checkbox"
              checked={params.hasExpiredAlert}
              onChange={(e) => setParams({ ...params, hasExpiredAlert: e.target.checked })}
              className="accent-purple-500 w-4 h-4"
            />
          </label>
        </div>

        {/* Right Risk Score Gauge & Factors */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono uppercase">Calculated Compliance Score</span>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                  riskResult.riskLevel === 'HIGH RISK'
                    ? 'bg-red-950 text-red-400 border-red-800/40'
                    : riskResult.riskLevel === 'MEDIUM RISK'
                    ? 'bg-amber-950 text-amber-400 border-amber-800/40'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
                }`}
              >
                {riskResult.riskLevel}
              </span>
            </div>

            {/* Score Big Display */}
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold font-mono text-purple-400">{riskResult.score}</span>
              <span className="text-slate-500 font-mono text-sm">/ 100 Points</span>
            </div>

            {/* Deductions & Factors List */}
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1 font-mono">
                Explainable Risk Factor Breakdown:
              </span>
              {riskResult.factors.length > 0 ? (
                <ul className="space-y-1">
                  {riskResult.factors.map((f, idx) => (
                    <li key={idx} className="text-[11px] text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Compliant — Factory passes all BIS STI quality audit requirements!</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
            {riskResult.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
}
