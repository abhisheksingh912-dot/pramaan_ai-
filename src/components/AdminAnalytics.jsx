import React, { useState } from 'react';
import { 
  BarChart3, AlertCircle, ShieldAlert, Users, Globe2, Activity, CheckCircle2, 
  MapPin, TrendingUp, Cpu, Sparkles, Filter, RefreshCw, ArrowUpRight, Search, Download
} from 'lucide-react';
import { t } from '../i18n/translations';

export default function AdminAnalytics({ currentLang = 'en-IN' }) {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Top Metrics
  const metrics = [
    {
      title: t('chartboard.queries', currentLang),
      value: "142,850",
      change: "+18.4% this month",
      trend: "up",
      color: "border-blue-200 bg-blue-50/50 text-blue-900",
      iconColor: "text-blue-600 bg-blue-100"
    },
    {
      title: t('chartboard.latency', currentLang),
      value: "320 ms",
      change: "Sub-second response",
      trend: "up",
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-900",
      iconColor: "text-emerald-600 bg-emerald-100"
    },
    {
      title: t('chartboard.seized', currentLang),
      value: "1,240",
      change: "BIS Nodal Enforcement",
      trend: "up",
      color: "border-amber-200 bg-amber-50/50 text-amber-900",
      iconColor: "text-amber-600 bg-amber-100"
    },
    {
      title: t('chartboard.accuracy', currentLang),
      value: "99.8%",
      change: "Zero Hallucination",
      trend: "up",
      color: "border-purple-200 bg-purple-50/50 text-purple-900",
      iconColor: "text-purple-600 bg-purple-100"
    }
  ];

  // Monthly Chart Data (Jan - Sep 2026)
  const monthlyData = [
    { month: 'Jan', queries: 82000, verified: 78000, flagged: 620 },
    { month: 'Feb', queries: 91000, verified: 86500, flagged: 710 },
    { month: 'Mar', queries: 104000, verified: 99000, flagged: 840 },
    { month: 'Apr', queries: 112000, verified: 106000, flagged: 920 },
    { month: 'May', queries: 125000, verified: 119000, flagged: 1010 },
    { month: 'Jun', queries: 131000, verified: 124500, flagged: 1100 },
    { month: 'Jul', queries: 138000, verified: 131200, flagged: 1180 },
    { month: 'Aug', queries: 140500, verified: 133800, flagged: 1210 },
    { month: 'Sep', queries: 142850, verified: 136100, flagged: 1240 }
  ];

  // State-Wise Telemetry Data
  const stateData = [
    { state: 'Maharashtra', queries: 24510, topCategory: 'Gold Hallmarking (IS 1417)', cmlActive: 4820, riskLevel: 'Low' },
    { state: 'Delhi NCR', queries: 21800, topCategory: 'Electronics CRS (IS 13252)', cmlActive: 3950, riskLevel: 'Medium' },
    { state: 'Tamil Nadu', queries: 18450, topCategory: 'Packaged Water (IS 14544)', cmlActive: 3210, riskLevel: 'Low' },
    { state: 'Gujarat', queries: 16200, topCategory: 'Chemicals & Cement (IS 269)', cmlActive: 2980, riskLevel: 'Low' },
    { state: 'Uttar Pradesh', queries: 14900, topCategory: 'Helmet Safety (IS 4151)', cmlActive: 2450, riskLevel: 'High' },
    { state: 'Karnataka', queries: 13800, topCategory: 'IT & Solar Modules (IS 16046)', cmlActive: 2190, riskLevel: 'Low' },
    { state: 'West Bengal', queries: 11200, topCategory: 'Steel Bars (IS 1786)', cmlActive: 1840, riskLevel: 'Medium' },
    { state: 'Rajasthan', queries: 9800, topCategory: 'Toys & Handicrafts (IS 9873)', cmlActive: 1420, riskLevel: 'Low' }
  ];

  // Category Distribution
  const categoryShare = [
    { name: 'Electronics CRS (IS 13252)', percentage: 34, color: 'bg-blue-600', count: '48,569 queries' },
    { name: 'Gold Hallmarking (IS 1417)', percentage: 28, color: 'bg-amber-500', count: '39,998 queries' },
    { name: 'Packaged Water (IS 14544)', percentage: 18, color: 'bg-cyan-500', count: '25,713 queries' },
    { name: 'Helmets & Auto (IS 4151)', percentage: 12, color: 'bg-orange-500', count: '17,142 queries' },
    { name: 'Steel & Construction (IS 1786)', percentage: 8, color: 'bg-emerald-600', count: '11,428 queries' }
  ];

  // Live Gemini AI Telemetry Logs
  const liveLogs = [
    { time: '10:04:12 AM', lang: 'Hindi (hi-IN)', query: 'क्या 6-अंक वाला HUID कोड बिना BIS ऐप के जांचा जा सकता है?', model: 'gemini-1.5-flash', status: '200 OK', lat: '290ms' },
    { time: '10:03:45 AM', lang: 'Marathi (mr-IN)', query: 'IS 14544 अंतर्गत पॅकेज्ड पिण्याचे पाणी परवाना कसा तपासायचा?', model: 'gemini-1.5-flash', status: '200 OK', lat: '310ms' },
    { time: '10:02:18 AM', lang: 'Tamil (ta-IN)', query: 'மின்சார பொம்மைகளுக்கான BIS IS 9873 விதிமுறைகள் என்ன?', model: 'gemini-2.0-flash', status: '200 OK', lat: '340ms' },
    { time: '10:01:05 AM', lang: 'English (en-IN)', query: 'Verify BIS CM/L license CM/L-8765432 expiry date and lab report', model: 'gemini-1.5-flash', status: '200 OK', lat: '260ms' }
  ];

  const maxQueryVal = Math.max(...monthlyData.map(d => d.queries));

  const filteredStates = stateData.filter(s => 
    s.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.topCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in max-w-7xl mx-auto">
      
      {/* 1. TOP HEADER BOARD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/50 via-orange-100/30 to-transparent rounded-bl-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white flex items-center justify-center shadow-md shrink-0">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono border border-blue-200">
                  {t('chartboard.nationalTelemetry', currentLang)}
                </span>
                <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                  {t('chartboard.geminiNode', currentLang)}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-1">
                {t('chartboard.title', currentLang)}
              </h2>
              <p className="text-xs text-slate-600">
                {t('chartboard.subtitle', currentLang)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Year 2026</option>
            </select>

            <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer">
              <Download className="w-3.5 h-3.5 text-orange-400" />
              <span>{t('chartboard.exportPdf', currentLang)}</span>
            </button>
          </div>
        </div>

        {/* 2. TOP METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border ${m.color} shadow-2xs transition-all hover:shadow-md`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{m.title}</span>
                <div className={`p-2 rounded-xl ${m.iconColor}`}>
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">{m.value}</div>
              <div className="text-[11px] font-medium text-slate-600 mt-1 flex items-center gap-1">
                <span className="font-semibold">{m.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CHARTS SECTION (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Verification & AI Volume Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Monthly Verification Query Growth (2026)
              </h3>
              <p className="text-[11px] text-slate-500">Volume of product verifications and Gemini AI query interactions</p>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-3 h-3 rounded bg-blue-900 inline-block"></span> Verified
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-3 h-3 rounded bg-orange-500 inline-block"></span> Flagged
              </span>
            </div>
          </div>

          {/* SVG Interactive Bar Graph */}
          <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100">
            {monthlyData.map((d, i) => {
              const heightPct = (d.queries / maxQueryVal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-900 text-white text-[10px] p-2 rounded-xl shadow-xl z-20 pointer-events-none whitespace-nowrap font-mono">
                    <div className="font-bold">{d.month} 2026</div>
                    <div>Queries: {d.queries.toLocaleString()}</div>
                    <div className="text-orange-400">Flagged: {d.flagged}</div>
                  </div>

                  <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    {/* Flagged portion */}
                    <div
                      style={{ height: `${(d.flagged / d.queries) * heightPct * 4}%` }}
                      className="bg-orange-500 w-full transition-all group-hover:bg-orange-600"
                    ></div>
                    {/* Verified portion */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="bg-blue-900 w-full transition-all group-hover:bg-blue-800"
                    ></div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-600 mt-2 font-bold">{d.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-mono">
            <span>Source: BIS Care App & Portal Gateway</span>
            <span className="font-bold text-blue-900">Total Volume: 1,029,350 Scans</span>
          </div>
        </div>

        {/* Category Share Progress Meters (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-500" />
              {t('chartboard.categoryShare', currentLang)}
            </h3>
            <p className="text-[11px] text-slate-500">Breakdown of product standards searched by citizens & industry</p>
          </div>

          <div className="space-y-4 pt-2">
            {categoryShare.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 font-mono truncate max-w-[220px]">{cat.name}</span>
                  <span className="text-slate-900 font-bold font-mono">{cat.percentage}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${cat.color}`}
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono text-right">{cat.count}</div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-900 font-medium leading-relaxed">
            💡 <strong>Insight:</strong> Electronics & CRS mandatory registrations (IS 13252) continue to account for the largest share of national verification queries.
          </div>
        </div>

      </div>

      {/* 4. STATE-WISE TELEMETRY & ENFORCEMENT MONITOR TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-blue-600" />
              {t('chartboard.stateTelemetry', currentLang)}
            </h3>
            <p className="text-xs text-slate-500">Live region-wise query volume, active CM/L licenses, and risk alerts</p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('chartboard.filterPlaceholder', currentLang)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-500 border-b border-slate-200 text-[10px] uppercase bg-slate-50">
                <th className="p-3 rounded-l-xl">State / UT</th>
                <th className="p-3">Monthly Query Volume</th>
                <th className="p-3">Top Searched Category</th>
                <th className="p-3">Active CM/L Licenses</th>
                <th className="p-3">Risk Assessment</th>
                <th className="p-3 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStates.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    {row.state}
                  </td>
                  <td className="p-3 font-bold text-slate-800">{row.queries.toLocaleString()}</td>
                  <td className="p-3 text-blue-900 font-semibold">{row.topCategory}</td>
                  <td className="p-3 text-slate-700">{row.cmlActive.toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.riskLevel === 'High'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : row.riskLevel === 'Medium'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {row.riskLevel} Risk
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer">
                      {t('chartboard.inspectNode', currentLang)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. LIVE GEMINI AI TELEMETRY STREAM */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-slate-100">
                {t('chartboard.telemetryFeed', currentLang)}
              </h3>
              <p className="text-[11px] text-slate-400">Real-time incoming voice & text queries powered by Gemini 1.5/2.0 AI</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2.5 py-1 rounded-full border border-purple-800">
            API Key: Validated
          </span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {liveLogs.map((log, idx) => (
            <div key={idx} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="text-[10px] text-slate-500">{log.time}</span>
                <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-800/60 px-2 py-0.5 rounded font-bold">
                  {log.lang}
                </span>
                <span className="text-slate-200 truncate max-w-xs sm:max-w-md">{log.query}</span>
              </div>
              <div className="flex items-center space-x-3 text-[10px]">
                <span className="text-purple-400">{log.model}</span>
                <span className="text-emerald-400 font-bold">{log.status}</span>
                <span className="text-slate-400">{log.lat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
