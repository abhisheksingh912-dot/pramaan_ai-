// Bhashini Integration Service (Project Bhashini / National Language Translation Mission, MeitY, Govt of India)
// Handles regional language detection, Neural Machine Translation (NMT), and Text-to-Speech (TTS)

const BHASHINI_API_KEY = import.meta.env.VITE_BHASHINI_API_KEY || "mbUTAQlipSvFRHGr6nzTPdnGNJKn0dbNoWmIh8Ql9g1CVTRSA4r8FcGvKfE761gm".trim();
const DHRUVA_INFERENCE_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline";

// Script-to-Language heuristics for fast, zero-latency detection of Indian scripts
const SCRIPT_RANGES = [
  { name: 'Devanagari', lang: 'hi', subLangs: ['hi', 'mr', 'ne', 'sa'], regex: /[\u0900-\u097F]/ },
  { name: 'Bengali', lang: 'bn', subLangs: ['bn', 'as'], regex: /[\u0980-\u09FF]/ },
  { name: 'Gurmukhi', lang: 'pa', subLangs: ['pa'], regex: /[\u0A00-\u0A7F]/ },
  { name: 'Gujarati', lang: 'gu', subLangs: ['gu'], regex: /[\u0A80-\u0AFF]/ },
  { name: 'Odia', lang: 'or', subLangs: ['or'], regex: /[\u0B00-\u0B7F]/ },
  { name: 'Tamil', lang: 'ta', subLangs: ['ta'], regex: /[\u0B80-\u0BFF]/ },
  { name: 'Telugu', lang: 'te', subLangs: ['te'], regex: /[\u0C00-\u0C7F]/ },
  { name: 'Kannada', lang: 'kn', subLangs: ['kn'], regex: /[\u0C80-\u0CFF]/ },
  { name: 'Malayalam', lang: 'ml', subLangs: ['ml'], regex: /[\u0D00-\u0D7F]/ },
  { name: 'Arabic/Urdu', lang: 'ur', subLangs: ['ur', 'ks', 'sd'], regex: /[\u0600-\u06FF\u0750-\u077F]/ }
];

// Common Marathi distinctive marker words
const MARATHI_MARKERS = ['आहे', 'नाही', 'करा', 'कसे', 'काय', 'म्हणजे', 'बघ', 'तपासा', 'पडताळणी', 'दाखवा', 'सांगा', 'झाले', 'द्या'];

// Common Hindi distinctive marker words
const HINDI_MARKERS = ['है', 'नहीं', 'करो', 'करें', 'कैसे', 'क्या', 'मतलब', 'देखो', 'जांचें', 'सत्यापित', 'बताओ', 'दीजिए', 'हुआ', 'होगी'];

class BhashiniService {
  constructor() {
    this.apiKey = BHASHINI_API_KEY;
    this.translationCache = new Map();
    this.audioCache = new Map();
    this.currentAudio = null;
  }

  /**
   * Fast & robust language detection for Indian languages and English.
   * Returns Bhashini/ISO language code (e.g. 'hi', 'mr', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 'ur', 'en').
   */
  detectLanguage(text) {
    if (!text || typeof text !== 'string') return 'en';
    const trimmed = text.trim();
    if (!trimmed) return 'en';

    // 1. Check Indian script Unicode blocks
    for (const item of SCRIPT_RANGES) {
      if (item.regex.test(trimmed)) {
        if (item.name === 'Devanagari') {
          // Distinguish Marathi vs Hindi by vocabulary markers
          const words = trimmed.split(/\s+/);
          const hasMarathi = words.some((w) => MARATHI_MARKERS.includes(w));
          if (hasMarathi) return 'mr';
          return 'hi';
        }
        return item.lang;
      }
    }

    // 2. Check for Romanized Indian phrases (Hinglish/Tanglish/Manglish)
    const lower = trimmed.toLowerCase();
    const hinglishMarkers = ['kya', 'kaise', 'batao', 'hai', 'kare', 'karna', 'karo', 'mujhe', 'chahiye', 'kaha', 'dikhao', 'karein', 'aaj', 'kal', 'namaste', 'shukriya'];
    if (hinglishMarkers.some((m) => lower.includes(` ${m} `) || lower.startsWith(`${m} `) || lower.endsWith(` ${m}`) || lower === m)) {
      return 'hi-Latn'; // Hinglish
    }

    const marathiRomanMarkers = ['kay', 'kasa', 'sanga', 'aahe', 'dakhva', 'bagha', 'karayche', 'kuthe'];
    if (marathiRomanMarkers.some((m) => lower.includes(` ${m} `) || lower.startsWith(`${m} `) || lower.endsWith(` ${m}`) || lower === m)) {
      return 'mr-Latn';
    }

    return 'en';
  }

  /**
   * Get clean 2-letter language code from any locale string like 'hi-IN' -> 'hi'
   */
  normalizeLangCode(code) {
    if (!code) return 'en';
    const clean = code.split('-')[0].toLowerCase();
    return clean;
  }

  /**
   * Neural Machine Translation via Bhashini IndicTrans2 (ai4bharat/indictrans-v2-all-gpu--t4)
   * With memory caching and fallback.
   */
  async translateText(text, targetLang = 'hi', sourceLang = 'en') {
    if (!text || !text.trim()) return text;
    const sLang = this.normalizeLangCode(sourceLang);
    const tLang = this.normalizeLangCode(targetLang);

    if (sLang === tLang) return text;

    const cacheKey = `${sLang}_${tLang}_${text.trim()}`;
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey);
    }

    try {
      const response = await fetch(DHRUVA_INFERENCE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey
        },
        body: JSON.stringify({
          pipelineTasks: [
            {
              taskType: 'translation',
              config: {
                language: {
                  sourceLanguage: sLang,
                  targetLanguage: tLang
                },
                serviceId: 'ai4bharat/indictrans-v2-all-gpu--t4'
              }
            }
          ],
          inputData: {
            input: [{ source: text }]
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const translated = data?.pipelineResponse?.[0]?.output?.[0]?.target;
        if (translated && translated.trim()) {
          this.translationCache.set(cacheKey, translated.trim());
          return translated.trim();
        }
      }
    } catch (err) {
      console.warn('Bhashini NMT fetch notice:', err);
    }

    return text;
  }

  /**
   * Text-to-Speech via Bhashini IndicTTS (ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4)
   * Streams crystal-clear regional Indian voices.
   */
  async playRegionalTTS(text, langCode = 'hi-IN', onEndCallback) {
    const lang = this.normalizeLangCode(langCode);

    // Stop currently playing audio
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio = null;
      } catch (e) {}
    }

    // Languages supported by Indo-Aryan & Dravidian Bhashini TTS models
    const supportedTtsLangs = ['hi', 'mr', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'pa', 'or'];

    if (supportedTtsLangs.includes(lang) && text && text.trim().length <= 500) {
      try {
        const serviceId = ['ta', 'te', 'kn', 'ml'].includes(lang)
          ? 'ai4bharat/indic-tts-coqui-dravidian-gpu--t4'
          : 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4';

        const cleanText = text.replace(/[*#_`]/g, '').slice(0, 350);

        const response = await fetch(DHRUVA_INFERENCE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.apiKey
          },
          body: JSON.stringify({
            pipelineTasks: [
              {
                taskType: 'tts',
                config: {
                  language: { sourceLanguage: lang },
                  serviceId: serviceId,
                  gender: 'female'
                }
              }
            ],
            inputData: {
              input: [{ source: cleanText }]
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const base64Audio = data?.pipelineResponse?.[0]?.audio?.[0]?.audioContent;
          if (base64Audio) {
            const audioSrc = `data:audio/wav;base64,${base64Audio}`;
            const audio = new Audio(audioSrc);
            this.currentAudio = audio;
            audio.onended = () => {
              this.currentAudio = null;
              if (onEndCallback) onEndCallback();
            };
            audio.onerror = () => {
              this.currentAudio = null;
              this.fallbackBrowserTTS(text, langCode, onEndCallback);
            };
            await audio.play();
            return true;
          }
        }
      } catch (err) {
        console.warn('Bhashini TTS notice, falling back to browser speech synthesis:', err);
      }
    }

    // Fallback to browser Web Speech Synthesis
    return this.fallbackBrowserTTS(text, langCode, onEndCallback);
  }

  /**
   * Browser Speech Synthesis fallback
   */
  fallbackBrowserTTS(text, langCode = 'hi-IN', onEndCallback) {
    if (!('speechSynthesis' in window)) {
      if (onEndCallback) onEndCallback();
      return false;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const isDevanagari = /[\u0900-\u097F]/.test(cleanText);
    const targetLang = isDevanagari ? (langCode.startsWith('mr') ? 'mr-IN' : 'hi-IN') : langCode;
    utterance.lang = targetLang;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang === targetLang) ||
      voices.find((v) => v.lang.startsWith(targetLang.split('-')[0])) ||
      voices.find((v) => v.lang.includes('IN'));

    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };
    utterance.onerror = () => {
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  }

  stopAudio() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio = null;
      } catch (e) {}
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }
}

export const bhashiniService = new BhashiniService();
export default bhashiniService;
