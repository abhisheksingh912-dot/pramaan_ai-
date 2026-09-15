import React, { useState } from 'react';
import { BookOpen, Search, Filter, ShieldCheck, CheckCircle2, Sparkles, Download, X, Globe2 } from 'lucide-react';
import { INDIAN_STANDARDS } from '../data/bisDatabase';
import { t } from '../i18n/translations';

export default function StandardsExplorer({ currentLang = 'en-IN' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStandard, setSelectedStandard] = useState(INDIAN_STANDARDS[0]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAiModal, setShowAiModal] = useState(false);
  const [explainLang, setExplainLang] = useState('en'); // 'en' or 'hi'

  const categories = ['ALL', 'Food & Beverages', 'Electronics & IT', 'Hallmarking & Precious Metals', 'Consumer Toys & Child Safety', 'Automotive Safety', 'Civil Engineering & Construction'];

  const filteredStandards = INDIAN_STANDARDS.filter((std) => {
    const matchesSearch =
      std.isCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || std.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#D4DEE9] shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#D4DEE9]">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
            <BookOpen className="w-5 h-5 text-[#FF9933]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0B2345]">
              {t('standards.title', currentLang)}
            </h2>
            <p className="text-xs text-[#607087]">
              {t('standards.subtitle', currentLang)}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAiModal(true)}
          className="bg-[#0B2345] hover:bg-[#1565C0] text-white font-bold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center space-x-2 text-xs cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#FF9933]" />
          <span>{t('common.learnMore', currentLang)}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-[#607087] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('standards.searchPlaceholder', currentLang)}
            className="w-full bg-[#F7FAFD] border border-[#D4DEE9] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#0B2345] placeholder-[#607087] focus:outline-none focus:border-[#1565C0]"
          />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#F7FAFD] border border-[#D4DEE9] rounded-xl px-3 py-2.5 text-xs text-[#0B2345] focus:outline-none focus:border-[#1565C0] cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? t('common.all', currentLang) : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Master Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List Column */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {filteredStandards.map((std) => {
            const isSelected = selectedStandard.isCode === std.isCode;
            return (
              <div
                key={std.isCode}
                onClick={() => setSelectedStandard(std)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 border-[#1565C0] ring-1 ring-[#1565C0]/40 text-[#0B2345]'
                    : 'bg-white border-[#D4DEE9] text-[#607087] hover:bg-slate-50 hover:text-[#0B2345]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold font-mono text-[#D97706]">
                    {std.isCode}
                  </span>
                  <span className="text-[10px] bg-[#E8F5E9] text-[#138808] px-2 py-0.5 rounded border border-[#A5D6A7] font-semibold">
                    {std.mandateStatus}
                  </span>
                </div>
                <h4 className="text-xs font-semibold line-clamp-1 text-[#0B2345]">
                  {std.title}
                </h4>
                <p className="text-[11px] text-[#607087] mt-1 line-clamp-2">
                  {std.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 bg-[#F7FAFD] border border-[#D4DEE9] rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#D4DEE9]">
              <div>
                <span className="text-[10px] text-[#607087] uppercase font-mono">
                  {selectedStandard.category} • {selectedStandard.ministry}
                </span>
                <h3 className="text-sm font-bold text-[#1565C0] font-mono">
                  {selectedStandard.isCode}
                </h3>
              </div>
              <span className="text-xs font-mono text-[#138808] bg-[#E8F5E9] px-2.5 py-1 rounded border border-[#A5D6A7] font-bold">
                {selectedStandard.mandateStatus}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#0B2345] mb-1">
                {selectedStandard.title}
              </h4>
              <p className="text-xs text-[#607087] leading-relaxed">
                {selectedStandard.description}
              </p>
            </div>

            {/* Key Clauses List */}
            <div>
              <span className="text-xs text-[#607087] font-medium block mb-2 font-mono">
                📑 {t('standards.committee', currentLang)}: {selectedStandard.committee || 'BIS Technical Panel'}
              </span>
              <div className="space-y-2">
                {selectedStandard.keyClauses.map((clause, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-[#D4DEE9] text-xs">
                    <span className="text-[#1565C0] font-mono font-bold mr-2">{clause.clause}:</span>
                    <span className="text-[#0B2345] font-semibold">{clause.title}</span>
                    <p className="text-[#607087] text-[11px] mt-0.5">{clause.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Consumer Guidance Tip */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#FF9933] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Consumer Verification Guidance:</span>
                <span>{selectedStandard.consumerTip}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#D4DEE9] flex items-center justify-between">
            <span className="text-[11px] text-[#607087] font-mono">
              Source: Pramaan AI Official Gazette
            </span>
            <button
              onClick={() => alert(`Downloading specification summary for ${selectedStandard.isCode}...`)}
              className="text-xs bg-[#0B2345] hover:bg-[#1565C0] text-white px-3 py-1.5 rounded-lg border border-[#0B2345] transition-all flex items-center gap-1.5 font-mono cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#FF9933]" /> {t('standards.downloadPdf', currentLang)}
            </button>
          </div>
        </div>
      </div>

      {/* AI Plain Language Explanation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-[#D4DEE9] rounded-2xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4DEE9]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#FF9933]" />
                <h3 className="text-sm font-bold text-[#0B2345] font-mono">
                  AI Simplified Explanation: {selectedStandard.isCode}
                </h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="p-1 rounded bg-slate-100 text-[#607087] hover:text-[#0B2345] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex space-x-2 text-xs font-mono">
              <button
                onClick={() => setExplainLang('en')}
                className={`px-3 py-1 rounded border cursor-pointer ${explainLang === 'en' ? 'bg-[#0B2345] text-white font-bold' : 'bg-slate-100 text-[#607087]'}`}
              >
                Simple English
              </button>
              <button
                onClick={() => setExplainLang('hi')}
                className={`px-3 py-1 rounded border cursor-pointer ${explainLang === 'hi' ? 'bg-[#0B2345] text-white font-bold' : 'bg-slate-100 text-[#607087]'}`}
              >
                सरल हिंदी (Hindi)
              </button>
            </div>

            <div className="bg-[#F7FAFD] p-4 rounded-xl border border-[#D4DEE9] text-xs leading-relaxed space-y-2">
              {explainLang === 'en' ? (
                <>
                  <p className="font-bold text-[#1565C0]">What does this standard mean for everyday consumers?</p>
                  <ul className="space-y-1 text-[#607087]">
                    <li>• <strong>Consumer Meaning:</strong> Products under {selectedStandard.isCode} ({selectedStandard.title}) MUST undergo strict laboratory quality checks before sale in India.</li>
                    <li>• <strong>Safety Rule:</strong> Manufacturers cannot sell this product without printing a valid 7-digit CM/L license code under the ISI logo.</li>
                    <li>• <strong>Industry Action:</strong> Factories must maintain calibrated testing machines and issue certificates for every production batch.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="font-bold text-[#1565C0]">आम उपभोक्ताओं के लिए इस मानक का क्या अर्थ है?</p>
                  <ul className="space-y-1 text-[#607087]">
                    <li>• <strong>उपभोक्ता अर्थ:</strong> {selectedStandard.isCode} के तहत आने वाले उत्पादों की भारत में बिक्री से पहले प्रयोगशाला में सख्त जांच अनिवार्य है।</li>
                    <li>• <strong>सुरक्षा नियम:</strong> निर्माता ISI लोगो के नीचे 7-अंकों का लाइसेंस नंबर छापे बिना इस उत्पाद को नहीं बेच सकते।</li>
                    <li>• <strong>उद्योग नियम:</strong> कारखानों को हर बैच के लिए परीक्षण मशीनें और गुणवत्ता रिपोर्ट बनाए रखनी होगी।</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
