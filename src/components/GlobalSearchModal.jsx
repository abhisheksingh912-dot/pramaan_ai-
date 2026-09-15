import React, { useState } from 'react';
import { Search, ArrowRight, BookOpen, ShieldCheck, Eye, MapPin, Newspaper, AlertOctagon, X, Sparkles } from 'lucide-react';
import { t } from '../i18n/translations';

export default function GlobalSearchModal({ isOpen, onClose, onNavigateTab, currentLang = 'en-IN' }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const quickNavSuggestions = [
    { query: 'Packaged Drinking Water IS 14544', targetTab: 'standards', category: 'IS Standard', icon: BookOpen },
    { query: 'Verify License CM/L-8765432', targetTab: 'verify', category: 'Certificate Verification', icon: ShieldCheck },
    { query: 'Scan Motorcycle Helmet Safety', targetTab: 'verify', category: 'AI Vision Scanner', icon: Eye },
    { query: 'Find BIS Labs in Delhi / Mumbai', targetTab: 'labs', category: 'Lab Finder', icon: MapPin },
    { query: 'Report Fake ISI Mark Complaint', targetTab: 'complaints', category: 'Grievances', icon: AlertOctagon },
    { query: 'EV Battery QCO Regulations', targetTab: 'news', category: 'Gazette News', icon: Newspaper }
  ];

  const handleSelect = (targetTab) => {
    onNavigateTab(targetTab);
    onClose();
  };

  const filtered = quickNavSuggestions.filter((s) =>
    s.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4 p-4">
        {/* Header Search Bar */}
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('modals.searchPlaceholder', currentLang)}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Intelligent Auto-Routing Suggestions */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          <span className="text-[10px] text-slate-400 font-mono uppercase block px-1">
            {t('modals.routingTitle', currentLang)}
          </span>

          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => handleSelect(item.targetTab)}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/60 hover:bg-slate-950 cursor-pointer flex items-center justify-between transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-slate-900 text-amber-400 border border-slate-800">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                      {item.query}
                    </h4>
                    <span className="text-[10px] font-mono text-cyan-400">{item.category}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
