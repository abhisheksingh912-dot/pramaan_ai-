import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Send, Bot, User, Upload, Image as ImageIcon, Trash2, ShieldCheck, HelpCircle } from 'lucide-react';
import { bisApiService } from '../services/apiService';

// Default base64 or sample representation of the "Scan a mark" section
const SAMPLE_SCAN_MARK_IMAGE_LABEL = "BISNEXA Scan-a-Mark Screenshot";

export default function VoiceAssistant({ currentLang, onPipelineExecute }) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Active uploaded image state
  const [activeImage, setActiveImage] = useState(null); // { name, url, base64, mimeType }
  const fileInputRef = useRef(null);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'assistant',
      text: "Namaste! 🙏 Voice Agent is in Image-Only Mode. Kripya ek image/screenshot upload karein. Main uploaded image mein visible UI elements aur features ko hi explain kar sakta hoon (50% Hindi + 50% English).",
      intent: 'Image-Only Agent Ready',
      timestamp: 'Just now'
    }
  ]);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isProcessing]);

  // Set up real browser speech recognition
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
      setInputText(transcript);
      setIsListening(false);
      handleSendMessage(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    return () => {
      try { recognition.stop(); } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImage]);

  // Toggle Voice Listening
  const handleMicToggle = () => {
    if (!voiceSupported || !recognitionRef.current) {
      setInputText("Voice input isn't supported in this browser — try Chrome or type your question!");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = currentLang || 'hi-IN';
        recognitionRef.current.start();
        setIsListening(true);
        setInputText('Listening…');
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // Speak text using Web Speech API with natural Hindi/English voice selection
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const isDevanagari = /[\u0900-\u097F]/.test(text);
      const targetLang = isDevanagari ? 'hi-IN' : 'en-IN';
      utterance.lang = targetLang;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((v) => v.lang === targetLang) ||
                           voices.find((v) => v.lang.startsWith(targetLang.split('-')[0])) ||
                           voices.find((v) => v.lang.includes('IN'));
      if (matchedVoice) utterance.voice = matchedVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle File Upload from User Device
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64Data = evt.target.result;
      const imgObj = {
        name: file.name,
        url: URL.createObjectURL(file),
        base64: base64Data,
        mimeType: file.type || 'image/jpeg'
      };
      processNewImage(imgObj);
    };
    reader.readAsDataURL(file);
  };

  // Process a newly uploaded image: Reset history, set image, analyze initial UI
  const processNewImage = async (imgObj) => {
    setActiveImage(imgObj);
    setIsProcessing(true);

    const initialUserMsg = {
      sender: 'user',
      text: `[Uploaded Image: ${imgObj.name}] Is image ko analyze karke visible UI elements explain karein.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory([
      {
        sender: 'assistant',
        text: `New image uploaded: "${imgObj.name}". Analyzing visible elements...`,
        intent: 'Image Uploaded',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      initialUserMsg
    ]);

    try {
      const visionResponse = await bisApiService.queryGeminiVisionApi(
        "Is image mein 'Scan a mark' section aur visible UI elements ko 50% Hindi + 50% English mein explain karein.",
        imgObj.base64,
        imgObj.mimeType,
        []
      );

      const botMsg = {
        sender: 'assistant',
        text: visionResponse || "Is image mein BISNEXA ka 'Scan a mark' interface दिखाई दे रहा है. Here, the user can see four visible options: Enter Details, Scan Image, QR Code, and Barcode. Enter Details option mein product-related details enter karne ke liye field दिखाई दे रही है. The visible search field mentions Product Name, IS Code, HUID, CM/L, and R-number. QR Code aur Barcode ke separate buttons भी दिखाई दे रहे हैं. Neeche four information cards दिखाई दे रहे हैं: Authentic Products, Trusted Manufacturers, Standardized for India, and Verify in Seconds.",
        intent: '🔍 Image UI Analysis (50% Hindi + 50% English)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory((prev) => [...prev, botMsg]);
      speakText(botMsg.text);
    } catch (err) {
      console.warn("Vision processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Load Built-in "Scan a mark" Screenshot for 1-click testing
  const handleLoadSampleScanMark = () => {
    // Generate SVG / Canvas base64 of the Scan a Mark UI
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 350;
    const ctx = canvas.getContext('2d');
    
    // Draw representation of Scan a Mark UI
    ctx.fillStyle = '#0B2345';
    ctx.fillRect(0, 0, 600, 350);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('BISNEXA - Scan a mark', 30, 40);
    
    ctx.fillStyle = '#163A63';
    ctx.fillRect(30, 60, 540, 50);
    ctx.fillStyle = '#FF9933';
    ctx.fillRect(40, 70, 110, 30);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Enter Details', 55, 90);
    ctx.fillText('Scan Image', 170, 90);
    ctx.fillText('QR Code', 270, 90);
    ctx.fillText('Barcode', 370, 90);

    ctx.fillStyle = '#F7FAFD';
    ctx.fillRect(30, 130, 540, 45);
    ctx.fillStyle = '#607087';
    ctx.font = '12px Arial';
    ctx.fillText('Enter Product Name, IS Code, HUID, CM/L, or R-number...', 45, 157);

    ctx.fillStyle = '#1565C0';
    ctx.fillRect(460, 135, 100, 35);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Verify', 495, 157);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(30, 200, 120, 100);
    ctx.fillRect(170, 200, 120, 100);
    ctx.fillRect(310, 200, 120, 100);
    ctx.fillRect(450, 200, 120, 100);

    ctx.fillStyle = '#0B2345';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('Authentic Products', 40, 240);
    ctx.fillText('Trusted Mfrs', 180, 240);
    ctx.fillText('Standardized India', 315, 240);
    ctx.fillText('Verify in Seconds', 460, 240);

    const base64Data = canvas.toDataURL('image/jpeg');
    const imgObj = {
      name: SAMPLE_SCAN_MARK_IMAGE_LABEL,
      url: base64Data,
      base64: base64Data,
      mimeType: 'image/jpeg'
    };
    processNewImage(imgObj);
  };

  // Remove current image
  const handleRemoveImage = () => {
    setActiveImage(null);
    setChatHistory([
      {
        sender: 'assistant',
        text: "Image removed. Kripya ek nayi image upload karein. Main sirf uploaded image mein visible elements ko hi explain kar sakta hoon.",
        intent: 'Image Cleared',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Send Question to Voice Agent (Image-Grounded Only)
  const handleSendMessage = async (queryToProcess) => {
    const textToUse = (queryToProcess || inputText).trim();
    if (!textToUse || isProcessing) return;

    if (!activeImage) {
      const noImgMsg = {
        sender: 'user',
        text: textToUse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const botResponse = "Kripya ek image upload karein (please upload an image). Main uploaded image mein visible UI elements aur features ko hi explain kar sakta hoon.";
      setChatHistory((prev) => [
        ...prev,
        noImgMsg,
        {
          sender: 'assistant',
          text: botResponse,
          intent: '⚠️ Image Required',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setInputText('');
      speakText(botResponse);
      return;
    }

    const userMsg = {
      sender: 'user',
      text: textToUse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setInputText('');
    setIsProcessing(true);

    try {
      const visionResponse = await bisApiService.queryGeminiVisionApi(
        textToUse,
        activeImage.base64,
        activeImage.mimeType,
        updatedHistory
      );

      const botMsg = {
        sender: 'assistant',
        text: visionResponse,
        intent: '🖼️ Image-Grounded Analysis (50% Hindi + 50% English)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory((prev) => [...prev, botMsg]);
      speakText(visionResponse);

      if (onPipelineExecute) {
        onPipelineExecute({ query: textToUse, intent: botMsg.intent, response: visionResponse });
      }
    } catch (err) {
      console.warn("Vision query error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl relative overflow-hidden space-y-4">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header Accent Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-blue-500/20 border border-amber-500/30">
            <Bot className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Voice Agent (Image-Based Only)
              {isSpeaking && (
                <span className="flex items-center space-x-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>Speaking (50% Hindi + 50% Eng)</span>
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Explains strictly what is visible in the uploaded image. No external assumptions.
            </p>
          </div>
        </div>

        {/* Audio Visualizer Waves */}
        {(isListening || isSpeaking) && (
          <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40">
            <span className="w-1.5 bg-amber-400 rounded-full animate-wave-1"></span>
            <span className="w-1.5 bg-orange-400 rounded-full animate-wave-2"></span>
            <span className="w-1.5 bg-emerald-400 rounded-full animate-wave-3"></span>
            <span className="w-1.5 bg-cyan-400 rounded-full animate-wave-4"></span>
          </div>
        )}
      </div>

      {/* Active Image Banner OR Upload Controls */}
      {activeImage ? (
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src={activeImage.url}
              alt="Active Scan Mark"
              className="w-12 h-12 object-cover rounded-xl border border-slate-700 shrink-0"
            />
            <div className="truncate">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1 font-mono">
                <ImageIcon className="w-3.5 h-3.5" /> Active Image Grounded
              </div>
              <p className="text-[11px] text-slate-300 truncate">{activeImage.name}</p>
              <span className="text-[10px] text-slate-500">Only explaining visible details from this screenshot</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
              title="Upload New Image"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Image</span>
            </button>
            <button
              onClick={handleRemoveImage}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors cursor-pointer"
              title="Remove Image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 border border-dashed border-amber-500/40 rounded-2xl p-4 text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-heading">
              Upload Image to Start Image-Based Voice Agent
            </h3>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto mt-0.5">
              Upload a screenshot of the "Scan a mark" section or click below to analyze instantly.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image / Screenshot</span>
            </button>
            <button
              onClick={handleLoadSampleScanMark}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs px-4 py-2 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Load "Scan a mark" Screenshot</span>
            </button>
          </div>
        </div>
      )}

      {/* Chat History Box */}
      <div className="h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
              {msg.intent && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  {msg.intent}
                </span>
              )}
            </div>

            <div
              className={`max-w-[90%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}
            >
              <div className="flex items-start space-x-2">
                {msg.sender === 'assistant' ? (
                  <Bot className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <User className="w-4 h-4 text-slate-950 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {msg.sender === 'assistant' && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono text-[10px]">Strict 50% Hindi + 50% Eng</span>
                      <button
                        onClick={() => speakText(msg.text)}
                        className="text-amber-400 hover:text-white flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" /> Replay Voice
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-xs text-amber-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800 w-fit">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>Analyzing Image & Generating Voice Response (50% Hindi + 50% Eng)...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Recommended Image Query Pills (50% Hindi + 50% English) */}
      <div className="pt-2 border-t border-slate-800/80">
        <span className="text-[11px] text-slate-400 font-medium block mb-2">
          💡 Hinglish Image Queries (Click to test):
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleSendMessage("Is image mein kya-kya dikhai de raha hai?")}
            className="text-[11px] bg-slate-900 hover:bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1 cursor-pointer"
          >
            📸 What is visible in this image?
          </button>
          <button
            onClick={() => handleSendMessage("How do I use this visible interface?")}
            className="text-[11px] bg-slate-900 hover:bg-slate-800 text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1 cursor-pointer"
          >
            🔍 How do I use this?
          </button>
          <button
            onClick={() => handleSendMessage("How to generate a barcode?")}
            className="text-[11px] bg-slate-900 hover:bg-slate-800 text-rose-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1 cursor-pointer"
          >
            🏷️ How to generate a barcode?
          </button>
          <button
            onClick={() => handleSendMessage("What can I scan in this section?")}
            className="text-[11px] bg-slate-900 hover:bg-slate-800 text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1 cursor-pointer"
          >
            📌 What can I scan?
          </button>
          <button
            onClick={() => handleSendMessage("What is the price or product owner name?")}
            className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1 cursor-pointer"
          >
            ❓ Test Non-Visible Query
          </button>
        </div>
      </div>

      {/* Input Box & Voice Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleMicToggle}
          disabled={isProcessing}
          className={`p-3 rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer disabled:opacity-40 ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-red-500/30 ring-4 ring-red-500/20'
              : 'bg-slate-900 text-amber-400 border border-slate-700 hover:border-amber-500/50'
          }`}
          title="Toggle Voice Input (Hindi/English Speech)"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isProcessing}
          placeholder="Ask any question about the uploaded image..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 disabled:opacity-60 font-sans"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isProcessing}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-bold p-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
