import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Bot, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

export default function VoiceAgentView({
  currentLang,
  voiceState, // 'ready' | 'listening' | 'processing' | 'speaking'
  latestMessage,
  isVoiceSupported,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  onReplayVoice
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 text-center animate-in fade-in">
      
      {/* 1. ANIMATED ORB / WAVEFORM CONTAINER */}
      <div className="relative flex items-center justify-center py-4">
        {/* Glowing Background Rings */}
        <div className={`absolute w-36 h-36 rounded-full blur-xl transition-all duration-500 ${
          voiceState === 'listening'
            ? 'bg-red-500/40 animate-ping'
            : voiceState === 'processing'
            ? 'bg-amber-500/40 animate-pulse'
            : voiceState === 'speaking'
            ? 'bg-emerald-500/40 animate-pulse'
            : 'bg-cyan-500/20'
        }`}></div>

        {/* Main Microphone Action Orb */}
        <button
          onClick={() => {
            if (voiceState === 'listening') onStopListening();
            else if (voiceState === 'speaking') onStopSpeaking();
            else onStartListening();
          }}
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${
            voiceState === 'listening'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 ring-8 ring-red-500/30 scale-110'
              : voiceState === 'processing'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 ring-8 ring-amber-500/30'
              : voiceState === 'speaking'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 ring-8 ring-emerald-500/30 scale-105'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 hover:scale-105 shadow-amber-500/20'
          }`}
          title="Tap to speak or stop voice"
        >
          {voiceState === 'listening' ? (
            <MicOff className="w-10 h-10 text-white animate-pulse" />
          ) : voiceState === 'processing' ? (
            <Sparkles className="w-10 h-10 text-slate-950 animate-spin" />
          ) : voiceState === 'speaking' ? (
            <Volume2 className="w-10 h-10 text-slate-950 animate-bounce" />
          ) : (
            <Mic className="w-10 h-10 text-slate-950" />
          )}
        </button>
      </div>

      {/* 2. STATE BADGE INDICATOR */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold shadow-xs">
          {voiceState === 'listening' && (
            <span className="text-red-400 bg-red-950/60 border-red-800/60 border px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>Listening in {currentLang}...</span>
            </span>
          )}
          {voiceState === 'processing' && (
            <span className="text-amber-400 bg-amber-950/60 border-amber-800/60 border px-3 py-1 rounded-full flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Processing Speech...</span>
            </span>
          )}
          {voiceState === 'speaking' && (
            <span className="text-emerald-400 bg-emerald-950/60 border-emerald-800/60 border px-3 py-1 rounded-full flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Speaking Response...</span>
            </span>
          )}
          {voiceState === 'ready' && (
            <span className="text-cyan-400 bg-cyan-950/60 border-cyan-800/60 border px-3 py-1 rounded-full flex items-center gap-2">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tap Microphone & Speak</span>
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 font-sans">
          Speech recognition & audio output configured for <span className="text-amber-400 font-mono font-bold">{currentLang}</span>
        </p>
      </div>

      {/* 3. LATEST AI VOICE RESPONSE CARD */}
      {latestMessage && (
        <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> Voice Output
            </span>
            <div className="flex items-center space-x-2">
              {voiceState === 'speaking' ? (
                <button
                  onClick={onStopSpeaking}
                  className="text-xs text-red-400 hover:text-white flex items-center gap-1 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/40"
                >
                  <VolumeX className="w-3 h-3" /> Stop Audio
                </button>
              ) : (
                <button
                  onClick={() => onReplayVoice(latestMessage.text)}
                  className="text-xs text-amber-400 hover:text-white flex items-center gap-1 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40"
                >
                  <Volume2 className="w-3 h-3" /> Replay Audio
                </button>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {latestMessage.text}
          </p>
        </div>
      )}

      {/* 4. UNSUPPORTED BROWSER WARNING */}
      {!isVoiceSupported && (
        <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl p-3 text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Speech Recognition is limited in this browser. You can type in Chat Agent mode!</span>
        </div>
      )}

    </div>
  );
}
