import React from 'react';
import { ShieldCheck, FlaskConical, BookOpen, Building2, BarChart3, ArrowRight } from 'lucide-react';
import { t } from '../i18n/translations';

export default function QuickActionsCard({ onNavigate, currentLang }) {
  const actions = [
    { title: t('quickActions.verify', currentLang), icon: ShieldCheck, route: 'verify', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { title: t('quickActions.labs', currentLang), icon: FlaskConical, route: 'labs', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { title: t('quickActions.standards', currentLang), icon: BookOpen, route: 'standards', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { title: t('quickActions.msme', currentLang), icon: Building2, route: 'industry', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { title: t('quickActions.chartboard', currentLang), icon: BarChart3, route: 'chartboard', color: 'text-amber-600 bg-amber-50 border-amber-200' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-extrabold text-slate-900 font-heading">
          {t('quickActions.title', currentLang)}
        </h3>
        <span className="text-[11px] font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
          {t('quickActions.badge', currentLang)}
        </span>
      </div>

      <div className="space-y-2.5">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(act.route)}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl border ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 font-heading group-hover:text-orange-600 transition-colors">
                  {act.title}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
