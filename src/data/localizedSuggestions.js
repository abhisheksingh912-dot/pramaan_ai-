// Dynamic Localized Suggestions for 22 Indian Languages

export function getLocalizedSuggestions(langCode = 'en-IN') {
  const code = (langCode || 'en-IN').split('-')[0];

  switch (code) {
    case 'hi':
      return [
        "Pramaan AI क्या है?",
        "यहाँ मैं क्या-क्या सत्यापित कर सकता हूँ?",
        "Scan a Mark कैसे काम करता है?",
        "QR Code का उपयोग कैसे करें?",
        "Barcode का उपयोग कैसे करें?",
        "IS Code क्या होता है?",
        "Gold HUID क्या है?",
        "BIS प्रयोगशालाएँ कैसे खोजें?",
        "इस पृष्ठ को समझाइये"
      ];
    case 'mr':
      return [
        "Pramaan AI म्हणजे काय?",
        "मी येथे काय पडताळू शकतो?",
        "Scan a Mark कसे कार्य करते?",
        "QR Code कसा वापरावा?",
        "Barcode कसा वापरावा?",
        "IS Code म्हणजे काय?",
        "Gold HUID म्हणजे काय?",
        "BIS प्रयोगशाळा कशी शोधावी?",
        "या पृष्ठाचे स्पष्टीकरण द्या"
      ];
    case 'bn':
      return [
        "Pramaan AI কি?",
        "এখানে আমি কি কি যাচাই করতে পারি?",
        "Scan a Mark কীভাবে কাজ করে?",
        "QR Code কীভাবে ব্যবহার করবেন?",
        "Barcode কীভাবে ব্যবহার করবেন?",
        "IS Code কি?",
        "Gold HUID কি?",
        "BIS ল্যাবরেটরি কীভাবে খুঁজবেন?",
        "এই পৃষ্ঠাটি ব্যাখ্যা করুন"
      ];
    case 'ta':
      return [
        "Pramaan AI என்றால் என்ன?",
        "இங்கே நான் எதை சரிபார்க்க முடியும்?",
        "Scan a Mark எவ்வாறு செயல்படுகிறது?",
        "QR Code ஐ எவ்வாறு பயன்படுத்துவது?",
        "Barcode ஐ எவ்வாறு பயன்படுத்துவது?",
        "IS Code என்றால் என்ன?",
        "Gold HUID என்றால் என்ன?",
        "BIS ஆய்வகங்களை எவ்வாறு கண்டறிவது?",
        "இந்த பக்கத்தை விளக்குங்கள்"
      ];
    case 'te':
      return [
        "Pramaan AI అంటే ఏమిటి?",
        "ఇక్కడ నేను ఏమి తనిఖీ చేయవచ్చు?",
        "Scan a Mark ఎలా పనిచేస్తుంది?",
        "QR Code ను ఎలా ఉపయోగించాలి?",
        "Barcode ను ఎలా ఉపయోగించాలి?",
        "IS Code అంటే ఏమిటి?",
        "Gold HUID అంటే ఏమిటి?",
        "BIS ల్యాబ్‌లను ఎలా కనుగొనాలి?",
        "ఈ పేజీని వివరించండి"
      ];
    case 'gu':
      return [
        "Pramaan AI શું છે?",
        "અહીં હું શું ચકાસી શકું છું?",
        "Scan a Mark કેવી રીતે કામ કરે છે?",
        "QR Code નો ઉપયોગ કેવી રીતે કરવો?",
        "Barcode નો ઉપયોગ કેવી રીતે કરવો?",
        "IS Code શું છે?",
        "Gold HUID શું છે?",
        "BIS પ્રયોગશાળાઓ કેવી રીતે શોધવી?",
        "આ પૃષ્ઠ સમજાવો"
      ];
    case 'kn':
      return [
        "Pramaan AI ಎಂದರೇನು?",
        "ಇಲ್ಲಿ ನಾನು ಏನನ್ನು ಪರಿಶೀಲಿಸಬಹುದು?",
        "Scan a Mark ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?",
        "QR Code ಹೇಗೆ ಬಳಸುವುದು?",
        "Barcode ಹೇಗೆ ಬಳಸುವುದು?",
        "IS Code ಎಂದರೇನು?",
        "Gold HUID ಎಂದರೇನು?",
        "BIS ಪ್ರಯೋಗಾಲಯಗಳನ್ನು ಹೇಗೆ ಕಂಡುಹಿಡಿಯುವುದು?",
        "ಈ ಪುಟವನ್ನು ವಿವರಿಸಿ"
      ];
    case 'ml':
      return [
        "Pramaan AI എന്താണ്?",
        "ഇവിടെ എനിക്ക് എന്തൊക്കെ പരിശോധിക്കാം?",
        "Scan a Mark എങ്ങനെ പ്രവർത്തിക്കുന്നു?",
        "QR Code എങ്ങനെ ഉപയോഗിക്കാം?",
        "Barcode എങ്ങനെ ഉപയോഗിക്കാം?",
        "IS Code എന്താണ്?",
        "Gold HUID എന്താണ്?",
        "BIS ലബോറട്ടറികൾ എങ്ങനെ കണ്ടെത്താം?",
        "ഈ പേജ് വിശദീകരിക്കുക"
      ];
    case 'pa':
      return [
        "Pramaan AI ਕੀ ਹੈ?",
        "ਮੈਂ ਇੱਥੇ ਕੀ ਜਾਂਚ ਸਕਦਾ ਹਾਂ?",
        "Scan a Mark ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ?",
        "QR Code ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੀਏ?",
        "Barcode ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੀਏ?",
        "IS Code ਕੀ ਹੈ?",
        "Gold HUID ਕੀ ਹੈ?",
        "BIS ਪ੍ਰਯੋਗਸ਼ਾਲਾਵਾਂ ਕਿਵੇਂ ਲੱਭੀਏ?",
        "ਇਸ ਪੰਨੇ ਦੀ ਵਿਆਖਿਆ ਕਰੋ"
      ];
    case 'ur':
      return [
        "Pramaan AI کیا ہے؟",
        "میں یہاں کیا تصدیق کر سکتا ہوں؟",
        "Scan a Mark کیسے کام کرتا ہے؟",
        "QR Code کا استعمال کیسے کریں؟",
        "Barcode کا استعمال کیسے کریں؟",
        "IS Code کیا ہے؟",
        "Gold HUID کیا ہے؟",
        "BIS لیبارٹریز کیسے تلاش کریں؟",
        "اس صفحے کی وضاحت کریں"
      ];
    default:
      return [
        "What is Pramaan AI?",
        "What can I verify here?",
        "How does Scan a Mark work?",
        "How do I use QR Code?",
        "How do I use Barcode?",
        "What is an IS Code?",
        "What is HUID?",
        "How can I find BIS Labs?",
        "Explain this page"
      ];
  }
}
