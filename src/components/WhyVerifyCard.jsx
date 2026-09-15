import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Award, Sparkles, ArrowRight, X, Info } from 'lucide-react';
import { t } from '../i18n/translations';

export default function WhyVerifyCard({ currentLang = 'en-IN' }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState(null);

  const benefits = [
    {
      title: t('whyVerify.card1Title', currentLang),
      desc: t('whyVerify.card1Desc', currentLang),
      fullDesc: t('whyVerify.card1Desc', currentLang),
      icon: ShieldAlert,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      title: t('whyVerify.card2Title', currentLang),
      desc: t('whyVerify.card2Desc', currentLang),
      fullDesc: t('whyVerify.card2Desc', currentLang),
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      title: t('whyVerify.card3Title', currentLang),
      desc: t('whyVerify.card3Desc', currentLang),
      fullDesc: t('whyVerify.card3Desc', currentLang),
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      title: t('whyVerify.card4Title', currentLang),
      desc: t('whyVerify.card4Desc', currentLang),
      fullDesc: t('whyVerify.card4Desc', currentLang),
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 border-purple-100'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-orange-500" />
          <span>{t('whyVerify.title', currentLang)}</span>
        </h3>
        <button
          onClick={() => setShowModal(true)}
          className="text-xs font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
        >
          <span>{t('whyVerify.viewAll', currentLang)}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {benefits.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedBenefit(item);
                setShowModal(true);
              }}
              className="p-4 rounded-2xl bg-slate-50/70 hover:bg-orange-50/40 border border-slate-100 hover:border-orange-200 space-y-2 transition-all cursor-pointer group"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${item.color} group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 font-heading group-hover:text-orange-600 transition-colors">{item.title}</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Why Verify Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-heading">{t('whyVerify.modalTitle', currentLang)}</h3>
                <p className="text-xs text-slate-500 font-medium">{t('whyVerify.modalSubtitle', currentLang)}</p>
              </div>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {benefits.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg border ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 font-heading">{item.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{item.fullDesc}</p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer text-xs font-heading"
            >
              {t('whyVerify.close', currentLang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
