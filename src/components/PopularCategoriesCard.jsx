import React from 'react';
import { Cpu, Zap, HardHat, ShieldAlert, Coffee, Car, Shirt, TestTube, Stethoscope, ShoppingBag, ArrowRight } from 'lucide-react';
import { t } from '../i18n/translations';

export default function PopularCategoriesCard({ onNavigate, onSelectCategory, currentLang }) {
  const categories = [
    { name: 'Electronics', icon: Cpu, color: 'text-blue-600 bg-blue-50' },
    { name: 'Electrical', icon: Zap, color: 'text-amber-600 bg-amber-50' },
    { name: 'Cement', icon: HardHat, color: 'text-stone-600 bg-stone-50' },
    { name: 'Steel', icon: ShieldAlert, color: 'text-slate-700 bg-slate-100' },
    { name: 'Food', icon: Coffee, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Automotive', icon: Car, color: 'text-purple-600 bg-purple-50' },
    { name: 'Textiles', icon: Shirt, color: 'text-rose-600 bg-rose-50' },
    { name: 'Chemicals', icon: TestTube, color: 'text-cyan-600 bg-cyan-50' },
    { name: 'Medical', icon: Stethoscope, color: 'text-teal-600 bg-teal-50' },
    { name: 'Consumer', icon: ShoppingBag, color: 'text-orange-600 bg-orange-50' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-extrabold text-slate-900 font-heading">
          {t('categories.title', currentLang)}
        </h3>
        <button
          onClick={() => onNavigate('standards')}
          className="text-xs font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
        >
          <span>{t('categories.viewAll', currentLang)}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                if (onSelectCategory) onSelectCategory(cat.name);
                onNavigate('standards');
              }}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-orange-300 hover:shadow-md transition-all text-center space-y-2 cursor-pointer group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto ${cat.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 block font-heading group-hover:text-orange-600 transition-colors">
                {t(`categories.${cat.name.toLowerCase()}`, currentLang) || cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
