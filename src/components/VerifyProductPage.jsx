import React from 'react';
import ScanMarkCard from './ScanMarkCard';
import RecentScanHistory from './RecentScanHistory';
import WhyVerifyCard from './WhyVerifyCard';
import QuickActionsCard from './QuickActionsCard';
import { t } from '../i18n/translations';

export default function VerifyProductPage({ currentLang = 'en-IN', lastScan, onSearchResult, onOpenVoiceAgent, onSelectScan, onNavigate }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <span className="text-[11px] font-bold text-orange-600 uppercase font-mono tracking-wider">{t('nav.verify', currentLang)}</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {t('verify.title', currentLang)}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
            {t('verify.subtitle', currentLang)}
          </p>
        </div>
      </div>

      {/* Main Scanner Tool */}
      <ScanMarkCard
        currentLang={currentLang}
        onSearchResult={onSearchResult}
      />

      {/* Verification History, Why Verify & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <RecentScanHistory
            currentLang={currentLang}
            lastScan={lastScan}
            onSelectScan={onSelectScan}
          />
        </div>
        <div className="lg:col-span-4">
          <WhyVerifyCard currentLang={currentLang} />
        </div>
        <div className="lg:col-span-3">
          <QuickActionsCard onNavigate={onNavigate} currentLang={currentLang} />
        </div>
      </div>

    </div>
  );
}
