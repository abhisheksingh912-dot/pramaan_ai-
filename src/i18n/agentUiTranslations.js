// Localized UI Translations for Scan Assistant AI (Agent 1) and Pramaan AI AI Assistant (Agent 2)

export function getScanAgentUiLabels(langCode = 'en-IN') {
  const code = (langCode || 'en-IN').split('-')[0];

  switch (code) {
    case 'hi':
      return {
        title: "प्रमाण AI (स्कैन असिस्टेंट)",
        subtitle: "Scan a mark के लिए आपका AI गाइड",
        tabVoice: "🎙 वॉयस",
        tabChat: "💬 चैट",
        tabImage: "🖼 इमेज विश्लेषण",
        tabHelp: "❓ सहायता",
        cardDetails: "विवरण दर्ज करें",
        cardImage: "इमेज स्कैन करें",
        cardQr: "QR कोड",
        cardBarcode: "बारकोड",
        tapToSpeak: "🎙 टैप करें और बोलें",
        readAloud: "🔊 बोलकर सुनाएं",
        tryAsking: "💡 पूछकर देखें (स्कैन-केवल):"
      };
    case 'mr':
      return {
        title: "प्रमाण AI (स्कॅन असिस्टंट)",
        subtitle: "Scan a mark साठी तुमचा AI मार्गदर्शक",
        tabVoice: "🎙 व्हॉइस",
        tabChat: "💬 चॅट",
        tabImage: "🖼 प्रतिमा विश्लेषण",
        tabHelp: "❓ मदत",
        cardDetails: "तपशील प्रविष्ट करा",
        cardImage: "प्रतिमा स्कॅन करा",
        cardQr: "QR कोड",
        cardBarcode: "बारकोड",
        tapToSpeak: "🎙 टॅप करा आणि बोला",
        readAloud: "🔊 मोठ्याने वाचा",
        tryAsking: "💡 विचारून पहा:"
      };
    case 'bn':
      return {
        title: "প্রমাণ AI (স্ক্যান অ্যাসিস্ট্যান্ট)",
        subtitle: "Scan a mark এর জন্য আপনার AI গাইড",
        tabVoice: "🎙 ভয়েস",
        tabChat: "💬 চ্যাট",
        tabImage: "🖼 ছবি বিশ্লেষণ",
        tabHelp: "❓ সাহায্য",
        cardDetails: "বিবরণ লিখুন",
        cardImage: "ছবি স্ক্যান করুন",
        cardQr: "QR কোড",
        cardBarcode: "বারকোড",
        tapToSpeak: "🎙 ট্যাপ করুন এবং বলুন",
        readAloud: "🔊 শুনুন",
        tryAsking: "💡 জিজ্ঞাসা করার চেষ্টা করুন:"
      };
    case 'ta':
      return {
        title: "பிரமாண AI (ஸ்கேன் உதவி)",
        subtitle: "Scan a mark க்கான உங்கள் AI வழிகாட்டி",
        tabVoice: "🎙 குரல்",
        tabChat: "💬 அரட்டை",
        tabImage: "🖼 பட பகுப்பாய்வு",
        tabHelp: "❓ உதவி",
        cardDetails: "விவரங்களை உள்ளிடவும்",
        cardImage: "படத்தை ஸ்கேன் செய்",
        cardQr: "QR குறியீடு",
        cardBarcode: "பார்கோடு",
        tapToSpeak: "🎙 தட்டி பேசுங்கள்",
        readAloud: "🔊 சத்தமாக வாசிக்கவும்",
        tryAsking: "💡 கேட்க முயற்சிக்கவும்:"
      };
    case 'te':
      return {
        title: "ప్రమాణ్ AI (స్కాన్ అసిస్టెంట్)",
        subtitle: "Scan a mark కోసం మీ AI మార్గదర్శి",
        tabVoice: "🎙 వాయిస్",
        tabChat: "💬 చాట్",
        tabImage: "🖼 చిత్రం విశ్లేషణ",
        tabHelp: "❓ సహాయం",
        cardDetails: "వివరాలను నమోదు చేయండి",
        cardImage: "చిత్రాన్ని స్కాన్ చేయండి",
        cardQr: "QR కోడ్",
        cardBarcode: "బార్‌కోడ్",
        tapToSpeak: "🎙 నొక్కి మాట్లాడండి",
        readAloud: "🔊 బిగ్గరగా చదవండి",
        tryAsking: "💡 అడగడానికి ప్రయత్నించండి:"
      };
    case 'gu':
      return {
        title: "પ્રમાણ AI (સ્કેન આસિસ્ટન્ટ)",
        subtitle: "Scan a mark માટે તમારું AI માર્ગદર્શક",
        tabVoice: "🎙 વૉઇસ",
        tabChat: "💬 ચેટ",
        tabImage: "🖼 છબી વિશ્લેષણ",
        tabHelp: "❓ મદદ",
        cardDetails: "વિગતો દાખલ કરો",
        cardImage: "છબી સ્કેન કરો",
        cardQr: "QR કોડ",
        cardBarcode: "બારકોડ",
        tapToSpeak: "🎙 ટેપ કરો અને બોલો",
        readAloud: "🔊 મોટેથી વાંચો",
        tryAsking: "💡 પૂછવાનો પ્રયાસ કરો:"
      };
    default:
      return {
        title: "Pramaan AI (Scan Assistant)",
        subtitle: "Your AI guide for Scan a mark",
        tabVoice: "🎙 Voice",
        tabChat: "💬 Chat",
        tabImage: "🖼 Image Analysis",
        tabHelp: "❓ Help",
        cardDetails: "Enter Details",
        cardImage: "Scan Image",
        cardQr: "QR Code",
        cardBarcode: "Barcode",
        tapToSpeak: "🎙 Tap and speak",
        readAloud: "🔊 Read Aloud",
        tryAsking: "💡 Try asking (Scan-Only):"
      };
  }
}

export function getWebsiteAgentUiLabels(langCode = 'en-IN') {
  const code = (langCode || 'en-IN').split('-')[0];

  switch (code) {
    case 'hi':
      return {
        title: "प्रमाण AI असिस्टेंट",
        subtitle: "Pramaan AI के लिए आपका AI स्मार्ट गाइड",
        tabVoice: "🎙 वॉयस एजेंट",
        tabChat: "💬 चैट एजेंट",
        tabGuide: "📖 वेबसाइट गाइड",
        tabFaq: "❓ सामान्य प्रश्न (FAQ)",
        cardHome: "होम",
        cardAbout: "BIS के बारे में",
        cardStandards: "मानक (Standards)",
        cardVerify: "उत्पाद सत्यापित करें",
        cardLabs: "BIS प्रयोगशालाएं",
        cardNews: "समाचार एवं अपडेट",
        readAloud: "🔊 बोलकर सुनाएं",
        popularQuestions: "💡 लोकप्रिय प्रश्न:"
      };
    case 'mr':
      return {
        title: "प्रमाण AI असिस्टंट",
        subtitle: "Pramaan AI साठी तुमचा AI मार्गदर्शक",
        tabVoice: "🎙 व्हॉइस एजंट",
        tabChat: "💬 चॅट एजंट",
        tabGuide: "📖 वेबसाइट मार्गदर्शक",
        tabFaq: "❓ सतत विचारले जाणारे प्रश्न",
        cardHome: "होम",
        cardAbout: "BIS बद्दल",
        cardStandards: "मानके",
        cardVerify: "उत्पादन पडताळा",
        cardLabs: "BIS प्रयोगशाळा",
        cardNews: "बातम्या आणि अद्यतने",
        readAloud: "🔊 मोठ्याने वाचा",
        popularQuestions: "💡 लोकप्रिय प्रश्न:"
      };
    case 'bn':
      return {
        title: "প্রমাণ AI অ্যাসিস্ট্যান্ট",
        subtitle: "Pramaan AI এর জন্য আপনার AI গাইড",
        tabVoice: "🎙 ভয়েস এজেন্ট",
        tabChat: "💬 চ্যাট এজেন্ট",
        tabGuide: "📖 ওয়েবসাইট গাইড",
        tabFaq: "❓ প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী",
        cardHome: "হোম",
        cardAbout: "BIS সম্পর্কে",
        cardStandards: "মানসমূহ",
        cardVerify: "পণ্য যাচাই করুন",
        cardLabs: "BIS ল্যাবরেটরি",
        cardNews: "সংবাদ ও আপডেট",
        readAloud: "🔊 শুনুন",
        popularQuestions: "💡 জনপ্রিয় প্রশ্নাবলী:"
      };
    case 'ta':
      return {
        title: "பிரமாண AI உதவி",
        subtitle: "Pramaan AI க்கான உங்கள் AI வழிகாட்டி",
        tabVoice: "🎙 குரல் முகவர்",
        tabChat: "💬 அரட்டை முகவர்",
        tabGuide: "📖 வலைத்தள வழிகாட்டி",
        tabFaq: "❓ அடிக்கடி கேட்கப்படும் கேள்விகள்",
        cardHome: "முகப்பு",
        cardAbout: "BIS பற்றி",
        cardStandards: "தரநிலைகள்",
        cardVerify: "தயாரிப்பை சரிபார்க்கவும்",
        cardLabs: "BIS ஆய்வகங்கள்",
        cardNews: "செய்திகள் & புதுப்பிப்புகள்",
        readAloud: "🔊 வாசிக்கவும்",
        popularQuestions: "💡 பிரபலமான கேள்விகள்:"
      };
    case 'te':
      return {
        title: "ప్రమాణ్ AI అసిస్టెంట్",
        subtitle: "Pramaan AI కోసం మీ AI గైడ్",
        tabVoice: "🎙 వాయిస్ ఏజెంట్",
        tabChat: "💬 చాట్ ఏజెంట్",
        tabGuide: "📖 వెబ్‌సైట్ గైడ్",
        tabFaq: "❓ తరచుగా అడిగే ప్రశ్నలు",
        cardHome: "హోమ్",
        cardAbout: "BIS గురించి",
        cardStandards: "ప్రమాణాలు",
        cardVerify: "ఉత్పత్తిని తనిఖీ చేయండి",
        cardLabs: "BIS ల్యాబ్‌లు",
        cardNews: "వార్తలు & అప్‌డేట్‌లు",
        readAloud: "🔊 బిగ్గరగా చదవండి",
        popularQuestions: "💡 ప్రసిద్ధ ప్రశ్నలు:"
      };
    case 'gu':
      return {
        title: "પ્રમાણ AI આસિસ્ટન્ટ",
        subtitle: "Pramaan AI માટે તમારી માર્ગદર્શિકા",
        tabVoice: "🎙 વૉઇસ એજન્ટ",
        tabChat: "💬 ચેટ એજન્ટ",
        tabGuide: "📖 વેબસાઇટ માર્ગદર્શિકા",
        tabFaq: "❓ વારંવાર પૂછાતા પ્રશ્નો",
        cardHome: "હોમ",
        cardAbout: "BIS વિશે",
        cardStandards: "ધોરણો",
        cardVerify: "ઉત્પાદન ચકાસો",
        cardLabs: "BIS પ્રયોગશાળાઓ",
        cardNews: "સમાચાર અને અપડેટ્સ",
        readAloud: "🔊 મોટેથી વાંચો",
        popularQuestions: "💡 લોકપ્રિય પ્રશ્નો:"
      };
    default:
      return {
        title: "Pramaan AI Assistant",
        subtitle: "Your complete Smart Verification & Voice Assistant for Pramaan AI",
        tabVoice: "🎙 Voice Agent",
        tabChat: "💬 Chat Agent",
        tabGuide: "📖 Website Guide",
        tabFaq: "❓ FAQ",
        cardHome: "Home",
        cardAbout: "About BIS",
        cardStandards: "Standards",
        cardVerify: "Verify a Product",
        cardLabs: "BIS Labs",
        cardNews: "News & Updates",
        readAloud: "🔊 Read Aloud",
        popularQuestions: "💡 Popular questions:"
      };
  }
}
