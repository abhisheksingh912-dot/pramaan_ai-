import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Volume2, Copy, Check, Upload, Image as ImageIcon, Trash2, Mic, MicOff, Sparkles } from 'lucide-react';

export default function ChatAgentView({
  chatHistory,
  isProcessing,
  inputText,
  setInputText,
  activeImage,
  onSendMessage,
  onUploadImage,
  onRemoveImage,
  onReplayVoice,
  onMicToggle,
  isListening
}) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isProcessing]);

  const handleCopyText = (text, idx) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (e) {}
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      onUploadImage({
        name: file.name,
        url: URL.createObjectURL(file),
        base64: evt.target.result,
        mimeType: file.type || 'image/jpeg'
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-[400px] sm:h-[440px] justify-between animate-in fade-in space-y-3">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Active Image Thumbnail Banner */}
      {activeImage && (
        <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-2 px-3 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center space-x-2 truncate">
            <img src={activeImage.url} alt="Attached" className="w-8 h-8 object-cover rounded-lg border border-slate-700 shrink-0" />
            <div className="truncate text-xs">
              <span className="text-amber-400 font-bold font-mono block truncate">{activeImage.name}</span>
              <span className="text-[10px] text-slate-400">Attached for Image Grounding</span>
            </div>
          </div>
          <button
            onClick={onRemoveImage}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Remove Attached Image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Message History List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp || 'Just now'}</span>
              {msg.intent && (
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {msg.intent}
                </span>
              )}
            </div>

            <div
              className={`max-w-[88%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}
            >
              <div className="flex items-start space-x-2">
                {msg.sender === 'assistant' ? (
                  <Bot className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <User className="w-4 h-4 text-slate-950 shrink-0 mt-0.5" />
                )}
                <div className="w-full space-y-2">
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Actions for Assistant Bubbles */}
                  {msg.sender === 'assistant' && (
                    <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-800/80 text-[11px]">
                      <button
                        onClick={() => onReplayVoice(msg.text)}
                        className="text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Read Aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                      <button
                        onClick={() => handleCopyText(msg.text, idx)}
                        className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Copy Text"
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Animation Indicator */}
        {isProcessing && (
          <div className="flex items-center space-x-2 text-xs text-amber-400 bg-slate-950 p-3 rounded-2xl border border-slate-800 w-fit">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>BISNEXA AI is typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar with File Upload & Mic Controls */}
      <div className="pt-2 border-t border-slate-800 flex items-center space-x-2 shrink-0">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
          title="Upload Screenshot / Image for Visual Grounding"
        >
          <Upload className="w-4 h-4" />
        </button>

        <button
          onClick={onMicToggle}
          disabled={isProcessing}
          className={`p-2.5 rounded-xl transition-colors cursor-pointer border ${
            isListening
              ? 'bg-red-500 text-white animate-pulse border-red-500'
              : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-amber-400'
          }`}
          title="Toggle Voice Input"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
          disabled={isProcessing}
          placeholder="Ask AI anything about BISNEXA..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />

        <button
          onClick={() => onSendMessage()}
          disabled={!inputText.trim() || isProcessing}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold p-2.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
