import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Mic, MessageSquare, Sparkles, Volume2, VolumeX, Trash2 } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import VoiceAgentView from './VoiceAgentView';
import ChatAgentView from './ChatAgentView';
import { getLocalizedSuggestions } from '../data/localizedSuggestions';
import { bisApiService } from '../services/apiService';

export default function BISAIAssistant({
  isOpen,
  onClose,
  currentLang,
  onSelectLanguage,
  onNavigateTab
}) {
  const [activeMode, setActiveMode] = useState('voice'); // 'voice' | 'chat'
  const [inputText, setInputText] = useState('');
  const [voiceState, setVoiceState] = useState('ready'); // 'ready' | 'listening' | 'processing' | 'speaking'
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);

  // Active Attached Image State (Shared between Voice & Chat Agents)
  const [activeImage, setActiveImage] = useState(null); // { name, url, base64, mimeType }

  const recognitionRef = useRef(null);

  // Shared Conversation Memory between Voice & Chat Agents
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('bis_dual_ai_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        sender: 'assistant',
        text: 'Namaste! 🙏 Welcome to BISNEXA AI Assistant. You can speak or chat with me in any of the 22 official Indian languages about IS codes, ISI mark verification, Gold HUID, or BIS Labs!',
        intent: 'Assistant Initialized',
        timestamp: 'Just now'
      }
    ];
  });

  // Sync Conversation Memory to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('bis_dual_ai_history', JSON.stringify(chatHistory));
    } catch (e) {}
  }, [chatHistory]);

  // Set up real Web Speech API Recognition
  useEffect(() => {
    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionApi) {
      setIsVoiceSupported(false);
      return;
    }
    const recognition = new SpeechRecognitionApi();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setVoiceState('processing');
      handleProcessMessage(transcript);
    };
    recognition.onerror = () => setVoiceState('ready');
    recognition.onend = () => {
      if (voiceState === 'listening') setVoiceState('ready');
    };

    recognitionRef.current = recognition;
    return () => {
      try { recognition.stop(); } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang, activeImage]);

  // Start Voice Listening
  const handleStartListening = () => {
    if (!isVoiceSupported || !recognitionRef.current) return;
    try {
      window.speechSynthesis?.cancel();
      recognitionRef.current.lang = currentLang || 'hi-IN';
      recognitionRef.current.start();
      setVoiceState('listening');
    } catch (e) {
      setVoiceState('ready');
    }
  };

  // Stop Listening
  const handleStopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setVoiceState('ready');
  };

  // Stop Audio Speech
  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceState('ready');
  };

  // Read Aloud Text using Web Speech API
  const handleSpeakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const isDevanagari = /[\u0900-\u097F]/.test(text);
      const targetLang = isDevanagari ? 'hi-IN' : (currentLang || 'en-IN');
      utterance.lang = targetLang;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((v) => v.lang === targetLang) ||
                           voices.find((v) => v.lang.startsWith(targetLang.split('-')[0])) ||
                           voices.find((v) => v.lang.includes('IN'));
      if (matchedVoice) utterance.voice = matchedVoice;

      utterance.onstart = () => setVoiceState('speaking');
      utterance.onend = () => setVoiceState('ready');
      utterance.onerror = () => setVoiceState('ready');
      window.speechSynthesis.speak(utterance);
    }
  };

  // Clear Memory
  const handleClearMemory = () => {
    const defaultMsg = [
      {
        sender: 'assistant',
        text: 'Conversation history cleared. How can I help you today?',
        intent: 'Memory Cleared',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setChatHistory(defaultMsg);
    setActiveImage(null);
    try {
      localStorage.removeItem('bis_dual_ai_history');
    } catch (e) {}
  };

  // Send & Process Message (Unified for both Voice Agent & Chat Agent)
  const handleProcessMessage = async (queryText) => {
    const textToUse = (queryText || inputText).trim();
    if (!textToUse) return;

    const userMsg = {
      sender: 'user',
      text: textToUse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setInputText('');
    setVoiceState('processing');

    let botResponse = '';
    let detectedIntent = '✨ Gemini AI Multilingual Response';

    try {
      if (activeImage) {
        // Multimodal Image Grounded Vision Analysis
        botResponse = await bisApiService.queryGeminiVisionApi(
          textToUse,
          activeImage.base64,
          activeImage.mimeType,
          updatedHistory
        );
        detectedIntent = '🖼️ Image Grounded Analysis';
      } else {
        // Standard Text/Voice Knowledge Query
        const textLower = textToUse.toLowerCase();

        // Check for Barcode Generation query
        if (textLower.includes('barcode') && (textLower.includes('generate') || textLower.includes('create') || textLower.includes('banao') || textLower.includes('kaise karein'))) {
          botResponse = "Barcode generation is not available in the current visible interface.";
          detectedIntent = 'Barcode Policy Check';
        } else {
          // Query Gemini AI with selected language locale
          const aiReply = await bisApiService.queryGeminiAi(textToUse, currentLang, updatedHistory);
          if (aiReply) {
            botResponse = aiReply;
          } else {
            botResponse = "This information is not currently available on BISNEXA.";
            detectedIntent = 'Information Not Available';
          }
        }
      }
    } catch (err) {
      console.warn("AI processing error:", err);
      botResponse = "This information is not currently available on BISNEXA.";
    }

    const botMsg = {
      sender: 'assistant',
      text: botResponse,
      intent: detectedIntent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, botMsg]);
    handleSpeakText(botResponse);
  };

  if (!isOpen) return null;

  const suggestions = getLocalizedSuggestions(currentLang);
  const latestMessage = chatHistory[chatHistory.length - 1];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto text-slate-100">
        
        {/* HEADER BAR */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-cyan-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-amber-400">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold font-heading text-slate-100 flex items-center gap-2">
                BISNEXA AI Assistant
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-500/30">
                  22 Languages
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Voice & Chat Agent with Shared Context & Image Grounding</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector Dropdown */}
            <LanguageSelector
              currentLang={currentLang}
              onSelectLanguage={onSelectLanguage}
              compact={true}
            />

            {/* Clear Memory */}
            <button
              onClick={handleClearMemory}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Reset Conversation Memory"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODE TOGGLE SWITCH: [ 🎙 Voice Agent ] [ 💬 Chat Agent ] */}
        <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-bold font-mono">
          <button
            onClick={() => setActiveMode('voice')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeMode === 'voice'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>🎙 Voice Agent</span>
          </button>

          <button
            onClick={() => setActiveMode('chat')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeMode === 'chat'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>💬 Chat Agent</span>
          </button>
        </div>

        {/* DUAL MODE CONTAINER */}
        <div className="bg-slate-900/80 rounded-2xl">
          {activeMode === 'voice' ? (
            <VoiceAgentView
              currentLang={currentLang}
              voiceState={voiceState}
              latestMessage={latestMessage}
              isVoiceSupported={isVoiceSupported}
              onStartListening={handleStartListening}
              onStopListening={handleStopListening}
              onStopSpeaking={handleStopSpeaking}
              onReplayVoice={handleSpeakText}
            />
          ) : (
            <ChatAgentView
              chatHistory={chatHistory}
              isProcessing={voiceState === 'processing'}
              inputText={inputText}
              setInputText={setInputText}
              activeImage={activeImage}
              onSendMessage={() => handleProcessMessage()}
              onUploadImage={(imgObj) => setActiveImage(imgObj)}
              onRemoveImage={() => setActiveImage(null)}
              onReplayVoice={handleSpeakText}
              onMicToggle={handleStartListening}
              isListening={voiceState === 'listening'}
            />
          )}
        </div>

        {/* SUGGESTED QUESTIONS PILLS (Auto-translated to selected language) */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">💡 Suggested Questions ({currentLang}):</span>
            <span className="text-[10px] text-amber-400 font-mono">Tap any question</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((qText, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleProcessMessage(qText)}
                className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-300 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors text-left cursor-pointer truncate max-w-xs"
              >
                {qText}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
