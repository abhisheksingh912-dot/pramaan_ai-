import React, { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, CheckCircle, QrCode, Building, MapPin, Calendar, FileCheck, RefreshCw } from 'lucide-react';
import { bisApiService } from '../services/apiService';
import confetti from 'canvas-confetti';

export default function VerificationTool({ demoMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleVerify = async (codeToTest) => {
    const query = (codeToTest || searchQuery).trim();
    if (!query) return;

    setIsSearching(true);
    setErrorMsg(null);

    const res = await bisApiService.verifyCertificate(query);
    if (res) {
      setResult(res);
      if (res.status === 'VALID' || res.status === 'AUTHENTIC') {
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      setResult(null);
      setErrorMsg(`No active BIS License or HUID found for "${query}". Please verify CM/L or HUID format.`);
    }
    setIsSearching(false);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Certificate & License Verifier
              {demoMode && (
                <span className="text-[10px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold">
                  DEMO DATA MODE
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Verify CM/L Numbers, CRS Registration & 6-digit Hallmark HUIDs with local manufacturing validity
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
          GET /api/certificates/verify
        </span>
      </div>

      {/* Quick Example Button Chips */}
      <div className="mb-4">
        <span className="text-[11px] text-slate-400 font-medium block mb-2">
          Click sample license to test verification:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setSearchQuery('CM/L-8765432'); handleVerify('CM/L-8765432'); }}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/30 transition-all font-mono"
          >
            CM/L-8765432 (Packaged Water)
          </button>

          <button
            onClick={() => { setSearchQuery('HUID-XY8921'); handleVerify('HUID-XY8921'); }}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-all font-mono"
          >
            HUID: XY8921 (22K Gold Bangle)
          </button>

          <button
            onClick={() => { setSearchQuery('R-41009823'); handleVerify('R-41009823'); }}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-all font-mono"
          >
            R-41009823 (Adapter CRS)
          </button>

          <button
            onClick={() => { setSearchQuery('CM/L-9999999'); handleVerify('CM/L-9999999'); }}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/30 transition-all font-mono"
          >
            CM/L-9999999 (Expired Fake)
          </button>
        </div>
      </div>

      {/* Input Search Box */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            placeholder="Enter CM/L License No (e.g. 8765432), CRS Number or 6-digit HUID..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>

        <button
          onClick={() => handleVerify()}
          disabled={isSearching}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2 text-xs sm:text-sm"
        >
          {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          <span>Verify Certificate</span>
        </button>
      </div>

      {/* Error Output */}
      {errorMsg && (
        <div className="bg-red-950/40 border border-red-800/60 p-4 rounded-xl flex items-center space-x-3 text-xs text-red-300 font-mono">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Verification Result Card Badge */}
      {result && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden space-y-4">
          {/* Status Badge Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                  BIS Official Record Certificate
                </span>
                <h3 className="text-sm font-bold font-mono text-amber-400">
                  {result.cmlNo}
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center space-x-1.5 ${
                  result.status === 'VALID' || result.status === 'AUTHENTIC'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                    : 'bg-red-500/10 text-red-400 border-red-500/40'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>STATUS: {result.status}</span>
              </span>
            </div>
          </div>

          {/* Grid Information Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2.5">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Certificate Holder / Manufacturer</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  {result.holderName}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Product & Standard</span>
                <span className="text-slate-200 font-medium mt-0.5 block">
                  {result.product} — (<code className="text-cyan-400">{result.isStandard}</code>)
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Local / Geographic Validity</span>
                <span className="text-emerald-400 font-mono font-semibold mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {result.localValidity}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Validity Dates</span>
                <span className="text-slate-200 font-medium flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Issued: {result.issueDate} | Expiry: {result.expiryDate}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Testing Laboratory</span>
                <span className="text-slate-300 mt-0.5 block">
                  {result.testingLab}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Manufacturing Address</span>
                <span className="text-slate-400 text-[11px] mt-0.5 block">
                  {result.manufacturingLocation}
                </span>
              </div>
            </div>
          </div>

          {/* Demo Disclaimer Warning Banner */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-amber-400 bg-amber-950/20 p-2.5 rounded-lg border border-amber-800/40">
            <span className="flex items-center gap-1">
              <QrCode className="w-4 h-4 text-amber-400" />
              {result.demoTag}
            </span>
            <span className="text-slate-400">Digital Hash: 0x9F42...B7E1</span>
          </div>
        </div>
      )}
    </div>
  );
}
