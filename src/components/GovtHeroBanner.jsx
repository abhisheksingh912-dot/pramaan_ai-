import React from 'react';
import { ArrowRight, ShieldCheck, Eye, MapPin, Building2, UserCheck, Sparkles, Award } from 'lucide-react';

export default function GovtHeroBanner({ onNavigateTab, themeMode }) {
  const quickServices = [
    { title: 'Consumer Verification', desc: 'Verify ISI Mark, CRS Registration & Gold HUID', icon: ShieldCheck, target: 'verify', color: 'border-emerald-500/30' },
    { title: 'AI Product Vision Scanner', desc: 'Scan product image/label for ISI mark authenticity', icon: Eye, target: 'single-scanner', color: 'border-cyan-500/30' },
    { title: 'Find Nearby BIS Labs', desc: 'Locate 45+ NABL-accredited testing labs in India', icon: MapPin, target: 'labs', color: 'border-amber-500/30' },
    { title: 'MSME Licensing Hub', desc: 'Step-by-step Manakonline licensing application & STI', icon: Building2, target: 'compliance-roadmap', color: 'border-purple-500/30' }
  ];

  return (
    <div className="space-y-6">
      {/* Main UIDAI-Style Hero Card Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl relative overflow-hidden transition-all ${
        themeMode === 'govt'
          ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-amber-50 border-slate-200 text-slate-900'
          : 'bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/80 border-slate-800 text-slate-100'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                themeMode === 'govt'
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                <Sparkles className="w-3.5 h-3.5" /> Official Government AI Portal
              </span>
              <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                themeMode === 'govt'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                  : 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
              }`}>
                Pramaan AI (BIS)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
              MyBIS Portal Has a <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 bg-clip-text text-transparent">Refreshed AI Look</span>
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed max-w-xl ${
              themeMode === 'govt' ? 'text-slate-600' : 'text-slate-300'
            }`}>
              What would you like to verify today? Empowering 1.4 Billion consumers & MSMEs with Voice AI, multi-lingual IS standards explorer, and digital certificate verification.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('voice')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center space-x-2 text-xs sm:text-sm"
              >
                <span>Ask Pramaan AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('verify')}
                className={`font-bold px-5 py-3 rounded-xl border transition-all text-xs sm:text-sm ${
                  themeMode === 'govt'
                    ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-800'
                }`}
              >
                Verify CM/L License / HUID
              </button>
            </div>
          </div>

          {/* Right Image / Device Mockup Preview (Reflecting UIDAI screenshot style) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md bg-slate-950 p-2 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
              <div className="bg-slate-900 px-3 py-1.5 rounded-t-xl flex items-center space-x-1.5 border-b border-slate-800 text-[10px] font-mono text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span className="pl-2 truncate">https://bis.gov.in/mybis-ai</span>
              </div>
              <div className="p-4 bg-slate-900 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-amber-400">
                  <span className="font-bold flex items-center gap-1">
                    <Award className="w-4 h-4" /> BIS SmartAssist AI
                  </span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/40">
                    200 OK
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                  "IS 14544 : Packaged drinking water license CM/L-8765432 is VALID till 2028."
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-cyan-400">
                    IS Standards: 21,000+
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-emerald-400">
                    Labs: 45+ NABL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid (Inspired by MyAadhaar "Popular Aadhaar Services") */}
      <div>
        <span className={`text-xs font-mono font-bold uppercase block mb-3 tracking-wider ${
          themeMode === 'govt' ? 'text-slate-500' : 'text-slate-400'
        }`}>
          Popular BIS Care & Industry Services:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickServices.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigateTab(srv.target)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] shadow-md flex items-start space-x-3.5 ${
                  themeMode === 'govt'
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
                    : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 text-slate-100'
                }`}
              >
                <div className={`p-2.5 rounded-xl bg-slate-950 text-amber-400 border ${srv.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-heading">{srv.title}</h3>
                  <p className={`text-[11px] mt-0.5 line-clamp-2 ${
                    themeMode === 'govt' ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {srv.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
