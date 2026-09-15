import React, { useState } from 'react';
import { Camera, Layers, CheckCircle2, AlertTriangle, ShieldCheck, Download, Sparkles, FileSpreadsheet, RefreshCw, X } from 'lucide-react';

export default function MultiProductScanner() {
  const [selectedProducts, setSelectedProducts] = useState([
    {
      id: 'water',
      title: 'Packaged Mineral Water Bottle',
      category: 'Food & Beverage',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=500&auto=format&fit=crop&q=80',
      isStandard: 'IS 14544 : 2016',
      bisRequired: 'MANDATORY (ISI Mark)',
      licenseStatus: 'Verified (CM/L-8765432)',
      riskLevel: 'LOW RISK',
      score: 98
    },
    {
      id: 'helmet',
      title: 'Motorcycle Protective Helmet',
      category: 'Automotive Safety',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=80',
      isStandard: 'IS 4151 : 2015',
      bisRequired: 'MANDATORY (ISI Engraved)',
      licenseStatus: 'Verified (CM/L-1234567)',
      riskLevel: 'LOW RISK',
      score: 99
    },
    {
      id: 'toy',
      title: 'Unbranded Plastic Toy Helicopter',
      category: 'Child Toy Safety',
      image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&auto=format&fit=crop&q=80',
      isStandard: 'IS 9873 : 2019',
      bisRequired: 'MANDATORY (QCO Order)',
      licenseStatus: 'NO LICENSE FOUND',
      riskLevel: 'HIGH RISK (SUSPICIOUS)',
      score: 32
    },
    {
      id: 'adapter',
      title: '65W USB-C Fast Laptop Adapter',
      category: 'Electronics & IT',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80',
      isStandard: 'IS 13252 (Part 1)',
      bisRequired: 'MANDATORY (CRS R-Number)',
      licenseStatus: 'Verified (R-41009823)',
      riskLevel: 'LOW RISK',
      score: 96
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);

  const handleRunMultiScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1500);
  };

  const handleExportReport = () => {
    const reportData = JSON.stringify(selectedProducts, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BIS_Multi_Product_Safety_Report_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30">
            <Layers className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Multi-Product Safety Vision Scanner
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/40">
                Parallel Batch Scan
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Upload multiple product images to compare Indian Standards, BIS licensing requirements & counterfeit risk flags
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunMultiScan}
            disabled={isScanning}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2 text-xs"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Run Multi-Batch Vision Scan</span>
          </button>
        </div>
      </div>

      {/* Product Image Grid Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {selectedProducts.map((prod, idx) => (
          <div
            key={prod.id}
            className={`bg-slate-950 border rounded-xl overflow-hidden relative p-2 transition-all ${
              prod.riskLevel.includes('HIGH')
                ? 'border-red-500/60 ring-1 ring-red-500/30'
                : 'border-slate-800'
            }`}
          >
            <div className="h-32 rounded-lg overflow-hidden relative">
              <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 text-[10px] font-mono bg-slate-900/90 text-slate-200 px-2 py-0.5 rounded border border-slate-800">
                Item #0{idx + 1}
              </span>
              <span
                className={`absolute bottom-2 right-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                  prod.riskLevel.includes('HIGH')
                    ? 'bg-red-950 text-red-400 border-red-800/60'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-800/60'
                }`}
              >
                {prod.riskLevel}
              </span>
            </div>
            <div className="mt-2 text-xs font-bold truncate text-slate-200">{prod.title}</div>
            <div className="text-[10px] text-cyan-400 font-mono">{prod.isStandard}</div>
          </div>
        ))}
      </div>

      {/* Comparative Safety Matrix Table */}
      {scanComplete && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 overflow-x-auto space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              Multi-Product Safety Comparison Matrix
            </h3>
            <button
              onClick={handleExportReport}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5 font-mono"
            >
              <Download className="w-3.5 h-3.5" /> Export Report (JSON)
            </button>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800 text-[10px] uppercase">
                <th className="pb-2">Product</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">IS Standard</th>
                <th className="pb-2">BIS Requirement</th>
                <th className="pb-2">License Verification</th>
                <th className="pb-2">Risk Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {selectedProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-950/40">
                  <td className="py-2.5 font-bold text-slate-100">{p.title}</td>
                  <td className="py-2.5 text-slate-400">{p.category}</td>
                  <td className="py-2.5 text-cyan-400">{p.isStandard}</td>
                  <td className="py-2.5 text-amber-300">{p.bisRequired}</td>
                  <td className="py-2.5">{p.licenseStatus}</td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        p.riskLevel.includes('HIGH')
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      {p.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
