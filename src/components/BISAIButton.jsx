import React from 'react';

export default function BISAIButton({ onClick, onOpenAgent, currentLang }) {
  const handleClick = onClick || onOpenAgent;
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in">
      <button
        onClick={handleClick}
        className="relative group flex items-center space-x-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 text-slate-950 font-bold px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-amber-300/40"
        title="Open Pramaan AI Assistant (Voice & Chat - 22 Languages)"
        aria-label="Ask Pramaan AI"
      >
        <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-md shrink-0 overflow-hidden border border-slate-200">
          <img
            src="/pramaan-ai-logo.jpg"
            alt="Pramaan AI Logo"
            className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform"
          />
        </div>
        
        <span className="text-xs sm:text-sm font-heading font-extrabold pr-1 tracking-tight text-slate-950">
          Ask Pramaan AI
        </span>

        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-slate-950"></span>
        </span>
      </button>
    </div>
  );
}
