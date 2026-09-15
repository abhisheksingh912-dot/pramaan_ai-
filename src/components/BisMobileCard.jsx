import React from 'react';
import { Smartphone, QrCode, Download, ShieldCheck } from 'lucide-react';

export default function BisMobileCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background Subtle Accent Graphic */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Info */}
        <div className="space-y-3 text-center md:text-left max-w-md">
          <div className="inline-flex items-center space-x-2 bg-slate-800 text-orange-400 px-3 py-1 rounded-full text-xs font-mono font-bold border border-slate-700">
            <Smartphone className="w-3.5 h-3.5" />
            <span>BIS CARE APP</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            BIS on Mobile
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Scan, Verify and Stay Informed anywhere, anytime. Download the official BIS Care app for instant ISI, Hallmark & Registration verification.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.bis.biscare"
              target="_blank"
              rel="noreferrer"
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-orange-600" />
              <span>Google Play Store</span>
            </a>

            <a
              href="https://apps.apple.com/in/app/bis-care/id1527789312"
              target="_blank"
              rel="noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-700 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>Apple App Store</span>
            </a>
          </div>
        </div>

        {/* Right QR Graphic Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center space-y-3 shrink-0 max-w-xs shadow-inner">
          <div className="w-24 h-24 bg-white rounded-xl p-2 mx-auto flex items-center justify-center shadow-md">
            <QrCode className="w-20 h-20 text-slate-900" />
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            <span className="text-white font-bold block">Scan QR Code</span>
            To install BIS Care App
          </div>
        </div>

      </div>
    </div>
  );
}
