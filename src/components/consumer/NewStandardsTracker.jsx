import React, { useState } from 'react';
import { BookOpen, Sparkles, AlertCircle, FileText, CheckCircle2, Clock, Calendar } from 'lucide-react';

export default function NewStandardsTracker() {
  const [activeTab, setActiveTab] = useState('NEW');

  const standardsData = {
    NEW: [
      { code: 'IS 17855 : 2022', title: 'Traction Battery Packs for Electric Vehicles', date: '2026-08-01', industry: 'Automotive & EV', status: 'Mandatory QCO Enforced' },
      { code: 'IS 18234 : 2025', title: 'Smart Grid Energy Meter Communication Protocols', date: '2026-06-15', industry: 'Electrical Power', status: 'Mandatory QCO Enforced' }
    ],
    UPDATED: [
      { code: 'IS 14544 : 2016 (Rev 2)', title: 'Packaged Drinking Water - Microplastic Threshold Amendment', date: '2026-07-20', industry: 'Beverages', status: 'Updated Clause 4.1' },
      { code: 'IS 4151 : 2015 (Amnd 4)', title: 'Protective Helmets - Chin Strap Retention Force Revision', date: '2026-05-10', industry: 'Automotive Safety', status: 'Updated Clause 6.4' }
    ],
    WITHDRAWN: [
      { code: 'IS 13252 (Part 1) : 2003', title: 'IT Equipment Safety (Superseded by 2010 Revision)', date: '2023-12-31', industry: 'IT & Electronics', status: 'WITHDRAWN (Obsolete)' }
    ],
    DRAFT: [
      { code: 'DRAFT FAD 14 (2910)', title: 'Biodegradable Plastic Bottle Caps Specification', date: 'Comments due Oct 2026', industry: 'Packaging', status: 'PUBLIC COMMENTS OPEN' }
    ]
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
            <BookOpen className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              New & Updated IS Standards Tracker
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/40">
                BIS Gazette Registry
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Track newly published, updated, withdrawn, and draft Indian Standards open for public comment
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        {['NEW', 'UPDATED', 'WITHDRAWN', 'DRAFT'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === tab
                ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab} STANDARDS
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="space-y-3 font-mono">
        {standardsData[activeTab].map((std, idx) => (
          <div key={idx} className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-amber-400 font-bold block">{std.code}</span>
              <span className="text-slate-200 font-sans font-semibold text-sm">{std.title}</span>
              <div className="text-[10px] text-slate-400 mt-1">
                Industry: {std.industry} • Published: {std.date}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-950 text-cyan-400 border border-slate-800">
              {std.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
