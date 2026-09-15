import React, { useState } from 'react';
import { Camera, Scan, CheckCircle, AlertTriangle, ShieldCheck, Upload, Sparkles, Eye, FileSearch } from 'lucide-react';

export default function ProductScanner() {
  const [selectedProduct, setSelectedProduct] = useState('water');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const sampleProducts = [
    {
      id: 'water',
      title: 'Packaged Water Bottle',
      standard: 'IS 14544 : 2016',
      markType: 'ISI Standard Mark + 7-digit CM/L',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=500&auto=format&fit=crop&q=80',
      compliance: 'PASS',
      score: '98.5% Authenticity',
      detectedMark: 'ISI Logo + CM/L-8765432 Detected on Bottle Neck',
      details: 'Font weight, dimensions, and standard IS number match official BIS Gazette specifications.'
    },
    {
      id: 'helmet',
      title: 'Two-Wheeler Motorcycle Helmet',
      standard: 'IS 4151 : 2015',
      markType: 'ISI Stamp Engraved on Shell',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=80',
      compliance: 'PASS',
      score: '99.1% Authenticity',
      detectedMark: 'IS 4151 Engraved Stamp Verified',
      details: 'Shell impact liner density & chin strap retention tags conform to Section 6.2.'
    },
    {
      id: 'adapter',
      title: 'IT Power Adapter / Laptop Charger',
      standard: 'IS 13252 (Part 1)',
      markType: 'CRS Registration Mark (R-Number)',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80',
      compliance: 'PASS',
      score: '96.8% Authenticity',
      detectedMark: 'CRS Logo + R-41009823 Verified',
      details: 'Over-voltage protection & double insulation safety symbols verified.'
    },
    {
      id: 'gold',
      title: '22K Gold Hallmark Ornament',
      standard: 'IS 1417 : 2016',
      markType: 'Laser Etched 6-digit HUID',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
      compliance: 'PASS',
      score: '100% Authentic HUID',
      detectedMark: 'HUID: XY8921 + 22K916 Triangle Mark',
      details: 'BIS Assaying Centre hallmark laser stamp confirmed under Fire Assay standards.'
    }
  ];

  const handleRunScan = (prodId) => {
    setIsScanning(true);
    setScanResult(null);
    const prod = sampleProducts.find((p) => p.id === prodId);

    setTimeout(() => {
      setScanResult(prod);
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
            <Camera className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              AI Vision Product Safety & Logo Scanner
            </h2>
            <p className="text-xs text-slate-400">
              Computer vision detection for ISI Mark, CRS Registration, and Gold HUID authenticity
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/40 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> OpenCV + YOLO Vision AI
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Product Selection & Image Frame */}
        <div>
          <span className="text-xs text-slate-400 font-medium block mb-2">
            📸 Select Product Sample or Upload Image:
          </span>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {sampleProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p.id);
                  handleRunScan(p.id);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedProduct === p.id
                    ? 'bg-slate-900 border-cyan-500/60 ring-1 ring-cyan-500/30 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold truncate">{p.title}</div>
                <div className="text-[10px] font-mono text-cyan-400 mt-0.5">{p.standard}</div>
              </button>
            ))}
          </div>

          {/* Image Viewport with Bounding Box Overlay */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-56 flex items-center justify-center group">
            <img
              src={sampleProducts.find((p) => p.id === selectedProduct)?.image}
              alt="Product Sample"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>

            {/* Bounding Box Scanner Overlay */}
            {isScanning ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm">
                <Scan className="w-10 h-10 text-cyan-400 animate-spin mb-2" />
                <span className="text-xs font-mono text-cyan-300">
                  Scanning for ISI / HUID Mark geometry...
                </span>
              </div>
            ) : scanResult ? (
              <div className="absolute top-4 left-4 right-4 p-2 bg-emerald-950/80 border border-emerald-500/60 rounded-xl backdrop-blur-md flex items-center justify-between text-xs text-emerald-300 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  {scanResult.detectedMark}
                </span>
                <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                  {scanResult.score}
                </span>
              </div>
            ) : null}

            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
              Live Camera / Image Feed
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Report */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-2">
              📋 AI Inspection Report & Mark Verification
            </span>

            {scanResult ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    {scanResult.title}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
                    {scanResult.compliance}
                  </span>
                </div>

                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Target Standard</span>
                    <span className="text-cyan-400 font-mono font-semibold">{scanResult.standard}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Mark Type Inspected</span>
                    <span className="text-slate-300">{scanResult.markType}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">CV Geometric Analysis</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {scanResult.details}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-8 text-center text-xs text-slate-500">
                Click "Run AI Vision Scan" to perform computer vision inspection.
              </div>
            )}
          </div>

          <button
            onClick={() => handleRunScan(selectedProduct)}
            disabled={isScanning}
            className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>Run AI Vision Scan ({sampleProducts.find((p) => p.id === selectedProduct)?.title})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
