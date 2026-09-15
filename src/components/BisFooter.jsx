import React from 'react';
import { ShieldCheck, Globe, Twitter, Facebook, Linkedin, Youtube, Instagram, Award } from 'lucide-react';
import { t } from '../i18n/translations';

export default function BisFooter({ onNavigate, currentLang }) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          
          {/* Column 1: Brand & BIS Emblem */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 p-0.5 border border-slate-700 shadow-md shrink-0 overflow-hidden">
                <img
                  src="/pramaan-logo.jpg"
                  onError={(e) => { e.target.src = '/pramaan-ai-logo.jpg'; }}
                  alt="Pramaan AI Official Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="text-[10px] font-bold text-orange-400 font-mono">{t('header.hindiTitle', currentLang)}</div>
                <h3 className="text-sm font-extrabold text-white font-heading">
                  {t('footer.title', currentLang)}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
                  {t('header.subtitle', currentLang)}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
              {t('footer.slogan', currentLang)}. Committed to quality, safety, and consumer empowerment across India under the Ministry of Consumer Affairs, Food & Public Distribution.
            </p>

            {/* Social Connected Icons */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase font-mono block">{t('footer.connected', currentLang)}</span>
              <div className="flex items-center space-x-2.5">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white transition-colors" title="X / Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white transition-colors" title="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white transition-colors" title="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white transition-colors" title="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">{t('footer.quickLinks', currentLang)}</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  {t('nav.home', currentLang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  {t('nav.about', currentLang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('standards')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  {t('nav.standards', currentLang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('verify')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  {t('nav.verify', currentLang)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('labs')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  {t('nav.labs', currentLang)}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Consumer Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">{t('footer.consumer', currentLang)}</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('verify')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Consumer Guidance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('complaints')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  File a Complaint
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('standards')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Product Safety
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('news')} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Awareness & Education
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Industry Services & Right Logo Branding */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">{t('footer.industry', currentLang)}</h4>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <button onClick={() => onNavigate('industry')} className="hover:text-orange-400 transition-colors cursor-pointer">
                    Certification Process
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('labs')} className="hover:text-orange-400 transition-colors cursor-pointer">
                    Testing Labs
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('industry')} className="hover:text-orange-400 transition-colors cursor-pointer">
                    MSME Support
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('standards')} className="hover:text-orange-400 transition-colors cursor-pointer">
                    Industry Resources
                  </button>
                </li>
              </ul>
            </div>

            {/* Right Side Uploaded Logo Asset & Viksit Bharat Motto */}
            <div className="pt-2 space-y-1.5 border-t border-slate-800">
              <div className="flex items-center gap-3 p-2 px-3 rounded-xl bg-slate-900 border border-slate-700/80 shadow-md inline-flex">
                <img
                  src="/pramaan-logo.jpg"
                  onError={(e) => { e.currentTarget.src = '/pramaan-ai-logo.jpg'; }}
                  alt="Pramaan AI Logo"
                  className="h-10 w-auto object-cover rounded-lg"
                />
                <span className="text-base sm:text-lg font-black text-white font-heading tracking-wide">
                  Pramaan AI
                </span>
              </div>
              <div className="text-[11px] font-bold text-orange-400 font-mono tracking-wide flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-orange-500" />
                <span>{t('footer.motto', currentLang)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Policy Links Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
          <div>
            © Pramaan AI. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center space-x-4">
            <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors cursor-pointer">Terms of Use</button>
            <span>•</span>
            <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => onNavigate('accessibility')} className="hover:text-white transition-colors cursor-pointer">Accessibility</button>
            <span>•</span>
            <button onClick={() => onNavigate('sitemap')} className="hover:text-white transition-colors cursor-pointer">Sitemap</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
