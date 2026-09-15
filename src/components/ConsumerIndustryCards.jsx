import React from 'react';
import { ShoppingBag, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { t } from '../i18n/translations';

export default function ConsumerIndustryCards({ onNavigate, currentLang, onSelectRole, userProfile }) {

  const handleConsumerClick = () => {
    if (userProfile?.role === 'consumer') {
      onNavigate('verify');
    } else if (onSelectRole) {
      onSelectRole('consumer');
    } else {
      onNavigate('verify');
    }
  };

  const handleIndustryClick = () => {
    if (userProfile?.role === 'business') {
      onNavigate('industry');
    } else if (onSelectRole) {
      onSelectRole('business');
    } else {
      onNavigate('industry');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto items-stretch relative">
      
      {/* 1. FOR CONSUMERS CARD */}
      <div className="bg-gradient-to-br from-orange-50/90 via-white to-amber-50/60 border-2 border-orange-200/90 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6 hover:shadow-xl hover:border-orange-400 transition-all relative overflow-hidden group">
        
        {/* Dim light background watermark of Pramaan AI logo */}
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
          <img 
            src="/pramaan-logo.jpg" 
            onError={(e) => { e.currentTarget.src = '/pramaan-ai-logo.jpg'; }}
            alt="Pramaan AI Watermark" 
            className="w-64 h-64 object-contain filter grayscale"
          />
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-extrabold text-orange-800 bg-orange-100 border border-orange-300 px-3 py-1 rounded-full uppercase tracking-wider">
              {t('consumer.badge', currentLang)}
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
              {t('consumer.title', currentLang)}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
              {t('consumer.subtitle', currentLang)}
            </p>
          </div>

          <ul className="space-y-2.5 pt-2 text-xs text-slate-700 font-medium">
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span>{t('consumer.f1', currentLang)}</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span>{t('consumer.f2', currentLang)}</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span>{t('consumer.f3', currentLang)}</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span>{t('consumer.f4', currentLang)}</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleConsumerClick}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md flex items-center justify-between cursor-pointer group-hover:shadow-lg font-heading relative z-10"
        >
          <span>{t('consumer.btn', currentLang)}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. FOR INDUSTRY CARD */}
      <div className="bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/60 border-2 border-blue-200/90 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6 hover:shadow-xl hover:border-blue-400 transition-all relative overflow-hidden group">
        
        {/* Dim light background watermark of Pramaan AI logo */}
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
          <img 
            src="/pramaan-logo.jpg" 
            onError={(e) => { e.currentTarget.src = '/pramaan-ai-logo.jpg'; }}
            alt="Pramaan AI Watermark" 
            className="w-64 h-64 object-contain filter grayscale"
          />
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-extrabold text-blue-800 bg-blue-100 border border-blue-300 px-3 py-1 rounded-full uppercase tracking-wider">
              {t('industry.badge', currentLang)}
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
              {t('industry.title', currentLang)}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
              {t('industry.subtitle', currentLang)}
            </p>
          </div>

          <ul className="space-y-2.5 pt-2 text-xs text-slate-700 font-medium">
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{t('industry.f1', currentLang)}</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{t('industry.f2', currentLang)}</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{t('industry.f3', currentLang)}</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{t('industry.f4', currentLang)}</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleIndustryClick}
          className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md flex items-center justify-between cursor-pointer group-hover:bg-blue-600 font-heading relative z-10"
        >
          <span>{t('industry.btn', currentLang)}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
