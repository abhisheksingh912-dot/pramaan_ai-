import React from 'react';
import { BookOpen, Building2, FlaskConical, CheckCircle2 } from 'lucide-react';
import { t } from '../i18n/translations';

export default function StatisticsCard({ currentLang }) {
  const stats = [
    { label: t('stats.standards', currentLang), value: '21,000+', icon: BookOpen, accent: 'text-orange-500' },
    { label: t('stats.manufacturers', currentLang), value: '5,000+', icon: Building2, accent: 'text-blue-500' },
    { label: t('stats.labs', currentLang), value: '45+', icon: FlaskConical, accent: 'text-purple-500' },
    { label: t('stats.verified', currentLang), value: '10M+', icon: CheckCircle2, accent: 'text-emerald-500' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`space-y-2 text-center ${idx > 0 ? 'pt-4 md:pt-0 md:pl-6' : ''}`}>
              <div className="flex items-center justify-center space-x-2">
                <Icon className={`w-5 h-5 ${stat.accent}`} />
                <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
                  {stat.value}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium font-heading">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
