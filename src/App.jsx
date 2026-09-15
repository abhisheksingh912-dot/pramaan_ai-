import React, { useState, useEffect } from 'react';
import HeaderNavbar from './components/HeaderNavbar';
import HomePage from './components/HomePage';
import AboutBis from './components/AboutBis';
import VerifyProductPage from './components/VerifyProductPage';
import StandardsExplorer from './components/StandardsExplorer';
import BisLabFinder from './components/consumer/BisLabFinder';
import LiveBisNews from './components/consumer/LiveBisNews';
import ConsumerComplaints from './components/consumer/ConsumerComplaints';
import IndustryLicensingWizard from './components/IndustryLicensingWizard';
import AdminAnalytics from './components/AdminAnalytics';
import BisFooter from './components/BisFooter';
import AuthenticationModal from './components/AuthenticationModal';
import GlobalSearchModal from './components/GlobalSearchModal';

// TWO COMPLETELY SEPARATE AI AGENTS
import ScanMarkAIAgent from './components/ScanMarkAIAgent'; // Agent 1: Scan-Only (Orange/Navy)
import WebsiteAIAssistant from './components/WebsiteAIAssistant'; // Agent 2: General Website (Blue/Navy)
import BISAIButton from './components/BISAIButton'; // Floating Launcher for Agent 2

import { ALL_INDIAN_LANGUAGES } from './i18n/translations';

export default function App() {
  const [currentLang, setCurrentLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('bis_portal_lang');
      if (saved) return saved;
    } catch (e) {}
    return 'en-IN';
  });

  // User Profile State (Consumer or Business)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('pramaan_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Client-side URL route state with browser history support
  const [currentRoute, setCurrentRoute] = useState(() => {
    const path = window.location.pathname;
    return path || '/';
  });

  const [lastScan, setLastScan] = useState(null);
  
  // Separate Modal States for the Two Separate AI Agents
  const [showScanMarkAgentModal, setShowScanMarkAgentModal] = useState(false); // Agent 1
  const [showWebsiteAgentModal, setShowWebsiteAgentModal] = useState(false); // Agent 2
  
  // Authentication Modal State (Automatically open for first-time visitors without a profile)
  const [showAuthModal, setShowAuthModal] = useState(() => {
    try {
      const saved = localStorage.getItem('pramaan_user_profile');
      return !saved;
    } catch (e) {
      return true;
    }
  });

  const [authRoleTarget, setAuthRoleTarget] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Sync RTL and Document Language Attribute for all 22 Indian Languages
  const handleLanguageChange = (newLangCode) => {
    setCurrentLangState(newLangCode);
    try {
      localStorage.setItem('bis_portal_lang', newLangCode);
    } catch (e) {}

    const langObj = ALL_INDIAN_LANGUAGES.find((l) => l.code === newLangCode);
    const isRtl = langObj ? langObj.rtl : false;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = newLangCode.split('-')[0];
  };

  useEffect(() => {
    const langObj = ALL_INDIAN_LANGUAGES.find((l) => l.code === currentLang);
    const isRtl = langObj ? langObj.rtl : false;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang.split('-')[0];
  }, [currentLang]);

  // Handle popstate for browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Standardized router handler
  const handleNavigate = (targetViewOrRoute) => {
    let newRoute = targetViewOrRoute;
    if (!newRoute.startsWith('/')) {
      if (newRoute === 'home') newRoute = '/';
      else newRoute = `/${newRoute}`;
    }

    if (window.location.pathname !== newRoute) {
      window.history.pushState({}, '', newRoute);
    }
    setCurrentRoute(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuthForRole = (role = null) => {
    setAuthRoleTarget(role);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    setUserProfile(null);
    try {
      localStorage.removeItem('pramaan_user_profile');
    } catch (e) {}
    setAuthRoleTarget(null);
    setShowAuthModal(true);
  };

  const handleSelectHistoryScan = (queryText) => {
    handleNavigate('/verify');
    setLastScan({ query: queryText, code: queryText, timestamp: 'Just now' });
  };

  // Render ONLY the active page component
  const renderActivePage = () => {
    // ENFORCE MANDATORY LOGIN: User must login first to access services!
    if (!userProfile) {
      return (
        <div className="max-w-2xl mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center mx-auto text-2xl font-bold shadow-lg shadow-orange-500/20">
            🔐
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Authentication Required to Access Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
              Please select your preferred language and login as a Citizen (Aadhaar) or Business (GSTIN) to access Pramaan AI verification, standards, and lab services.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white font-black px-8 py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-xl hover:shadow-2xl cursor-pointer font-heading hover:scale-105"
            >
              Select Language & Login Now →
            </button>
          </div>
        </div>
      );
    }

    const path = currentRoute.toLowerCase();

    if (path === '/about') {
      return <AboutBis currentLang={currentLang} onNavigate={handleNavigate} />;
    }
    if (path === '/standards') {
      return <StandardsExplorer currentLang={currentLang} onNavigate={handleNavigate} />;
    }
    if (path === '/verify') {
      return (
        <VerifyProductPage
          currentLang={currentLang}
          lastScan={lastScan}
          onSearchResult={(data) => setLastScan(data)}
          onSelectScan={handleSelectHistoryScan}
          onNavigate={handleNavigate}
        />
      );
    }
    if (path === '/labs') {
      return <BisLabFinder currentLang={currentLang} onNavigate={handleNavigate} />;
    }
    if (path === '/news') {
      return <LiveBisNews currentLang={currentLang} onNavigate={handleNavigate} />;
    }
    if (path === '/complaints') {
      return <ConsumerComplaints currentLang={currentLang} onNavigate={handleNavigate} />;
    }

    // INDUSTRY PORTAL ROUTE (Enforce Business Profile)
    if (path === '/industry') {
      if (userProfile && userProfile.role === 'consumer') {
        return (
          <div className="max-w-2xl mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl font-bold">
              🔒
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
              Manufacturer & Business Gateway Restricted
            </h3>
            <p className="text-sm text-slate-600">
              You are currently using a <strong>Consumer Profile</strong> (Aadhaar Verified). Consumer profiles do not have access to Business & Industry licensing tools.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleOpenAuthForRole('business')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-all shadow-md cursor-pointer font-heading"
              >
                Authenticate as Business (GSTIN) →
              </button>
            </div>
          </div>
        );
      }
      return <IndustryLicensingWizard currentLang={currentLang} onNavigate={handleNavigate} />;
    }

    // CHART BOARD ROUTE (Enforce Industry/Business Profile Only)
    if (path === '/chartboard') {
      if (userProfile && userProfile.role === 'consumer') {
        return (
          <div className="max-w-2xl mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
              🔒
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
              {currentLang === 'hi-IN' ? 'चार्ट बोर्ड केवल उद्योग एवं व्यवसाय के लिए है' : 'Industry & Business Mode Only'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {currentLang === 'hi-IN' 
                ? 'राष्ट्रीय प्रवर्तन चार्ट बोर्ड और अनुपालन टेलीमेट्री केवल सत्यापित उद्योग / व्यावसायिक प्रोफाइल (GSTIN) के लिए आरक्षित है।'
                : 'The National Enforcement Chart Board & Compliance Telemetry hub is reserved exclusively for registered Manufacturers and Industry / Business accounts (GSTIN verified).'}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => handleOpenAuthForRole('business')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-all shadow-md cursor-pointer font-heading"
              >
                {currentLang === 'hi-IN' ? 'उद्योग (GSTIN) के रूप में लॉगिन करें →' : 'Authenticate as Business (GSTIN) →'}
              </button>
              <button
                onClick={() => handleNavigate('/')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-2xl text-xs transition-all cursor-pointer font-heading"
              >
                {currentLang === 'hi-IN' ? 'होम पेज पर वापस जाएं' : 'Back to Home'}
              </button>
            </div>
          </div>
        );
      }
      return <AdminAnalytics currentLang={currentLang} onNavigate={handleNavigate} />;
    }

    // Default to HOME page ONLY
    return (
      <HomePage 
        currentLang={currentLang} 
        onNavigate={handleNavigate} 
        onSelectRole={handleOpenAuthForRole}
        userProfile={userProfile}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-orange-100 selection:text-orange-900">
      
      {/* 1. HEADER NAVBAR */}
      <HeaderNavbar
        currentLang={currentLang}
        setCurrentLang={handleLanguageChange}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenAuth={() => handleOpenAuthForRole(null)}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* 2. MAIN CONTENT BODY */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {renderActivePage()}
      </main>

      {/* 3. WELCOME & PORTAL AUTHENTICATION MODAL */}
      <AuthenticationModal
        isOpen={showAuthModal || !userProfile}
        onClose={() => {
          if (userProfile) setShowAuthModal(false);
        }}
        isUserAuthenticated={Boolean(userProfile)}
        currentLang={currentLang}
        setCurrentLang={handleLanguageChange}
        defaultRole={authRoleTarget}
        onLoginSuccess={(profile) => {
          setUserProfile(profile);
          setShowAuthModal(false);
        }}
      />

      {/* 4. GLOBAL SEARCH MODAL */}
      <GlobalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onNavigateTab={(tab) => handleNavigate(tab)}
        currentLang={currentLang}
      />

      {/* 5. AGENT 1: SCAN A MARK AI AGENT (Orange/Navy - Triggered inside Scan section) */}
      <ScanMarkAIAgent
        isOpen={showScanMarkAgentModal}
        onClose={() => setShowScanMarkAgentModal(false)}
        currentLang={currentLang}
        onSelectLanguage={handleLanguageChange}
      />

      {/* 6. AGENT 2: PRAMAAN AI WEBSITE ASSISTANT (Blue/Navy - Triggered by floating button) */}
      <WebsiteAIAssistant
        isOpen={showWebsiteAgentModal}
        onClose={() => setShowWebsiteAgentModal(false)}
        currentLang={currentLang}
        onSelectLanguage={handleLanguageChange}
      />

      {/* 7. FLOATING AI ASSISTANT LAUNCHER BUTTON */}
      <BISAIButton
        currentLang={currentLang}
        onOpenAgent={() => setShowWebsiteAgentModal(true)}
      />

      {/* 8. FOOTER */}
      <BisFooter currentLang={currentLang} onNavigate={handleNavigate} />

    </div>
  );
}
