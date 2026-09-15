import React from 'react';
import { ShieldCheck, Award, Building2, CheckCircle2, Globe, FileText, Users, Scale, Search, ArrowRight } from 'lucide-react';
import { t } from '../i18n/translations';

export default function AboutBis({ currentLang = 'en-IN', onNavigate }) {
  return (
    <div className="space-y-10 max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* 1. HERO BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-mono font-bold text-orange-400">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>{t('header.subtitle', currentLang)}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight">
            {t('about.title', currentLang)}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            {t('about.subtitle', currentLang)}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('/standards')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-orange-500/20 flex items-center space-x-2 cursor-pointer"
            >
              <span>{t('nav.standards', currentLang)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/verify')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3 rounded-xl border border-white/20 transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('nav.verify', currentLang)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATUTORY MANDATE & CORE OBJECTIVES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading">{t('about.statutoryMandate', currentLang)}</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {t('about.mandateText', currentLang)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading">{t('about.qualityAssurance', currentLang)}</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {t('about.pillar2Desc', currentLang)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading">{t('about.globalAlignment', currentLang)}</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {t('trust.standardizedDesc', currentLang)} - Global alignment with ISO & IEC standards.
          </p>
        </div>
      </div>

      {/* 3. SIX CORE PILLARS OF PRAMAAN AI */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div>
          <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider font-mono">Pramaan AI</span>
          <h2 className="text-2xl font-extrabold text-slate-900 font-heading mt-1">
            {t('about.pillarsTitle', currentLang)}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <FileText className="w-4 h-4 text-orange-500" />
              <span>{t('about.pillar1Title', currentLang)}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('about.pillar1Desc', currentLang)}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Award className="w-4 h-4 text-blue-500" />
              <span>{t('about.pillar2Title', currentLang)}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('about.pillar2Desc', currentLang)}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>{t('about.pillar3Title', currentLang)}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('about.pillar3Desc', currentLang)}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span>{t('about.pillar4Title', currentLang)}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('about.pillar4Desc', currentLang)}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>{t('consumer.title', currentLang)}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('consumer.subtitle', currentLang)}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Globe className="w-4 h-4 text-cyan-500" />
              <span>{t('industry.title', currentLang)}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('industry.subtitle', currentLang)}
            </p>
          </div>

        </div>
      </div>

      {/* 4. ORGANIZATIONAL STRUCTURE */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h3 className="text-xl font-bold font-heading">Pramaan AI Headquarters & Nationwide Network</h3>
            <p className="text-xs text-slate-400 mt-1">Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi - 110002</p>
          </div>
          <div className="flex items-center space-x-2 font-mono text-xs text-orange-400 font-bold bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700">
            <span>5 Regional Offices</span>
            <span>•</span>
            <span>38 Branch Offices</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
            <div className="text-xs font-bold text-orange-400 font-mono">Northern</div>
            <div className="text-sm font-extrabold">Chandigarh</div>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
            <div className="text-xs font-bold text-blue-400 font-mono">Southern</div>
            <div className="text-sm font-extrabold">Chennai</div>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
            <div className="text-xs font-bold text-emerald-400 font-mono">Eastern</div>
            <div className="text-sm font-extrabold">Kolkata</div>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
            <div className="text-xs font-bold text-amber-400 font-mono">Western</div>
            <div className="text-sm font-extrabold">Mumbai</div>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1 col-span-2 sm:col-span-1">
            <div className="text-xs font-bold text-purple-400 font-mono">Central</div>
            <div className="text-sm font-extrabold">Delhi / Sahibabad</div>
          </div>
        </div>
      </div>

    </div>
  );
}
