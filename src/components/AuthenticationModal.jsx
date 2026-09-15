import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  X, 
  ShieldCheck, 
  CreditCard, 
  User, 
  Phone, 
  FileText, 
  MapPin, 
  KeyRound, 
  Check, 
  Lock,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { ALL_INDIAN_LANGUAGES, t } from '../i18n/translations';

// Highlighted popular Indian languages for quick single-click selection on welcome screen
const POPULAR_LANGUAGES = [
  { code: "en-IN", name: "English", native: "English", flag: "🇬🇧" },
  { code: "hi-IN", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "mr-IN", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "ta-IN", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te-IN", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "bn-IN", name: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  { code: "gu-IN", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn-IN", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" }
];

export default function AuthenticationModal({ 
  isOpen, 
  onClose, 
  currentLang = 'en-IN', 
  setCurrentLang, 
  onLoginSuccess,
  defaultRole = null,
  isUserAuthenticated = false
}) {
  const [step, setStep] = useState('WELCOME'); // 'WELCOME', 'SELECT_PORTAL', 'AUTHENTICATE', 'SUCCESS'
  const [selectedRole, setSelectedRole] = useState(defaultRole || 'consumer'); // 'consumer' or 'business'
  
  // Consumer Form State
  const [consumerData, setConsumerData] = useState({
    aadhaar: '',
    name: '',
    mobile: '',
    otp: '',
    otpSent: false
  });

  // Business Form State
  const [businessData, setBusinessData] = useState({
    businessName: '',
    gstin: '',
    location: '',
    mobile: '',
    otp: '',
    otpSent: false
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    if (defaultRole) {
      setSelectedRole(defaultRole);
      setStep('AUTHENTICATE');
    } else if (isOpen && !isUserAuthenticated) {
      setStep('WELCOME');
      setErrorMsg('');
    }
  }, [defaultRole, isOpen, isUserAuthenticated]);

  if (!isOpen) return null;

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setStep('AUTHENTICATE');
    setErrorMsg('');
  };

  // 1-Click Demo Data Auto-Fillers
  const handleFillDemoConsumer = () => {
    setConsumerData({
      aadhaar: '5489 2167 9034',
      name: 'Aarav Sharma',
      mobile: '9876543210',
      otp: '123456',
      otpSent: false
    });
    setErrorMsg('');
  };

  const handleFillDemoBusiness = () => {
    setBusinessData({
      businessName: 'Bharat Precision Electricals Pvt Ltd',
      gstin: '27AAACB2234M1Z5',
      location: 'MIDC Industrial Area, Pune, Maharashtra - 411018',
      mobile: '9876543210',
      otp: '123456',
      otpSent: false
    });
    setErrorMsg('');
  };

  const handleSendOtpConsumer = (e) => {
    e.preventDefault();
    const rawAadhaar = consumerData.aadhaar.replace(/\D/g, '');
    if (!rawAadhaar || rawAadhaar.length !== 12) {
      setErrorMsg('Please enter a valid 12-digit Aadhaar Number (e.g. 5489 2167 9034) or click "Fill Demo Data".');
      return;
    }
    if (!consumerData.name.trim() || consumerData.name.trim().length < 2) {
      setErrorMsg('Please enter your Full Name.');
      return;
    }
    const rawMobile = consumerData.mobile.replace(/\D/g, '');
    if (!rawMobile || rawMobile.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Mobile Number.');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setConsumerData(prev => ({ ...prev, otpSent: true, otp: '123456' }));
    }, 600);
  };

  const handleVerifyConsumer = (e) => {
    e.preventDefault();
    if (!consumerData.otp || consumerData.otp.length < 4) {
      setErrorMsg('Please enter the 6-digit OTP (or click Demo OTP: 123456).');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const cleanAadhaar = consumerData.aadhaar.replace(/\D/g, '');
      const profile = {
        role: 'consumer',
        name: consumerData.name,
        mobile: consumerData.mobile,
        aadhaar: `XXXX-XXXX-${cleanAadhaar.slice(-4)}`,
        verified: true,
        authenticatedAt: new Date().toISOString()
      };
      
      try {
        localStorage.setItem('pramaan_user_profile', JSON.stringify(profile));
      } catch (err) {}

      if (onLoginSuccess) onLoginSuccess(profile);
      setStep('SUCCESS');
      setTimeout(() => {
        onClose();
      }, 900);
    }, 800);
  };

  const handleSendOtpBusiness = (e) => {
    e.preventDefault();
    if (!businessData.businessName.trim()) {
      setErrorMsg('Please enter your Registered Business Name or click "Fill Demo Data".');
      return;
    }
    const cleanGstin = businessData.gstin.trim().toUpperCase();
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!cleanGstin || cleanGstin.length !== 15 || (!gstinRegex.test(cleanGstin) && !/^[0-9A-Z]{15}$/.test(cleanGstin))) {
      setErrorMsg('Please enter a valid 15-character GSTIN Number (e.g. 27AAACB2234M1Z5) or click "Fill Demo Data".');
      return;
    }
    if (!businessData.location.trim()) {
      setErrorMsg('Please enter your Business Location / Address.');
      return;
    }
    const rawMobile = businessData.mobile.replace(/\D/g, '');
    if (!rawMobile || rawMobile.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Mobile Number.');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setBusinessData(prev => ({ ...prev, otpSent: true, otp: '123456' }));
    }, 600);
  };

  const handleVerifyBusiness = (e) => {
    e.preventDefault();
    if (!businessData.otp || businessData.otp.length < 4) {
      setErrorMsg('Please enter the 6-digit OTP (or click Demo OTP: 123456).');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const profile = {
        role: 'business',
        businessName: businessData.businessName,
        gstin: businessData.gstin.toUpperCase(),
        location: businessData.location,
        mobile: businessData.mobile,
        verified: true,
        authenticatedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('pramaan_user_profile', JSON.stringify(profile));
      } catch (err) {}

      if (onLoginSuccess) onLoginSuccess(profile);
      setStep('SUCCESS');
      setTimeout(() => {
        onClose();
      }, 900);
    }, 800);
  };

  const selectedLangObj = ALL_INDIAN_LANGUAGES.find(l => l.code === currentLang) || ALL_INDIAN_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden my-4 sm:my-8 transform transition-all">
        
        {/* Dim Light Background Watermark of Pramaan AI Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 overflow-hidden z-0">
          <img 
            src="/pramaan-logo.jpg" 
            onError={(e) => { e.currentTarget.src = '/pramaan-ai-logo.jpg'; }}
            alt="Pramaan AI Watermark" 
            className="w-[500px] h-[500px] object-contain filter grayscale"
          />
        </div>

        {/* Modal Top Header Bar - Exact Match to Uploaded Window */}
        <div className="relative z-10 bg-slate-900 text-white px-6 sm:px-8 py-4 flex items-center justify-between border-b border-slate-800">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
              <img 
                src="/pramaan-logo.jpg" 
                onError={(e) => { e.currentTarget.src = '/pramaan-ai-logo.jpg'; }}
                alt="Pramaan AI Emblem" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-base sm:text-lg font-black font-heading tracking-wide text-white">
                  Welcome to Pramaan AI
                </h2>
                <span className="text-[10px] uppercase tracking-wider bg-amber-950/40 text-amber-400 border border-amber-500/50 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  OFFICIAL VERIFICATION PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                National Standards & Intelligent Verification
              </p>
            </div>
          </div>

          {/* Right Controls: Close Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Modal Main Content */}
        <div className="relative z-10 p-5 sm:p-8">
          
          {/* STEP 0: WELCOME PAGE - EXACT REPLICA OF UPLOADED WINDOW */}
          {step === 'WELCOME' && (
            <div className="text-center py-3 sm:py-5 px-1 sm:px-4 space-y-6 sm:space-y-7 animate-fadeIn">
              
              {/* Centered Heading & Subtitle */}
              <div className="space-y-2.5 max-w-2xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight leading-tight">
                  Welcome to Pramaan AI
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
                  Verify Before Buy — Empowering 1.4 Billion citizens & businesses with AI-powered Standard Verification, Gold HUID lookup and Industry Certification.
                </p>
              </div>

              {/* 3 Feature Cards in a Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto text-left">
                {/* Card 1: Official BIS Registry */}
                <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-4 space-y-1.5 shadow-xs">
                  <div className="flex items-center space-x-1.5 text-orange-700 font-extrabold text-xs sm:text-sm font-heading">
                    <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Official BIS Registry</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-snug">
                    Direct verification against CM/L, HUID, and CRS government records.
                  </p>
                </div>

                {/* Card 2: 22 Indian Languages */}
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50/40 p-4 space-y-1.5 shadow-xs">
                  <div className="flex items-center space-x-1.5 text-cyan-700 font-extrabold text-xs sm:text-sm font-heading">
                    <Globe className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>22 Indian Languages</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-snug">
                    Full voice & chat AI guidance in all official languages.
                  </p>
                </div>

                {/* Card 3: Dual Portals */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 space-y-1.5 shadow-xs">
                  <div className="flex items-center space-x-1.5 text-blue-700 font-extrabold text-xs sm:text-sm font-heading">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Dual Portals</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-snug">
                    Dedicated workflows for general consumers & MSME manufacturers.
                  </p>
                </div>
              </div>

              {/* Language Selection Container Box */}
              <div className="border border-slate-200 bg-slate-50/70 rounded-2xl p-4 sm:p-5 max-w-xl mx-auto space-y-2.5 text-left shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm font-extrabold text-orange-600">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <span>Select Portal Language:</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    IN {selectedLangObj.native} ({selectedLangObj.name.split(' ')[0]})
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={currentLang}
                    onChange={(e) => {
                      if (setCurrentLang) setCurrentLang(e.target.value);
                    }}
                    className="w-full bg-white border border-slate-300 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 shadow-xs appearance-none cursor-pointer outline-none transition-all pr-10"
                  >
                    {ALL_INDIAN_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        IN  {l.native} ({l.name.split(' ')[0]}) ({l.native})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 font-bold text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Action Button: Get Started & Select Portal */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep('SELECT_PORTAL')}
                  className="bg-slate-950 hover:bg-slate-900 text-white font-black px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm transition-all shadow-xl hover:shadow-2xl flex items-center space-x-2.5 mx-auto cursor-pointer hover:scale-105 active:scale-95 font-heading"
                >
                  <span>Get Started & Select Portal</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 1: PORTAL SELECTION CARDS */}
          {step === 'SELECT_PORTAL' && (
            <div className="space-y-6">
              
              {/* Back to Language Selection */}
              <button
                onClick={() => setStep('WELCOME')}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('common.back', currentLang)} ({t('auth.selectLanguage', currentLang)})</span>
              </button>

              <div className="text-center max-w-xl mx-auto space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                  {t('auth.choosePortal', currentLang)}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  {t('auth.choosePortalDesc', currentLang)}
                </p>
              </div>

              {/* Grid of Two Portal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* 1. CONSUMER PORTAL CARD */}
                <div className="bg-gradient-to-br from-orange-50/90 via-white to-amber-50/60 border-2 border-orange-200/90 rounded-3xl p-6 sm:p-7 shadow-md flex flex-col justify-between space-y-6 hover:shadow-xl hover:border-orange-400 transition-all relative overflow-hidden group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono font-extrabold text-orange-800 bg-orange-100 border border-orange-300 px-3 py-1 rounded-full uppercase tracking-wider">
                        {t('consumer.badge', currentLang)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                        {t('consumer.title', currentLang)}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                        {t('consumer.subtitle', currentLang)}
                      </p>
                    </div>

                    <ul className="space-y-2.5 pt-2 text-xs text-slate-700 font-medium">
                      <li className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span>{t('consumer.f1', currentLang)}</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span>{t('consumer.f2', currentLang)}</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span>{t('consumer.f3', currentLang)}</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span>{t('consumer.f4', currentLang)}</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSelectRole('consumer')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md flex items-center justify-between cursor-pointer group-hover:shadow-lg font-heading"
                  >
                    <span>{t('consumer.btn', currentLang)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 2. BUSINESS / INDUSTRY PORTAL CARD */}
                <div className="bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/60 border-2 border-blue-200/90 rounded-3xl p-6 sm:p-7 shadow-md flex flex-col justify-between space-y-6 hover:shadow-xl hover:border-blue-400 transition-all relative overflow-hidden group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono font-extrabold text-blue-800 bg-blue-100 border border-blue-300 px-3 py-1 rounded-full uppercase tracking-wider">
                        {t('industry.badge', currentLang)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                        {t('industry.title', currentLang)}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                        {t('industry.subtitle', currentLang)}
                      </p>
                    </div>

                    <ul className="space-y-2.5 pt-2 text-xs text-slate-700 font-medium">
                      <li className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{t('industry.f1', currentLang)}</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{t('industry.f2', currentLang)}</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{t('industry.f3', currentLang)}</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{t('industry.f4', currentLang)}</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSelectRole('business')}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md flex items-center justify-between cursor-pointer group-hover:shadow-lg font-heading"
                  >
                    <span>{t('industry.btn', currentLang)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* STEP 2: AUTHENTICATION FORM WITH DEMO DATA AUTO-FILL */}
          {step === 'AUTHENTICATE' && (
            <div className="max-w-md mx-auto space-y-5">
              
              {/* Top Controls: Back Button & 1-Click Demo Data Button */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep('SELECT_PORTAL');
                    setErrorMsg('');
                  }}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('common.back', currentLang)}</span>
                </button>

                {/* 1-Click Demo Data Button */}
                <button
                  type="button"
                  onClick={selectedRole === 'consumer' ? handleFillDemoConsumer : handleFillDemoBusiness}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-102"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t('auth.fillDemoData', currentLang)}</span>
                </button>
              </div>

              {/* Header Badge */}
              <div className="text-center space-y-1.5">
                <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg ${
                  selectedRole === 'consumer' ? 'bg-orange-500 shadow-orange-500/20' : 'bg-blue-600 shadow-blue-600/20'
                }`}>
                  {selectedRole === 'consumer' ? <CreditCard className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                  {selectedRole === 'consumer' ? t('auth.consumerCardTitle', currentLang) : t('auth.businessCardTitle', currentLang)}
                </h3>
                <p className="text-xs text-slate-600">
                  {selectedRole === 'consumer' 
                    ? t('auth.consumerCardDesc', currentLang) 
                    : t('auth.businessCardDesc', currentLang)}
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* CASE 1: CONSUMER AUTH FORM */}
              {selectedRole === 'consumer' && (
                <form onSubmit={consumerData.otpSent ? handleVerifyConsumer : handleSendOtpConsumer} className="space-y-3.5">
                  
                  {/* Aadhaar Card Number (12 digits, formatted) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        {t('auth.aadhaarLabel', currentLang)} *
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">12 Digits</span>
                    </div>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="5489 2167 9034"
                        maxLength={14}
                        value={consumerData.aadhaar}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                          const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                          setConsumerData({ ...consumerData, aadhaar: formatted });
                        }}
                        disabled={consumerData.otpSent}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('auth.fullNameLabel', currentLang)} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Aarav Sharma"
                        value={consumerData.name}
                        onChange={(e) => setConsumerData({ ...consumerData, name: e.target.value })}
                        disabled={consumerData.otpSent}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Mobile Number (10 digits) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        {t('auth.mobileLabel', currentLang)} *
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">10 Digits</span>
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        placeholder="9876543210"
                        maxLength={10}
                        value={consumerData.mobile}
                        onChange={(e) => setConsumerData({ ...consumerData, mobile: e.target.value.replace(/\D/g, '') })}
                        disabled={consumerData.otpSent}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* OTP Box if Sent */}
                  {consumerData.otpSent && (
                    <div className="p-4 bg-orange-50/80 border border-orange-200 rounded-2xl space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-orange-900">
                          {t('auth.otpLabel', currentLang)} *
                        </label>
                        <button
                          type="button"
                          onClick={() => setConsumerData(prev => ({ ...prev, otp: '123456' }))}
                          className="text-[10px] bg-orange-200 hover:bg-orange-300 text-orange-900 font-mono font-bold px-2 py-0.5 rounded cursor-pointer"
                        >
                          ⚡ {t('auth.useDemoOtp', currentLang)}
                        </button>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-orange-500 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          placeholder="123456"
                          maxLength={6}
                          value={consumerData.otp}
                          onChange={(e) => setConsumerData({ ...consumerData, otp: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-orange-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:border-orange-600 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer font-heading disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <span>{t('common.loading', currentLang)}</span>
                    ) : consumerData.otpSent ? (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t('auth.verifyOtpBtn', currentLang)}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('auth.sendOtpBtn', currentLang)}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              )}

              {/* CASE 2: BUSINESS AUTH FORM */}
              {selectedRole === 'business' && (
                <form onSubmit={businessData.otpSent ? handleVerifyBusiness : handleSendOtpBusiness} className="space-y-3.5">
                  
                  {/* Business Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('auth.businessNameLabel', currentLang)} *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Bharat Precision Electricals Pvt Ltd"
                        value={businessData.businessName}
                        onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                        disabled={businessData.otpSent}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* GSTIN Number (15 chars) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        {t('auth.gstinLabel', currentLang)} *
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">15 Characters</span>
                    </div>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="27AAACB2234M1Z5"
                        maxLength={15}
                        value={businessData.gstin}
                        onChange={(e) => setBusinessData({ ...businessData, gstin: e.target.value.toUpperCase() })}
                        disabled={businessData.otpSent}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all uppercase disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('auth.businessLocationLabel', currentLang)} *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="MIDC Industrial Area, Pune, Maharashtra - 411018"
                        value={businessData.location}
                        onChange={(e) => setBusinessData({ ...businessData, location: e.target.value })}
                        disabled={businessData.otpSent}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        {t('auth.mobileLabel', currentLang)} *
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">10 Digits</span>
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        placeholder="9876543210"
                        maxLength={10}
                        value={businessData.mobile}
                        onChange={(e) => setBusinessData({ ...businessData, mobile: e.target.value.replace(/\D/g, '') })}
                        disabled={businessData.otpSent}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* OTP Box if Sent */}
                  {businessData.otpSent && (
                    <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-blue-900">
                          {t('auth.otpLabel', currentLang)} *
                        </label>
                        <button
                          type="button"
                          onClick={() => setBusinessData(prev => ({ ...prev, otp: '123456' }))}
                          className="text-[10px] bg-blue-200 hover:bg-blue-300 text-blue-900 font-mono font-bold px-2 py-0.5 rounded cursor-pointer"
                        >
                          ⚡ {t('auth.useDemoOtp', currentLang)}
                        </button>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          placeholder="123456"
                          maxLength={6}
                          value={businessData.otp}
                          onChange={(e) => setBusinessData({ ...businessData, otp: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-blue-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer font-heading disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <span>{t('common.loading', currentLang)}</span>
                    ) : businessData.otpSent ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        <span>{t('auth.verifyOtpBtn', currentLang)}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('auth.sendOtpBtn', currentLang)}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'SUCCESS' && (
            <div className="text-center py-8 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 border-2 border-green-300 flex items-center justify-center mx-auto shadow-lg">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-heading">
                {t('auth.authSuccessMsg', currentLang)}
              </h3>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Notice */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-[11px] text-slate-500 font-mono flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>256-Bit Encrypted Official Verification Portal</span>
          </span>
          <span className="font-bold text-slate-700">Pramaan AI Safety Standard</span>
        </div>

      </div>

    </div>
  );
}
