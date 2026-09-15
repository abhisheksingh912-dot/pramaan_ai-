import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Mic, MicOff, Volume2, Sparkles, ShieldCheck, Newspaper, BookOpen, MapPin, CheckCircle2 } from 'lucide-react';
import { bisApiService } from '../services/apiService';
import { bhashiniService } from '../services/bhashiniService';
import { BIS_NEWS_ARTICLES } from '../data/bisNews';

export default function FloatingAiMascot({ currentLang, onNavigateTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('bis_floating_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        sender: 'assistant',
        text: 'Namaste! 🙏 I am your Ask BIS AI Agent. Ask me anything about IS standards, ISI mark verification, gold HUID, BIS news, or just say hi!'
      }
    ];
  });

  // Sync Floating Chat Memory to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('bis_floating_chat_history', JSON.stringify(chatMessages));
    } catch (e) {}
  }, [chatMessages]);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSending]);

  // Set up real browser speech recognition (falls back gracefully if unsupported)
  useEffect(() => {
    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionApi) {
      setVoiceSupported(false);
      return;
    }
    const recognition = new SpeechRecognitionApi();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQueryInput(transcript);
      setIsListening(false);
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    return () => {
      try { recognition.stop(); } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle Microphone Speech Recognition (real, using the Web Speech API)
  const handleToggleMic = () => {
    if (!voiceSupported || !recognitionRef.current) {
      setQueryInput("Voice input isn't supported in this browser — try Chrome, or just type your question 🙂");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        bhashiniService.stopAudio();
        recognitionRef.current.lang = currentLang || 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
        setQueryInput('Listening…');
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // Speak Response text using Bhashini / Web Speech API
  const speakResponse = (text) => {
    if (!text) return;
    setIsSpeaking(true);
    bhashiniService.playRegionalTTS(text, currentLang, () => {
      setIsSpeaking(false);
    });
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend || queryInput).trim();
    if (!text || isSending) return;

    const userMsg = { sender: 'user', text };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setQueryInput('');
    setIsSending(true);

    let reply = "";
    let categoryTag = "✨ Gemini AI Memory Response";

    try {
      // Query Gemini AI with Conversation History
      const geminiText = await bisApiService.queryGeminiAi(text, currentLang, updatedMessages);

      if (geminiText) {
        reply = geminiText;
      } else {
        // Fallback local RAG rules
        const lower = text.toLowerCase();
        const greetingWords = ['hello', 'hi', 'hey', 'namaste', 'namaskar', 'good morning', 'good afternoon', 'good evening', 'thanks', 'thank you', 'shukriya', 'dhanyavad', 'how are you', 'kaise ho', 'ok', 'okay', 'bye'];
        const isGreeting = greetingWords.some(g => lower.trim() === g || lower.trim().startsWith(g + ' ') || lower.trim().startsWith(g + ','));
        const bisKeywords = ['bis', 'standard', 'is ', 'is-', 'cml', 'cm/l', 'huid', 'isi', 'license', 'licence', 'mark', 'water', 'gold', 'hallmark', 'toy', 'lab', 'complaint', 'qco', 'gazette', 'news', 'certif', 'msme', 'product', 'verify', 'verification', 'scheme', 'nabl', 'crs', 'helmet', 'cement', 'steel', 'battery'];
        const isBisQuery = bisKeywords.some(k => lower.includes(k));

        if (isGreeting) {
          categoryTag = "Greeting";
          reply = "Namaste! 🙏 I'm your BIS AI Assistant — happy to help with IS codes, ISI mark checks, gold HUID hallmarking, CRS registration, nearby labs, complaints, or the latest BIS news. What's up?";
        } else if (!isBisQuery) {
          categoryTag = "Gently Redirecting";
          reply = "That's a bit outside my lane 😅 — I'm your go-to for BIS standards, ISI marks, hallmarking and product verification. Got a question along those lines?";
        } else if (lower.includes('news') || lower.includes('gazette') || lower.includes('ev battery') || lower.includes('notification')) {
          categoryTag = "BIS News & QCO Order";
          const latestNews = BIS_NEWS_ARTICLES[0];
          reply = `Here's the latest: ${latestNews.title} — issued by ${latestNews.source} on ${latestNews.date}. ${latestNews.summary}`;
        } else if (lower.includes('toy') || lower.includes('9873') || lower.includes('child')) {
          categoryTag = "IS 9873 Toy Safety QCO";
          reply = "Under IS 9873:2019, every toy sold in India needs the ISI mark. Small detachable parts and heavy metals like lead (over 90mg/kg) are strictly off-limits — good to keep in mind if you're checking a toy's safety!";
        } else if (lower.includes('huid') || lower.includes('gold') || lower.includes('hallmark')) {
          categoryTag = "Gold HUID Hallmarking";
          reply = "Gold jewellery needs a 6-character HUID hallmark under IS 1417:2016. The purity grades to look for are 22K (916), 18K (750), and 14K (585) — you can verify any HUID on our Verification tab.";
        } else if (lower.includes('water') || lower.includes('14544') || lower.includes('drinking')) {
          categoryTag = "IS 14544 Packaged Water";
          reply = "Packaged drinking water needs a BIS CM/L license under IS 14544:2016 — look for the 7-digit CM/L code near the ISI logo. It also has to meet pH (6.5–8.5) and TDS (<500mg/L) limits, with zero microbial contamination.";
        } else if (lower.includes('verify') || lower.includes('cml') || lower.includes('license')) {
          categoryTag = "License Verification";
          const cert = await bisApiService.verifyCertificate('CM/L-8765432');
          reply = `Checked CM/L-8765432 for you: ${cert.holderName} (${cert.product}) — status ${cert.status}, valid till ${cert.expiryDate}. Tested by ${cert.testingLab}.`;
        } else if (lower.includes('lab') || lower.includes('near') || lower.includes('testing')) {
          categoryTag = "BIS Recognized Labs";
          reply = "BIS runs 45+ NABL-accredited labs across India — Delhi NCR, Mumbai, Bengaluru, Chennai, Kolkata and more. Head to the 'Find BIS Labs' tab to find the closest one to you.";
        } else {
          reply = "I can help with Indian Standards, ISI mark checks, hallmarking, and BIS news — could you tell me a bit more about what you're looking for?";
        }
      }
    } catch (err) {
      console.warn('Ask BIS agent error:', err);
      reply = "Sorry, I hit a snag answering that. Mind trying again in a moment?";
    }

    setChatMessages((prev) => [...prev, { sender: 'assistant', text: reply, tag: categoryTag }]);
    setIsSending(false);
    speakResponse(reply);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Mascot Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center space-x-2 bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 text-slate-950 font-bold px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-amber-400">
            <Bot className="w-5 h-5 animate-bounce" />
          </div>
          <span className="text-xs font-heading font-extrabold pr-1">Ask BIS Voice AI</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        </button>
      )}

      {/* Floating Voice AI Chatbot Modal Box */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[500px] animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 p-3.5 text-slate-950 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-amber-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold font-heading flex items-center gap-1.5">
                  Ask BIS Voice AI Agent
                  {isSpeaking && <Volume2 className="w-3.5 h-3.5 text-slate-950 animate-pulse" />}
                </h4>
                <p className="text-[10px] opacity-90 font-mono">Gemini 3.6 & Bhashini Voice AI</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {isSpeaking && (
                <button
                  onClick={() => { bhashiniService.stopAudio(); setIsSpeaking(false); }}
                  className="text-[9px] bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded-full font-mono font-bold transition-colors cursor-pointer"
                >
                  ⏹ Stop
                </button>
              )}
              <button onClick={() => { bhashiniService.stopAudio(); setIsSpeaking(false); setIsOpen(false); }} className="p-1 rounded-full hover:bg-slate-950/20 cursor-pointer">
                <X className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
            {chatMessages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {m.tag && (
                  <span className="text-[9px] font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 mb-1">
                    {m.tag}
                  </span>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 text-slate-400 px-3 py-2 rounded-2xl rounded-tl-none w-fit">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Audio Wave Visualizer when listening */}
          {isListening && (
            <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Mic className="w-4 h-4 animate-pulse text-red-400" /> Listening in {currentLang}...
              </span>
              <div className="flex items-center space-x-1">
                <span className="w-1 bg-amber-400 rounded-full animate-wave-1"></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-wave-2"></span>
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-3"></span>
              </div>
            </div>
          )}

          {/* Quick Voice Suggestions Chips */}
          <div className="p-2 border-t border-slate-800 bg-slate-950 flex gap-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleSend("Tell me latest BIS news about EV batteries")}
              disabled={isSending}
              className="text-[10px] bg-slate-900 hover:bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg border border-slate-800 whitespace-nowrap disabled:opacity-40"
            >
              📰 EV Battery News
            </button>
            <button
              onClick={() => handleSend("Verify CM/L-8765432 water license")}
              disabled={isSending}
              className="text-[10px] bg-slate-900 hover:bg-slate-800 text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-800 whitespace-nowrap disabled:opacity-40"
            >
              🛡️ Verify CM/L-8765432
            </button>
            <button
              onClick={() => handleSend("What are the toy safety QCO rules?")}
              disabled={isSending}
              className="text-[10px] bg-slate-900 hover:bg-slate-800 text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-800 whitespace-nowrap disabled:opacity-40"
            >
              🧸 Toy Safety Rules
            </button>
          </div>

          {/* Input Box & Mic Controls */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <button
              onClick={handleToggleMic}
              disabled={isSending}
              className={`p-2 rounded-xl transition-all disabled:opacity-40 ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-900 text-amber-400 border border-slate-800 hover:border-amber-500/50'
              }`}
              title="Speak doubt via mic"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isSending}
              placeholder="Ask BIS AI news, doubts..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 disabled:opacity-60"
            />

            <button
              onClick={() => handleSend()}
              disabled={isSending || !queryInput.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 p-2 rounded-xl font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
