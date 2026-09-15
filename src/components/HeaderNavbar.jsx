import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, ChevronDown, Menu, X, ShieldCheck, UserCheck, Check, Building2, ShoppingBag, LogOut, RefreshCw } from 'lucide-react';
import { ALL_INDIAN_LANGUAGES, t } from '../i18n/translations';

export default function HeaderNavbar({ 
  currentLang, 
  setCurrentLang, 
  currentRoute = '/', 
  onNavigate, 
  onOpenSearch, 
  onOpenAuth,
  userProfile,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langSearchQuery, setLangSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  // Filter navigation links based on user profile (Consumer vs Business)
  const baseNavLinks = [
    { name: t('nav.home', currentLang), key: 'home', route: '/', rawName: 'Home' },
    { name: t('nav.about', currentLang), key: 'about', route: '/about', rawName: 'About BIS' },
    { name: t('nav.standards', currentLang), key: 'standards', route: '/standards', rawName: 'Standards' },
    { name: t('nav.verify', currentLang), key: 'verify', route: '/verify', rawName: 'Verify a Product' },
    { name: t('nav.labs', currentLang), key: 'labs', route: '/labs', rawName: 'BIS Labs' },
  ];

  // Business users get the Industry Gateway and Chart Board links (Industry/Business only)
  if (userProfile?.role === 'business') {
    baseNavLinks.push({ 
      name: t('nav.industry', currentLang) || 'Industry Licensing', 
      key: 'industry', 
      route: '/industry', 
      rawName: 'Industry Portal' 
    });
    baseNavLinks.push({ 
      name: t('nav.chartboard', currentLang) || 'Chart Board', 
      key: 'chartboard', 
      route: '/chartboard', 
      rawName: 'Chart Board' 
    });
  }

  const navLinks = baseNavLinks;

  const normalizeRoute = (r) => {
    if (!r || r === '/' || r === 'home') return '/';
    if (r.startsWith('/')) return r;
    return `/${r}`;
  };

  const normalizedCurrent = normalizeRoute(currentRoute);

  const handleNavClick = (link) => {
    onNavigate(link.route || link.key);
  };

  const selectedLangObj = ALL_INDIAN_LANGUAGES.find((l) => l.code === currentLang) || ALL_INDIAN_LANGUAGES[0];

  // Close dropdowns on ESC key or click outside
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLangDropdownOpen(false);
        setProfileDropdownOpen(false);
      }
    };
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredLanguages = ALL_INDIAN_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(langSearchQuery.toLowerCase()) ||
      lang.native.toLowerCase().includes(langSearchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(langSearchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LEFT SIDE: BIS Branding & Uploaded "Standards Empower India" Logo */}
          <div 
            onClick={() => handleNavClick({ route: '/' })} 
            className="flex items-center space-x-3 sm:space-x-4 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-white p-0.5 border border-slate-200 shadow-md shrink-0 overflow-hidden group-hover:scale-105 transition-transform flex items-center justify-center">
              <img
                src="/pramaan-logo.jpg"
                onError={(e) => { e.target.src = '/pramaan-ai-logo.jpg'; }}
                alt="Pramaan AI Official Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-[11px] font-bold text-slate-500 tracking-wide font-mono leading-none">
                {t('header.hindiTitle', currentLang)}
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading leading-tight group-hover:text-orange-600 transition-colors">
                {t('header.engTitle', currentLang)}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                {t('header.subtitle', currentLang)}
              </p>
            </div>

          </div>

          {/* CENTER NAVIGATION (DESKTOP) */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-700">
            {navLinks.map((link) => {
              const linkRoute = normalizeRoute(link.route);
              const isActive = normalizedCurrent === linkRoute;
              return (
                <button
                  key={link.rawName}
                  onClick={() => handleNavClick(link)}
                  className={`py-2 transition-colors cursor-pointer relative ${
                    isActive
                      ? 'text-slate-950 font-bold border-b-2 border-slate-900 pb-1'
                      : 'hover:text-orange-600'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* RIGHT SIDE: Search Icon, Language Selector & Profile Badge (No generic Login button) */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Global Search Icon Button */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Search Portal"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-slate-200" />

            {/* Language Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
              >
                <Globe className="w-4 h-4 text-orange-600" />
                <span className="font-mono text-[11px] font-bold">
                  {selectedLangObj.flag} {selectedLangObj.native}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 text-xs">
                  <div className="px-2 py-1 mb-2 border-b border-slate-100">
                    <input
                      type="text"
                      placeholder="Search language..."
                      value={langSearchQuery}
                      onChange={(e) => setLangSearchQuery(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                    {filteredLanguages.length === 0 ? (
                      <div className="px-3 py-2 text-slate-400 text-center">No language found</div>
                    ) : (
                      filteredLanguages.map((lang) => {
                        const isSelected = currentLang === lang.code;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setCurrentLang(lang.code);
                              setLangDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-medium cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-orange-50 text-orange-900 font-bold border border-orange-200'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="flex items-center space-x-2">
                              <span>{lang.flag}</span>
                              <span>{lang.name}</span>
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-orange-600" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Badge / Login Trigger */}
            {userProfile ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-semibold">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-heading truncate max-w-[130px]">
                    {userProfile.role === 'business' ? (userProfile.businessName || 'Business') : (userProfile.name || 'Citizen')}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer font-heading"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('nav.login', currentLang)}</span>
              </button>
            )}

          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="flex items-center lg:hidden space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 font-semibold text-xs text-slate-700 shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.rawName}
              onClick={() => {
                handleNavClick(link);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-orange-600 border-b border-slate-100"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-slate-500">Language:</span>
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold"
            >
              {ALL_INDIAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
