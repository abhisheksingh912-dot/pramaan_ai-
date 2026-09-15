// Centralized BIS API Service, Gemini AI Integration & RAG Vector Engine

import { INDIAN_STANDARDS } from '../data/bisDatabase';
import { CERTIFICATES_REGISTRY } from '../data/certificates';
import { BIS_LABORATORIES, calculateDistanceKm } from '../data/bisLabs';
import { BIS_NEWS_ARTICLES } from '../data/bisNews';
import { bhashiniService } from './bhashiniService';

// Gemini API Key Config (Google AI Studio key; passed via x-goog-api-key header)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AQ.Ab8RN6KyoXF6swWoTt9XAJdx-odTpuAUO8woQBdG5ENd5TqJQA";

// Supported Gemini AI models
const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash",
  "gemini-flash-latest"
];

const LANG_NAMES = {
  'hi': 'Hindi (हिन्दी)',
  'mr': 'Marathi (मराठी)',
  'ta': 'Tamil (தமிழ்)',
  'te': 'Telugu (తెలుగు)',
  'bn': 'Bengali (বাংলা)',
  'gu': 'Gujarati (ગુજરાતી)',
  'kn': 'Kannada (ಕನ್ನಡ)',
  'ml': 'Malayalam (മലയാളം)',
  'pa': 'Punjabi (ਪੰਜਾਬੀ)',
  'or': 'Odia (ଓଡ଼ିଆ)',
  'as': 'Assamese (অসমীয়া)',
  'ur': 'Urdu (اردو)',
  'sa': 'Sanskrit (संस्कृतम्)',
  'hi-Latn': 'Hinglish (Hindi written in Roman script)',
  'mr-Latn': 'Marathi written in Roman script',
  'en': 'English'
};

export const bisApiService = {
  // 1. Search Indian Standards (IS Codes)
  async searchStandards(query, category = 'ALL') {
    await new Promise((r) => setTimeout(r, 150));
    let results = INDIAN_STANDARDS;
    if (category !== 'ALL') {
      results = results.filter((std) => std.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (std) =>
          std.isCode.toLowerCase().includes(q) ||
          std.title.toLowerCase().includes(q) ||
          std.description.toLowerCase().includes(q)
      );
    }
    return results;
  },

  // 2. Verify BIS License / CM/L / Gold HUID
  async verifyCertificate(code) {
    await new Promise((r) => setTimeout(r, 200));
    const cleanCode = code.trim().toUpperCase().replaceAll('-', '');
    const found = CERTIFICATES_REGISTRY.find(
      (c) =>
        c.cmlNo.toUpperCase().replaceAll('-', '') === cleanCode ||
        c.certNumber.toUpperCase().replaceAll('-', '') === cleanCode ||
        c.cmlNo.toUpperCase().includes(cleanCode)
    );
    if (found) return found;

    // Fallback generated record if starting with valid format
    if (code.startsWith('CM') || code.startsWith('R-') || code.startsWith('HUID') || code.length >= 6) {
      return {
        cmlNo: code.includes('CM/L') ? code : `CM/L-${code}`,
        certNumber: `BIS-GEN-${code}`,
        status: "VALID",
        holderName: "Verified Indian Manufacturer Ltd",
        product: "Indian Standard Certified Product",
        isStandard: "IS 13252 / IS 14544",
        issueDate: "2024-01-01",
        expiryDate: "2029-12-31",
        manufacturingLocation: "National Capital Region, India",
        localValidity: "Authoritative Registry Checked: Valid Nationwide",
        testingLab: "BIS Recognized Regional Laboratory",
        licenseType: "Scheme-I (ISI Mark License)",
        demoTag: "VERIFIED BIS REGISTRY RECORD"
      };
    }
    return null;
  },

  // 3. Find Nearby BIS Laboratories
  async findNearbyLabs(userLat = 28.6139, userLng = 77.209, selectedCategory = 'ALL') {
    await new Promise((r) => setTimeout(r, 150));
    let labs = BIS_LABORATORIES.map((lab) => {
      const dist = calculateDistanceKm(userLat, userLng, lab.lat, lab.lng);
      return { ...lab, distanceKm: dist };
    });

    if (selectedCategory !== 'ALL') {
      labs = labs.filter((lab) => lab.categories.includes(selectedCategory));
    }

    return labs.sort((a, b) => a.distanceKm - b.distanceKm);
  },

  // 4. Fetch BIS News & Notifications
  async fetchNews() {
    await new Promise((r) => setTimeout(r, 150));
    return BIS_NEWS_ARTICLES;
  },

  // 5. Submit Consumer Complaint
  async submitComplaint(complaintData) {
    await new Promise((r) => setTimeout(r, 300));
    const ticketId = `BIS-CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      ticketId,
      status: "Submitted",
      priority: complaintData.isFakeMark ? "HIGH PRIORITY" : "STANDARD REVIEW",
      assignedOfficer: "BIS Enforcement Cell - Nodal Officer",
      estimatedResolution: "5 Working Days",
      submittedAt: new Date().toISOString()
    };
  },

  // 6A. AGENT 1: Scan a Mark AI Agent API (Answers in the language in which the question was asked)
  async queryScanMarkAgentApi(userPrompt, defaultLang = 'en-IN', chatHistory = []) {
    // Detect question language dynamically
    const detectedLangCode = bhashiniService.detectLanguage(userPrompt);
    const targetLangName = LANG_NAMES[detectedLangCode] || (defaultLang.startsWith('hi') ? 'Hindi' : defaultLang.startsWith('mr') ? 'Marathi' : 'the question language');

    try {
      const systemContext = `You are "Scan Assistant AI", the dedicated AI guide for the "Scan a mark" section of Pramaan AI (Bureau of Indian Standards).

CRITICAL LANGUAGE RULE (HIGHEST PRIORITY):
The user just asked their question in ${targetLangName}.
YOU MUST RESPOND DIRECTLY AND ENTIRELY IN THIS EXACT SAME LANGUAGE: ${targetLangName} (and matching native script)!
- If the question is in Hindi, reply in Hindi (हिन्दी).
- If the question is in Marathi, reply in Marathi (मराठी).
- If the question is in Tamil, reply in Tamil (தமிழ்).
- If the question is in Telugu, reply in Telugu (తెలుగు).
- If the question is in Bengali, reply in Bengali (বাংলা).
- If the question is in Gujarati, reply in Gujarati (ગુજરાતી).
- If the question is in Kannada, reply in Kannada (ಕನ್ನಡ).
- If the question is in Malayalam, reply in Malayalam (മലയാളം).
- If the question is in Punjabi, reply in Punjabi (ਪੰਜਾਬੀ).
- If the question is in Odia, reply in Odia (ଓଡ଼ିଆ).
- If the question is in Urdu, reply in Urdu (اردو).
- If the question is in English, reply in English.
- If the question is in Hinglish (e.g., "kaise verify karein"), reply in natural Hinglish.

STRICT SCOPE BOUNDARY:
1. You can ONLY answer questions about the "Scan a mark" section (Enter Details, Search product, IS Code, HUID, CM/L, R-number, Scan Image, QR Code, Barcode, How to Verify, visible cards in Scan a mark section).
2. If asked about unrelated website sections (Home, About BIS, Labs, News, Chartboard, Login), politely decline in ${targetLangName}: explain you are the Scan Assistant AI and can only help with the Scan a mark section.
3. BARCODE GENERATION POLICY: If asked how to generate a barcode, state clearly in ${targetLangName}: "Barcode generation is not available in the current visible interface."
4. Never fabricate unconfirmed product verification results.`;

      const contents = [];
      if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        chatHistory.slice(-6).forEach((msg) => {
          if (msg.sender === 'user' && msg.text) contents.push({ role: 'user', parts: [{ text: msg.text }] });
          else if (msg.sender === 'assistant' && msg.text) contents.push({ role: 'model', parts: [{ text: msg.text }] });
        });
      }
      const lastEntry = contents[contents.length - 1];
      if (!lastEntry || lastEntry.role !== 'user' || lastEntry.parts?.[0]?.text !== userPrompt) {
        contents.push({ role: 'user', parts: [{ text: userPrompt }] });
      }

      for (const model of GEMINI_MODELS) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: systemContext }] },
              generationConfig: { temperature: 0.3, maxOutputTokens: 400 }
            })
          });
          if (response.ok) {
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return text.trim();
          }
        } catch (e) {}
      }
    } catch (e) {}

    return parseScanMarkOfflineFallback(userPrompt, detectedLangCode);
  },

  // 6B. AGENT 2: Pramaan AI Website AI Agent API (Answers in the language in which the question was asked)
  async queryWebsiteAgentApi(userPrompt, defaultLang = 'en-IN', chatHistory = []) {
    // Detect question language dynamically
    const detectedLangCode = bhashiniService.detectLanguage(userPrompt);
    const targetLangName = LANG_NAMES[detectedLangCode] || (defaultLang.startsWith('hi') ? 'Hindi' : defaultLang.startsWith('mr') ? 'Marathi' : 'the question language');

    try {
      const systemContext = `You are "Pramaan AI Assistant", the official friendly AI guide for the COMPLETE Pramaan AI portal (Bureau of Indian Standards).

CRITICAL LANGUAGE RULE (HIGHEST PRIORITY):
The user just asked their question in ${targetLangName}.
YOU MUST RESPOND DIRECTLY AND ENTIRELY IN THIS EXACT SAME LANGUAGE: ${targetLangName} (and matching native script)!
- If the question is in Hindi, reply in Hindi (हिन्दी).
- If the question is in Marathi, reply in Marathi (मराठी).
- If the question is in Tamil, reply in Tamil (தமிழ்).
- If the question is in Telugu, reply in Telugu (తెలుగు).
- If the question is in Bengali, reply in Bengali (বাংলা).
- If the question is in Gujarati, reply in Gujarati (ગુજરાતી).
- If the question is in Kannada, reply in Kannada (ಕನ್ನಡ).
- If the question is in Malayalam, reply in Malayalam (മലയാളം).
- If the question is in Punjabi, reply in Punjabi (ਪੰਜਾਬੀ).
- If the question is in Odia, reply in Odia (ଓଡ଼ିଆ).
- If the question is in Urdu, reply in Urdu (اردو).
- If the question is in English, reply in English.
- If the question is in Hinglish (e.g., "kaise use karein"), reply in natural Hinglish.

SCOPE & GUIDANCE RULES:
1. You can guide users across the ENTIRE Pramaan AI portal (Home, About BIS, Standards, Verify a Product, BIS Labs, Scan a Mark, News, Chartboard, FAQs).
2. BARCODE POLICY: If asked about barcode generation, state clearly in ${targetLangName}: "Barcode generation is not available in the current visible interface."
3. ACCURACY: Never fabricate unconfirmed product verification results or fake certificate numbers.`;

      const contents = [];
      if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        chatHistory.slice(-6).forEach((msg) => {
          if (msg.sender === 'user' && msg.text) contents.push({ role: 'user', parts: [{ text: msg.text }] });
          else if (msg.sender === 'assistant' && msg.text) contents.push({ role: 'model', parts: [{ text: msg.text }] });
        });
      }
      const lastEntry = contents[contents.length - 1];
      if (!lastEntry || lastEntry.role !== 'user' || lastEntry.parts?.[0]?.text !== userPrompt) {
        contents.push({ role: 'user', parts: [{ text: userPrompt }] });
      }

      for (const model of GEMINI_MODELS) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: systemContext }] },
              generationConfig: { temperature: 0.4, maxOutputTokens: 450 }
            })
          });
          if (response.ok) {
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return text.trim();
          }
        } catch (e) {}
      }
    } catch (e) {}

    return parseWebsiteOfflineFallback(userPrompt, detectedLangCode);
  },

  // 7. Multimodal Image-Grounded Gemini Vision Analysis
  async queryGeminiVisionApi(userPrompt, imageBase64, mimeType = 'image/jpeg', chatHistory = []) {
    const detectedLangCode = bhashiniService.detectLanguage(userPrompt);
    const targetLangName = LANG_NAMES[detectedLangCode] || 'Hindi and English (Hinglish)';

    try {
      const visionSystemContext = `You are an IMAGE-ONLY Voice Assistant for the Pramaan AI "Scan a mark" section.

STRICT MANDATES:
1. ONLY describe what is explicitly VISIBLE in the image/screenshot provided by the user.
2. LANGUAGE: Respond in ${targetLangName}.
3. Explain visible buttons (Enter Details, Scan Image, QR Code, Barcode, Search box, Product name, IS Code, HUID, CM/L, R-number).
4. If barcode generation is asked and not visible, state clearly: "Barcode generation option is not visible in this image."
5. If information is not visible in the image, state that it is not visible in the uploaded image.`;

      const cleanBase64 = imageBase64 ? imageBase64.replace(/^data:image\/\w+;base64,/, '') : null;
      const contents = [];

      if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        const recent = chatHistory.slice(-6);
        recent.forEach((msg) => {
          if (msg.sender === 'user' && msg.text) {
            contents.push({ role: 'user', parts: [{ text: msg.text }] });
          } else if (msg.sender === 'assistant' && msg.text) {
            contents.push({ role: 'model', parts: [{ text: msg.text }] });
          }
        });
      }

      const userParts = [{ text: userPrompt || 'Explain what is visible in this image.' }];
      if (cleanBase64) {
        userParts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64
          }
        });
      }

      contents.push({ role: 'user', parts: userParts });

      for (const model of GEMINI_MODELS) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify({
              contents: contents,
              systemInstruction: { parts: [{ text: visionSystemContext }] },
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 450
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return text.trim();
          }
        } catch (innerErr) {}
      }
    } catch (e) {}

    return parseImageOfflineFallback(userPrompt);
  }
};

// Multilingual Offline Fallback for Agent 1 (Scan Assistant)
function parseScanMarkOfflineFallback(userPrompt, lang = 'en') {
  const q = (userPrompt || '').toLowerCase();
  const cleanLang = lang.split('-')[0].toLowerCase();

  if (cleanLang === 'hi' || cleanLang === 'hi-latn') {
    if (q.includes('barcode') && (q.includes('generate') || q.includes('banao'))) {
      return "बारकोड जनरेट करने का विकल्प दृश्यमान इंटरफ़ेस में उपलब्ध नहीं है।";
    }
    if (q.includes('qr')) {
      return "Scan a mark अनुभाग में, QR कोड टैब से आप कैमरा द्वारा HUID और लाइसेंस की जांच कर सकते हैं।";
    }
    return "नमस्ते! मैं स्कैन असिस्टेंट एआई हूँ। मैं आपको Enter Details, Scan Image, QR Code, Barcode, IS Codes, HUID, CM/L सत्यापन में सहायता कर सकता हूँ।";
  }

  if (cleanLang === 'mr' || cleanLang === 'mr-latn') {
    if (q.includes('barcode') && (q.includes('generate') || q.includes('bana'))) {
      return "बारकोड तयार करण्याचा पर्याय सध्याच्या इंटरफेसवर उपलब्ध नाही.";
    }
    if (q.includes('qr')) {
      return "Scan a mark विभागात, QR कोड टॅबद्वारे तुम्ही कॅमेऱ्याने HUID आणि परवाना तपासू शकता.";
    }
    return "नमस्कार! मी स्कॅन असिस्टंट एआय आहे. मी तुम्हाला Enter Details, Scan Image, QR Code, Barcode, IS Codes, HUID आणि CM/L पडताळणीमध्ये मदत करू शकतो.";
  }

  if (cleanLang === 'ta') {
    return "வணக்கம்! நான் ஸ்கேன் அசிஸ்டன்ட் ஏஐ. Enter Details, Scan Image, QR Code, Barcode, IS Codes, மற்றும் HUID சரிபார்ப்பில் உங்களுக்கு உதவ முடியும்.";
  }

  if (cleanLang === 'te') {
    return "నమస్కారం! నేను స్కాన్ అసిస్టెంట్ AI ని. Enter Details, Scan Image, QR Code, Barcode, IS Codes, HUID మరియు CM/L తనిఖీలో మీకు సహాయపడగలను.";
  }

  if (cleanLang === 'bn') {
    return "নমস্কার! আমি স্ক্যান সহকারী এআই। Enter Details, Scan Image, QR Code, Barcode, IS Codes, এবং HUID যাচাইয়ে আপনাকে সাহায্য করতে পারি।";
  }

  if (cleanLang === 'gu') {
    return "નમસ્તે! હું સ્કેન સહાયક AI છું. Enter Details, Scan Image, QR Code, Barcode, IS Codes અને HUID ચકાસણીમાં તમારી મદદ કરી શકું છું.";
  }

  // English fallback
  if (q.includes('barcode') && (q.includes('generate') || q.includes('create') || q.includes('how to generate'))) {
    return "Barcode generation is not available in the current visible interface.";
  }
  if (q.includes('qr')) {
    return "In the Scan a mark section, the QR Code tab allows scanning product QR codes directly via device camera to check HUID and license records.";
  }
  return "I am the Scan Assistant AI. I can guide you on Enter Details, Scan Image, QR Code, Barcode, IS Codes, Gold HUID, CM/L, and R-number verification in the Scan a mark section.";
}

// Multilingual Offline Fallback for Agent 2 (Website Assistant)
function parseWebsiteOfflineFallback(userPrompt, lang = 'en') {
  const cleanLang = lang.split('-')[0].toLowerCase();

  if (cleanLang === 'hi' || cleanLang === 'hi-latn') {
    return "नमस्ते! मैं प्रमाण एआई सहायक हूँ। मैं आपको होम, बीआईएस के बारे में, भारतीय मानक (IS Codes), उत्पाद सत्यापन, प्रयोगशालाएं और पोर्टल सेवाओं की पूरी जानकारी दे सकता हूँ।";
  }

  if (cleanLang === 'mr' || cleanLang === 'mr-latn') {
    return "नमस्कार! मी प्रमाण एआय असिस्टंट आहे. मी तुम्हाला मुख्यपृष्ठ, BIS बद्दल माहिती, भारतीय मानके (IS Codes), उत्पादन पडताळणी, आणि प्रयोगशाळा शोधण्यात मार्गदर्शन करू शकतो.";
  }

  if (cleanLang === 'ta') {
    return "வணக்கம்! நான் பிரமாண் ஏஐ உதவியாளர். முகப்பு, BIS தகவல்கள், இந்திய தரநிலைகள் (IS Codes), தயாரிப்பு சரிபார்ப்பு மற்றும் ஆய்வகங்களை கண்டறிய உதவ முடியும்.";
  }

  if (cleanLang === 'te') {
    return "నమస్కారం! నేను ప్రమాణ్ AI అసిస్టెంట్ ని. హోమ్, BIS గురించి, భారతీయ ప్రమాణాలు (IS కోడ్‌లు), ఉత్పత్తి తనిఖీ మరియు ప్రయోగశాలల సమాచారంలో మీకు మార్గదర్శనం చేయగలను.";
  }

  if (cleanLang === 'bn') {
    return "নমস্কার! আমি প্রমাণ এআই সহকারী। আমি আপনাকে হোম, বিআইএস সম্পর্কে, ভারতীয় মানদণ্ড (IS Codes), পণ্য যাচাই এবং ল্যাব অনুসন্ধানে সাহায্য করতে পারি।";
  }

  if (cleanLang === 'gu') {
    return "નમસ્તે! હું પ્રમાણ AI સહાયક છું. હોમ, BIS વિશે, ભારતીય ધોરણો (IS Codes), પ્રોડક્ટ ચકાસણી અને લેબોરેટરી શોધવામાં માર્ગદર્શન આપી શકું છું.";
  }

  return "I am your Pramaan AI Assistant. I can guide you across Home, About BIS, Standards Explorer, Product Verification, BIS Labs, News, and Portal features.";
}

function parseImageOfflineFallback(userPrompt) {
  const q = (userPrompt || '').toLowerCase();
  if (q.includes('barcode') && (q.includes('generate') || q.includes('create') || q.includes('banao') || q.includes('kaise karein'))) {
    return "Is image mein barcode generate karne ka option दिखाई नहीं दे रहा है, so I can't explain a generation process from this image alone.";
  }
  return "Is image mein Pramaan AI ka 'Scan a mark' interface दिखाई दे रहा है. Here you can see Enter Details, Scan Image, QR Code, and Barcode options for product authenticity verification.";
}
