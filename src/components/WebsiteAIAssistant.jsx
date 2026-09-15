import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Mic, MicOff, MessageSquare, BookOpen, HelpCircle, Send, User, Volume2, Copy, Check, Upload, Trash2, Home, FileText, ShieldCheck, Building2, Newspaper } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { getWebsiteAgentUiLabels } from '../i18n/agentUiTranslations';
import { getLocalizedSuggestions } from '../data/localizedSuggestions';
import { bisApiService } from '../services/apiService';
import { bhashiniService } from '../services/bhashiniService';

export default function WebsiteAIAssistant({ isOpen, onClose, onNavigateTab }) {
  // 2. INDEPENDENT AGENT 2 LANGUAGE STATE (Never modifies globalWebsiteLanguage or Agent 1!)
  const [websiteAssistantLanguage, setWebsiteAssistantLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('bis_website_agent_lang');
      if (saved) return saved;
    } catch (e) {}
    return 'mr-IN'; // Default to Marathi for Website AI Assistant
  });

  const [activeTab, setActiveTab] = useState('voice'); // 'voice' | 'chat' | 'guide' | 'faq'
  const [inputText, setInputText] = useState('');
  const [voiceState, setVoiceState] = useState('ready'); // 'ready' | 'listening' | 'processing' | 'speaking'
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Save Agent 2 language independently
  const handleSelectLanguage = (newLang) => {
    setWebsiteAssistantLanguage(newLang);
    try {
      localStorage.setItem('bis_website_agent_lang', newLang);
    } catch (e) {}
  };

  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'assistant',
      text: 'Namaste! 🙏 Welcome to the Pramaan AI Assistant. I can guide you across the entire website — Home, About BIS, Standards Explorer, Product Verification, BIS Labs, News, and Portal services.',
      intent: 'Pramaan AI Initialized',
      detectedLang: 'mr',
      timestamp: 'Just now'
    }
  ]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, voiceState]);

  // Speech Recognition Setup tied ONLY to websiteAssistantLanguage
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
      handleSendMessage(transcript);
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
  }, [websiteAssistantLanguage, activeImage]);

  const handleStartListening = () => {
    if (!isVoiceSupported || !recognitionRef.current) return;
    try {
      bhashiniService.stopAudio();
      recognitionRef.current.lang = websiteAssistantLanguage || 'mr-IN';
      recognitionRef.current.start();
      setVoiceState('listening');
    } catch (e) {
      setVoiceState('ready');
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setVoiceState('ready');
  };

  const handleStopAudio = () => {
    bhashiniService.stopAudio();
    setVoiceState('ready');
  };

  const handleSpeakText = (text, preferredLang) => {
    if (!text) return;
    setVoiceState('speaking');
    const langToUse = preferredLang || websiteAssistantLanguage || 'mr-IN';
    bhashiniService.playRegionalTTS(text, langToUse, () => {
      setVoiceState('ready');
    });
  };

  const handleSendMessage = async (queryText) => {
    const textToUse = (queryText || inputText).trim();
    if (!textToUse) return;

    // Detect language of the query using Bhashini regional detector
    const detectedLang = bhashiniService.detectLanguage(textToUse);

    const userMsg = {
      sender: 'user',
      text: textToUse,
      detectedLang: detectedLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setInputText('');
    setVoiceState('processing');

    let botResponse = '';
    let intentTag = 'Website AI Assistant';

    try {
      if (activeImage) {
        botResponse = await bisApiService.queryGeminiVisionApi(textToUse, activeImage.base64, activeImage.mimeType, updatedHistory);
        intentTag = '🖼️ Full Site Screenshot Analysis';
      } else {
        // Send detected language directly so the chatbot answers in the question's language
        const targetLang = (detectedLang && detectedLang !== 'en') ? detectedLang : websiteAssistantLanguage;
        botResponse = await bisApiService.queryWebsiteAgentApi(textToUse, targetLang, updatedHistory);
      }
    } catch (e) {
      botResponse = "This information is not currently available on Pramaan AI.";
    }

    const responseLang = bhashiniService.detectLanguage(botResponse) || detectedLang;

    const botMsg = {
      sender: 'assistant',
      text: botResponse,
      intent: intentTag,
      detectedLang: responseLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, botMsg]);
    handleSpeakText(botResponse, responseLang);
  };

  const handleCopyText = (text, idx) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (e) {}
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setActiveImage({
        name: file.name,
        url: URL.createObjectURL(file),
        base64: evt.target.result,
        mimeType: file.type || 'image/jpeg'
      });
      setActiveTab('chat');
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const uiLabels = getWebsiteAgentUiLabels(websiteAssistantLanguage);
  const popularQuestions = getLocalizedSuggestions(websiteAssistantLanguage).slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      {/* AGENT 2 UNIQUE BLUE + DARK NAVY STYLING CONTAINER */}
      <div className="bg-slate-900 border-2 border-blue-500/60 rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto text-slate-100 ring-4 ring-blue-500/10">
        
        {/* Hidden File Input */}
        <input type="file" ref={fileInputRef} onChange={handleImageFile} accept="image/*" className="hidden" />

        {/* HEADER BAR */}
        <div className="flex items-center justify-between border-b border-blue-500/30 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg flex items-center justify-center overflow-hidden shrink-0">
              <img
                src="/pramaan-ai-logo.jpg"
                alt="Pramaan AI Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold font-heading text-blue-400 flex items-center gap-1.5 flex-wrap">
                {uiLabels.title}
                <span className="text-[10px] bg-blue-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-blue-500/40">
                  Full Website AI
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Gemini + Bhashini
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">{uiLabels.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* INDEPENDENT LANGUAGE SELECTOR FOR AGENT 2 */}
            <LanguageSelector currentLang={websiteAssistantLanguage} onSelectLanguage={handleSelectLanguage} compact={true} />
            <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-slate-950 p-1 rounded-2xl border border-blue-500/30 flex items-center justify-between text-xs font-bold font-mono">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'voice' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-md' : 'text-slate-400 hover:text-cyan-400'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{uiLabels.tabVoice}</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'chat' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-md' : 'text-slate-400 hover:text-cyan-400'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{uiLabels.tabChat}</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'guide' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-md' : 'text-slate-400 hover:text-cyan-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{uiLabels.tabGuide}</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'faq' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-md' : 'text-slate-400 hover:text-cyan-400'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{uiLabels.tabFaq}</span>
          </button>
        </div>

        {/* WEBSITE CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          <button onClick={() => { onNavigateTab && onNavigateTab('/'); onClose(); }} className="p-2 bg-slate-950 border border-blue-500/30 hover:border-blue-400 rounded-xl text-center space-y-0.5 cursor-pointer">
            <Home className="w-4 h-4 text-blue-400 mx-auto" />
            <div className="text-[10px] font-bold text-slate-200">{uiLabels.cardHome}</div>
          </button>
          <button onClick={() => { onNavigateTab && onNavigateTab('/about'); onClose(); }} className="p-2 bg-slate-950 border border-blue-500/30 hover:border-blue-400 rounded-xl text-center space-y-0.5 cursor-pointer">
            <FileText className="w-4 h-4 text-indigo-400 mx-auto" />
            <div className="text-[10px] font-bold text-slate-200">{uiLabels.cardAbout}</div>
          </button>
          <button onClick={() => { onNavigateTab && onNavigateTab('/standards'); onClose(); }} className="p-2 bg-slate-950 border border-blue-500/30 hover:border-blue-400 rounded-xl text-center space-y-0.5 cursor-pointer">
            <BookOpen className="w-4 h-4 text-amber-400 mx-auto" />
            <div className="text-[10px] font-bold text-slate-200">{uiLabels.cardStandards}</div>
          </button>
          <button onClick={() => { onNavigateTab && onNavigateTab('/verify'); onClose(); }} className="p-2 bg-slate-950 border border-blue-500/30 hover:border-blue-400 rounded-xl text-center space-y-0.5 cursor-pointer">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
            <div className="text-[10px] font-bold text-slate-200">{uiLabels.cardVerify}</div>
          </button>
          <button onClick={() => { onNavigateTab && onNavigateTab('/labs'); onClose(); }} className="p-2 bg-slate-950 border border-blue-500/30 hover:border-blue-400 rounded-xl text-center space-y-0.5 cursor-pointer">
            <Building2 className="w-4 h-4 text-cyan-400 mx-auto" />
            <div className="text-[10px] font-bold text-slate-200">{uiLabels.cardLabs}</div>
          </button>
          <button onClick={() => { onNavigateTab && onNavigateTab('/news'); onClose(); }} className="p-2 bg-slate-950 border border-blue-500/30 hover:border-blue-400 rounded-xl text-center space-y-0.5 cursor-pointer">
            <Newspaper className="w-4 h-4 text-purple-400 mx-auto" />
            <div className="text-[10px] font-bold text-slate-200">{uiLabels.cardNews}</div>
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'voice' && (
          <div className="flex flex-col items-center justify-center p-5 space-y-4 text-center bg-slate-950 rounded-2xl border border-slate-800">
            <div className="relative flex items-center justify-center py-2">
              <div className={`absolute w-32 h-32 rounded-full blur-xl transition-all ${
                voiceState === 'listening' ? 'bg-red-500/40 animate-ping' : voiceState === 'speaking' ? 'bg-cyan-500/40 animate-pulse' : 'bg-blue-500/20'
              }`}></div>
              <button
                onClick={() => voiceState === 'listening' ? handleStopListening() : handleStartListening()}
                className={`relative z-10 w-22 h-22 rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer ${
                  voiceState === 'listening' ? 'bg-red-500 text-white animate-pulse' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-bold hover:scale-105'
                }`}
              >
                {voiceState === 'listening' ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-xs font-mono font-bold text-cyan-400">
                {voiceState === 'listening' ? `🎙 Listening in ${websiteAssistantLanguage}...` : voiceState === 'speaking' ? `🔊 Bhashini TTS playing...` : `🎙 Tap Microphone (${websiteAssistantLanguage})`}
              </div>
              {voiceState === 'speaking' && (
                <button
                  onClick={handleStopAudio}
                  className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                >
                  ⏹ Stop
                </button>
              )}
            </div>

            {chatHistory.length > 0 && (
              <div className="w-full bg-slate-900 border border-blue-500/30 rounded-xl p-3 text-left space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold border-b border-slate-800 pb-1">
                  <span className="flex items-center gap-1.5">
                    🔊 Voice Response
                    {chatHistory[chatHistory.length - 1].detectedLang && (
                      <span className="bg-cyan-500/20 text-cyan-300 text-[9px] px-1.5 py-0.2 rounded uppercase">
                        {chatHistory[chatHistory.length - 1].detectedLang}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    {voiceState === 'speaking' && (
                      <button onClick={handleStopAudio} className="text-red-400 hover:text-red-300 text-[10px] flex items-center gap-0.5">
                        ⏹ Stop
                      </button>
                    )}
                    <button onClick={() => handleSpeakText(chatHistory[chatHistory.length - 1].text, chatHistory[chatHistory.length - 1].detectedLang)} className="hover:text-white flex items-center gap-1">
                      <Volume2 className="w-3 h-3" /> Replay Voice
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{chatHistory[chatHistory.length - 1].text}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-[320px] justify-between space-y-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1 mb-0.5 px-1 text-[9px] text-slate-400 font-mono">
                    <span>{msg.sender === 'user' ? 'You' : 'Website Assistant'}</span>
                    {msg.detectedLang && (
                      <span className="bg-slate-800 text-cyan-300 border border-cyan-500/30 px-1 rounded uppercase">
                        {msg.detectedLang}
                      </span>
                    )}
                  </div>
                  <div className={`p-2.5 rounded-2xl max-w-[90%] text-xs leading-relaxed ${
                    msg.sender === 'user' ? 'bg-blue-600 text-white font-medium rounded-tr-none' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white">
                <Upload className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Ask in ${websiteAssistantLanguage} (Home, Standards, Labs, News)...`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-sans"
              />
              <button onClick={() => handleSendMessage()} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl font-bold">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold text-blue-400 font-heading">BISNEXA Website Sitemap & Guide</h4>
            <div className="space-y-2 text-slate-300">
              <p><strong className="text-white">Home:</strong> Quality highlights, statistics, and quick shortcuts.</p>
              <p><strong className="text-white">About BIS:</strong> BIS Act 2016 statutory mandate, core pillars, and regional offices.</p>
              <p><strong className="text-white">Standards:</strong> 21,000+ IS codes, food, electronics, toy QCO, and helmet standards.</p>
              <p><strong className="text-white">Verify:</strong> Check CM/L numbers, Gold HUID hallmarks, and CRS registrations.</p>
              <p><strong className="text-white">BIS Labs:</strong> Search NABL & BIS accredited testing laboratories by location.</p>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-cyan-400 font-heading">Frequently Asked Questions</h4>
            <div className="space-y-2 text-slate-300">
              <div>
                <span className="font-bold text-white block">Q: How do I verify a gold HUID?</span>
                <span className="text-slate-400">A: Click 'Verify a Product' or 'Scan a mark' and enter the 6-character HUID code.</span>
              </div>
              <div>
                <span className="font-bold text-white block">Q: Can BISNEXA generate barcodes?</span>
                <span className="text-slate-400">A: Barcode generation is not available in the current visible interface.</span>
              </div>
            </div>
          </div>
        )}

        {/* POPULAR QUESTIONS */}
        <div className="pt-2 border-t border-slate-800 space-y-1.5">
          <span className="text-[11px] text-slate-400 font-medium block">{uiLabels.popularQuestions}</span>
          <div className="flex flex-wrap gap-1.5">
            {popularQuestions.map((pText, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSendMessage(pText)}
                className="text-[11px] bg-slate-950 hover:bg-slate-800 text-cyan-300 px-2.5 py-1 rounded-xl border border-blue-500/30 cursor-pointer truncate max-w-xs font-sans"
              >
                {pText}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
