import React, { useState } from 'react';
import { X, Lock, User, KeyRound, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { t } from '../i18n/translations';

export default function LoginModal({ isOpen, onClose, currentLang = 'en-IN' }) {
  const [userType, setUserType] = useState('MANUFACTURER'); // 'MANUFACTURER', 'CONSUMER'
  const [loginMethod, setLoginMethod] = useState('PASSWORD'); // 'PASSWORD', 'OTP'
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsLoggedIn(false);
    setIdentifier('');
    setSecret('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
              {t('modals.loginTitle', currentLang)}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Access Manakonline, e-BIS & Consumer Services
            </p>
          </div>
        </div>

        {isLoggedIn ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4 font-sans">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Welcome Back!</h4>
              <p className="text-xs text-slate-600 mt-1">
                Logged in successfully as <strong className="font-mono text-slate-900">{identifier}</strong>
              </p>
            </div>
            <div className="pt-2 flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Log Out
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Continue Portal
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* User Type Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setUserType('MANUFACTURER')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  userType === 'MANUFACTURER'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Industry / MSME
              </button>
              <button
                type="button"
                onClick={() => setUserType('CONSUMER')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  userType === 'CONSUMER'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Consumer / Public
              </button>
            </div>

            {/* Input Identifier */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase font-mono block">
                {userType === 'MANUFACTURER' ? 'License No. / Email / User ID' : 'Mobile No. / Email'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={userType === 'MANUFACTURER' ? 'e.g. CML-8765432 or user@company.com' : 'e.g. 9876543210'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            {/* Secret Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 uppercase font-mono block">
                  {loginMethod === 'PASSWORD' ? 'Password' : 'Enter OTP'}
                </label>
                <button
                  type="button"
                  onClick={() => setLoginMethod(loginMethod === 'PASSWORD' ? 'OTP' : 'PASSWORD')}
                  className="text-[10px] font-mono font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  Use {loginMethod === 'PASSWORD' ? 'OTP via Mobile' : 'Password'}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={loginMethod === 'PASSWORD' ? 'password' : 'text'}
                  required
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder={loginMethod === 'PASSWORD' ? '••••••••' : '6-digit OTP'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <span>Authenticating with Manakonline...</span>
              ) : (
                <>
                  <span>Sign In to BIS Portal</span>
                  <ArrowRight className="w-4 h-4 text-orange-400" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
