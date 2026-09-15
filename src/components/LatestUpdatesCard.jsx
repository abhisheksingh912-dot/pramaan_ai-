import React, { useState } from 'react';
import { Newspaper, ArrowRight, Calendar, X, ExternalLink } from 'lucide-react';
import { BIS_NEWS_ARTICLES } from '../data/bisNews';
import { t } from '../i18n/translations';

export default function LatestUpdatesCard({ onNavigate, currentLang = 'en-IN' }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const latestNews = BIS_NEWS_ARTICLES.slice(0, 3);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-orange-500" />
          <span>{t('updates.title', currentLang)}</span>
        </h3>
        <button
          onClick={() => onNavigate('news')}
          className="text-xs font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
        >
          <span>{t('updates.viewAll', currentLang)}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {latestNews.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedArticle(item)}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/50 border border-slate-100 hover:border-orange-200 transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="bg-slate-200 group-hover:bg-orange-100 group-hover:text-orange-900 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                {item.category}
              </span>
              <span className="text-slate-400 flex items-center gap-1 font-sans">
                <Calendar className="w-3 h-3 text-slate-400" />
                {item.date}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
              {item.title}
            </h4>
          </div>
        ))}
      </div>

      {/* News Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600">
                <Newspaper className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md uppercase">
                  {selectedArticle.category}
                </span>
                <p className="text-xs text-slate-400 font-mono mt-1">{t('updates.published', currentLang)}: {selectedArticle.date}</p>
              </div>
            </div>

            <div className="space-y-4 font-sans text-xs">
              <h3 className="text-sm font-extrabold text-slate-900 font-heading leading-snug">
                {selectedArticle.title}
              </h3>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 font-mono block uppercase font-bold">{t('updates.officialSource', currentLang)}</span>
                <span className="text-slate-900 font-semibold">{selectedArticle.source}</span>
              </div>

              <p className="text-slate-700 leading-relaxed font-medium">
                {selectedArticle.summary}
              </p>

              {selectedArticle.consumerRelevance && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-900">
                  <span className="text-[10px] font-mono block uppercase font-bold text-emerald-800">{t('updates.consumerImpact', currentLang)}</span>
                  <p className="text-emerald-800 leading-normal">{selectedArticle.consumerRelevance}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center space-x-1.5"
              >
                <span>{t('updates.readGazette', currentLang)}</span>
                <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
              </a>
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  onNavigate('news');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-xs"
              >
                {t('updates.viewPortal', currentLang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
