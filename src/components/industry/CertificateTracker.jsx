import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Calendar, FileText, RefreshCw, Bell } from 'lucide-react';
import { CERTIFICATES_REGISTRY } from '../../data/certificates';

export default function CertificateTracker() {
  const [filterStatus, setFilterStatus] = useState('ALL');

  const certificates = CERTIFICATES_REGISTRY;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Industry Certificate Tracker & Expiry Alerts
              <span className="text-[10px] font-mono bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-800/40">
                Live Audit Monitor
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Track CM/L licenses, renewal dates, surveillance audits, and mandatory document submissions
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-red-400 bg-red-950/60 px-2.5 py-1 rounded border border-red-800/40 flex items-center gap-1">
            <Bell className="w-3.5 h-3.5" /> 1 Expiry Warning Active
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {['ALL', 'VALID', 'EXPIRED', 'AUTHENTIC'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              filterStatus === st
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {st} CERTIFICATES
          </button>
        ))}
      </div>

      {/* Certificate Cards */}
      <div className="space-y-3">
        {certificates
          .filter((c) => filterStatus === 'ALL' || c.status === filterStatus)
          .map((c, idx) => (
            <div
              key={idx}
              className={`bg-slate-900/90 border p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                c.status === 'EXPIRED'
                  ? 'border-red-500/60 bg-red-950/20'
                  : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold font-mono text-amber-400">{c.cmlNo}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                      c.status === 'VALID' || c.status === 'AUTHENTIC'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
                        : 'bg-red-950 text-red-400 border-red-800/40'
                    }`}
                  >
                    STATUS: {c.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">{c.holderName}</h4>
                <p className="text-[11px] text-slate-400">{c.product} ({c.isStandard})</p>
                <div className="text-[10px] text-cyan-400 mt-1 font-mono">
                  📍 {c.localValidity}
                </div>
              </div>

              <div className="text-right text-xs font-mono space-y-1">
                <span className="text-slate-400 block">Valid till: <strong className="text-slate-200">{c.expiryDate}</strong></span>
                <span className="text-slate-500 block text-[10px]">{c.testingLab}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
