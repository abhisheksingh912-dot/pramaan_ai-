import React from 'react';
import { Sparkles } from 'lucide-react';
import StatisticsCard from './StatisticsCard';
import { t } from '../i18n/translations';

export default function HeroSection({ currentLang }) {
  return (
    <div className="space-y-8 pt-4">
      {/* Main Hero Card Container */}
      <div className="bg-gradient-to-b from-blue-50/70 via-indigo-50/40 to-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm relative overflow-hidden">
        
        {/* Subtle Decorative Tri-color Background Blur */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-r from-orange-300/20 via-white/40 to-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Tagline Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/90 border border-slate-200 shadow-xs px-4 py-1.5 rounded-full text-xs font-mono font-bold text-slate-700 mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>{t('hero.tagline', currentLang)}</span>
        </div>

        {/* Main Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 font-heading tracking-tight leading-tight max-w-4xl mx-auto">
          {t('hero.title', currentLang)}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle', currentLang)}
        </p>

        {/* Indian Tricolor Accent Line */}
        <div className="w-40 h-1.5 mx-auto tricolor-accent rounded-full shadow-xs"></div>

        {/* Embedded Live Statistics Banner */}
        <div className="pt-4 max-w-5xl mx-auto">
          <StatisticsCard currentLang={currentLang} />
        </div>

      </div>
    </div>
  );
}
