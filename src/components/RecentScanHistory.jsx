import React, { useState, useEffect } from 'react';
import { History, Bookmark, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { t } from '../i18n/translations';

export default function RecentScanHistory({ lastScan, onSelectScan, currentLang }) {
  const [historyItems, setHistoryItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bis_recent_scans');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: '1', query: 'IS 14544', code: 'IS 14544', type: 'IS Code', status: 'Authentic', timestamp: '2 hours ago', bookmarked: true },
      { id: '2', query: 'HUID-XY8921', code: 'HUID-XY8921', type: 'HUID', status: 'Authentic', timestamp: 'Yesterday', bookmarked: false },
      { id: '3', query: 'CM/L-8765432', code: 'CM/L-8765432', type: 'CM/L Number', status: 'Authentic', timestamp: '3 days ago', bookmarked: false }
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bis_recent_scans', JSON.stringify(historyItems));
    } catch (e) {}
  }, [historyItems]);

  // Handle newly completed scan from parent
  useEffect(() => {
    if (lastScan && lastScan.query) {
      setHistoryItems((prev) => {
        const filtered = prev.filter((item) => item.query.toLowerCase() !== lastScan.query.toLowerCase());
        const newItem = {
          id: Date.now().toString(),
          query: lastScan.query,
          code: lastScan.code || lastScan.query,
          type: lastScan.type || 'Search',
          status: lastScan.status || 'Authentic',
          timestamp: 'Just now',
          bookmarked: false,
          fullData: lastScan.fullData
        };
        return [newItem, ...filtered];
      });
    }
  }, [lastScan]);

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setHistoryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, bookmarked: !item.bookmarked } : item))
    );
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your recent scan history?')) {
      setHistoryItems((prev) => prev.filter((item) => item.bookmarked));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-base font-heading">
          <History className="w-5 h-5 text-orange-500" />
          <h2>{t('history.title', currentLang)}</h2>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-xs font-mono font-bold text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('history.clearAll', currentLang)}</span>
          </button>
        )}
      </div>

      {/* History Items List */}
      {historyItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 font-medium">
          {t('history.empty', currentLang)}
        </div>
      ) : (
        <div className="space-y-2.5">
          {historyItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectScan(item.query)}
              className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center space-x-3 font-mono text-xs">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 font-bold text-slate-900">
                    <span>{item.code}</span>
                    <span className="text-slate-400 font-normal">|</span>
                    <span className="text-slate-500 font-normal">{item.type}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans flex items-center space-x-2 mt-0.5">
                    <span>{item.timestamp}</span>
                    <span>•</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      item.status === 'Authentic' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => toggleBookmark(item.id, e)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  item.bookmarked
                    ? 'text-orange-500 bg-orange-50'
                    : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                }`}
                title={item.bookmarked ? 'Bookmarked' : 'Bookmark item'}
              >
                <Bookmark className={`w-4 h-4 ${item.bookmarked ? 'fill-orange-500' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
