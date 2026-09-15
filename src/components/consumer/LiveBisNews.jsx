import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, ExternalLink, Tag, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { bisApiService } from '../../services/apiService';
import { t } from '../../i18n/translations';

export default function LiveBisNews({ currentLang = 'en-IN' }) {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      const data = await bisApiService.fetchNews();
      setNews(data);
      setIsLoading(false);
    }
    loadNews();
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <Newspaper className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              {t('news.title', currentLang)}
              <span className="text-[10px] font-mono bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-800/40">
                Cached Feed API
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {t('news.subtitle', currentLang)}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-800">
          GET /api/news (Source Attributed)
        </span>
      </div>

      {/* News Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-amber-400 font-mono flex items-center justify-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Fetching latest Gazette updates...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {item.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-100 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Source: <strong className="text-slate-200">{item.source}</strong></span>
                  <span className="text-cyan-400">{item.industryAffected}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-emerald-400 truncate max-w-[240px]">
                    💡 {item.consumerRelevance}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 shrink-0"
                  >
                    Read Gazette <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
