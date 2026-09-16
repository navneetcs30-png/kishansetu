import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Wheat,
  Copy,
  Check,
  RefreshCw,
  Globe2,
  ChevronDown,
  Volume2
} from 'lucide-react';
import { AIChatMessage, CropRateItem, VegetableItem, FarmerDocumentSubmission } from '../types';

interface KisanAIAssistantProps {
  crops: CropRateItem[];
  vegetables: VegetableItem[];
  cropQuantities: Record<string, number>;
  vegetableQuantities: Record<string, number>;
  totalGrainValue: number;
  totalVegetableValue: number;
  farmerSubmission?: FarmerDocumentSubmission;
  isOpen: boolean;
  onToggle: () => void;
}

export type SupportedLanguage = 'hi' | 'en' | 'hinglish' | 'pa' | 'mr' | 'gu' | 'bn' | 'te';

interface LanguageConfig {
  code: SupportedLanguage;
  nativeName: string;
  englishLabel: string;
  badge: string;
  welcomeGreeting: string;
  prompts: {
    icon: typeof Wheat;
    label: string;
    query: string;
  }[];
}

const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'hi',
    nativeName: 'हिन्दी',
    englishLabel: 'Hindi',
    badge: 'लोकप्रिय',
    welcomeGreeting:
      'राम राम किसान भाई! 🙏 मैं आपका **किसान सहायक AI** हूँ।\n\nआप मुझसे इस पेज पर दिए गए **गेहूं-धान के सरकारी समर्थन मूल्य (MSP)**, **मंडी के ताजा भाव**, **फसल उत्पादन व कीट प्रबंधन सलाह**, **पीएम-किसान योजना**, या **आधार कार्ड सत्यापन** के बारे में सरल और स्पष्ट भाषा में पूछ सकते हैं।\n\nआज आपकी क्या सहायता करूँ?',
    prompts: [
      {
        icon: Wheat,
        label: 'गेहूं MSP व 25 क्विंटल का हिसाब',
        query: 'गेहूं का वर्तमान सरकारी समर्थन मूल्य (MSP) क्या है और 25 क्विंटल बेचने पर मुझे कुल कितने रुपये मिलेंगे?',
      },
      {
        icon: TrendingUp,
        label: 'टमाटर व प्याज का मंडी भाव',
        query: 'आज टमाटर और प्याज का थोक मंडी भाव क्या चल रहा है और भाव में क्या तेजी-मंदी है?',
      },
      {
        icon: Wheat,
        label: 'गेहूं में पहली सिंचाई का सही समय',
        query: 'गेहूं की फसल में सबसे जरूरी पहली सिंचाई (ताजमूल अवस्था) कब करनी चाहिए और खाद कैसे डालें?',
      },
      {
        icon: ShieldCheck,
        label: 'PM-KISAN ₹6,000 नियम व किस्तें',
        query: 'पीएम-किसान सम्मान निधि के तहत ₹6,000 की किस्तें कैसे मिलती हैं और कौन-कौन से किसान पात्र हैं?',
      },
      {
        icon: HelpCircle,
        label: 'आधार कार्ड सत्यापन क्यों जरूरी है?',
        query: 'इस पेज पर आधार कार्ड अपलोड करना क्यों जरूरी है और अधिकारी इसे कैसे सत्यापित करते हैं?',
      },
    ],
  },
  {
    code: 'hinglish',
    nativeName: 'Hinglish',
    englishLabel: 'Hindi + English',
    badge: 'Easy Chat',
    welcomeGreeting:
      'Ram Ram Kisan Bhai! 🙏 Main hoon aapka **Kisan Sahayak AI**.\n\nAap is page par diye gaye **Wheat-Rice MSP rates**, **Mandi bhav**, **Kheti aur sinchayee tips**, **PM-KISAN scheme**, ya **Aadhaar verification** ke baare mein jo bhi sawaal ho, aasan bhasha mein poochh sakte hain.\n\nBataiye, aaj kis cheez mein madad chahiye?',
    prompts: [
      {
        icon: Wheat,
        label: 'Wheat MSP aur 25 quintal kamai',
        query: 'Wheat ka sarkari MSP rate kya hai aur 25 quintal bechne par kitni kamai hogi?',
      },
      {
        icon: TrendingUp,
        label: 'Tamatar aur Pyaz mandi bhav',
        query: 'Aaj Tomato aur Onion ka mandi rate kya hai aur aage bhav badhne ki ummeed hai ya nahi?',
      },
      {
        icon: Wheat,
        label: 'Gehun mein pehla paani kab lagayein?',
        query: 'Gehun mein pehli sinchayee kitne din par karni chahiye aur kitna paani lagana theek rahega?',
      },
      {
        icon: ShieldCheck,
        label: 'PM-KISAN ₹6,000 ke niyam',
        query: 'PM-KISAN ke ₹6,000 saalana lene ke liye kya niyam hain aur installment kab aati hai?',
      },
      {
        icon: HelpCircle,
        label: 'Aadhaar verify kyun zaroori hai?',
        query: 'Dashboard par Aadhaar card submit karna kyun zaroori hai aur isse kya fayda hoga?',
      },
    ],
  },
  {
    code: 'en',
    nativeName: 'English',
    englishLabel: 'English',
    badge: 'Standard',
    welcomeGreeting:
      'Namaste Farmer Friend! 🙏 I am your **Kisan Sahayak AI**, powered by Gemini.\n\nFeel free to ask me anything about the **crop MSP rates**, **vegetable mandi prices**, **stage-wise farming guidance**, **PM-KISAN scheme**, or your **Aadhaar verification status** available on this page.\n\nHow can I help you today?',
    prompts: [
      {
        icon: Wheat,
        label: 'Wheat MSP & 25 Quintal Value',
        query: 'What is the current government MSP for Wheat, and how much will I earn if I sell 25 quintals?',
      },
      {
        icon: TrendingUp,
        label: 'Tomato & Onion Mandi Rates',
        query: 'What are the latest mandi prices for Tomato and Onion, and what is the market trend?',
      },
      {
        icon: Wheat,
        label: 'Critical Irrigation for Wheat',
        query: 'What is the most critical stage for wheat irrigation and how can I save water?',
      },
      {
        icon: ShieldCheck,
        label: 'PM-KISAN Scheme Benefits',
        query: 'How does PM-KISAN ₹6,000 direct bank transfer work, and what are the eligibility rules?',
      },
      {
        icon: HelpCircle,
        label: 'Why Aadhaar Verification is needed',
        query: 'Why do I need to submit my Aadhaar card on this page, and what is the verification process?',
      },
    ],
  },
  {
    code: 'pa',
    nativeName: 'ਪੰਜਾਬੀ',
    englishLabel: 'Punjabi',
    badge: 'ਕਿਸਾਨ ਵੀਰ',
    welcomeGreeting:
      'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! 🙏 ਮੈਂ ਤੁਹਾਡਾ **ਕਿਸਾਨ ਸਹਾਇਕ AI** ਹਾਂ।\n\nਤੁਸੀਂ ਇਸ ਪੇਜ ਤੇ ਫਸਲਾਂ ਦੇ **ਐਮ.ਐਸ.ਪੀ (ਸਰਕਾਰੀ ਰੇਟ)**, **ਮੰਡੀ ਭਾਅ**, **ਸਿੰਚਾਈ ਤੇ ਖਾਦ ਦੀ ਸਲਾਹ**, **ਪੀ.ਐੱਮ-ਕਿਸਾਨ ਸਕੀਮ**, ਜਾਂ **ਅਧਾਰ ਕਾਰਡ ਵੈਰੀਫਿਕੇਸ਼ਨ** ਬਾਰੇ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ।\n\nਦੱਸੋ ਜੀ, ਅੱਜ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?',
    prompts: [
      {
        icon: Wheat,
        label: 'ਕਣਕ ਦਾ MSP ਤੇ 25 ਕੁਇੰਟਲ ਦਾ ਮੁੱਲ',
        query: 'ਕਣਕ ਦਾ ਸਰਕਾਰੀ ਐਮ.ਐਸ.ਪੀ ਰੇਟ ਕੀ ਹੈ ਅਤੇ 25 ਕੁਇੰਟਲ ਕਣਕ ਵੇਚਣ ਤੇ ਕਿੰਨੇ ਰੁਪਏ ਬਣਨਗੇ?',
      },
      {
        icon: TrendingUp,
        label: 'ਟਮਾਟਰ ਤੇ ਪਿਆਜ਼ ਦੇ ਮੰਡੀ ਭਾਅ',
        query: 'ਅੱਜ ਟਮਾਟਰ ਅਤੇ ਪਿਆਜ਼ ਦੇ ਮੰਡੀ ਰੇਟ ਕੀ ਚੱਲ ਰਹੇ ਹਨ?',
      },
      {
        icon: Wheat,
        label: 'ਕਣਕ ਨੂੰ ਪਹਿਲਾ ਪਾਣੀ ਕਦੋਂ ਲਾਈਏ?',
        query: 'ਕਣਕ ਦੀ ਬਿਜਾਈ ਤੋਂ ਬਾਅਦ ਪਹਿਲਾ ਪਾਣੀ (ਕੋਰ ਪਾਣੀ) ਕਿੰਨੇ ਦਿਨਾਂ ਬਾਅਦ ਲਾਉਣਾ ਸਹੀ ਹੈ?',
      },
      {
        icon: ShieldCheck,
        label: 'ਪੀ.ਐੱਮ-ਕਿਸਾਨ ਸਕੀਮ ਦੇ ਨਿਯਮ',
        query: 'ਪੀ.ਐੱਮ-ਕਿਸਾਨ ਦੇ ₹6,000 ਕਿਵੇਂ ਮਿਲਦੇ ਹਨ ਅਤੇ ਕਿਹੜੇ ਕਿਸਾਨ ਯੋਗ ਹਨ?',
      },
      {
        icon: HelpCircle,
        label: 'ਅਧਾਰ ਕਾਰਡ ਵੈਰੀਫਿਕੇਸ਼ਨ ਕਿਉਂ ਜ਼ਰੂਰੀ ਹੈ?',
        query: 'ਇਸ ਪੇਜ ਤੇ ਅਧਾਰ ਕਾਰਡ ਅਪਲੋਡ ਕਰਨ ਨਾਲ ਕਿਸਾਨ ਨੂੰ ਕੀ ਲਾਭ ਮਿਲਦਾ ਹੈ?',
      },
    ],
  },
  {
    code: 'mr',
    nativeName: 'मराठी',
    englishLabel: 'Marathi',
    badge: 'शेतकरी मित्र',
    welcomeGreeting:
      'नमस्कार शेतकरी बंधू! 🙏 मी आपला **किसान सहाय्यक AI** आहे.\n\nया पानावर दिलेले **धान्य हमीभाव (MSP)**, **भाजीपाल्याचे बाजारभाव**, **पिकांचे व्यवस्थापन व खत नियोजन**, **पीएम-किसान योजना**, किंवा **आधार पडताळणी** याविषयी सोप्या भाषेत माहिती विचारू शकता.\n\nआज मी आपल्याला काय मदत करू?',
    prompts: [
      {
        icon: Wheat,
        label: 'गव्हाचा हमीभाव व २५ क्विंटलचे उत्पन्न',
        query: 'गव्हाचा चालू शासकीय हमीभाव (MSP) किती आहे आणि २५ क्विंटल विकल्यास किती रक्कम मिळेल?',
      },
      {
        icon: TrendingUp,
        label: 'कांदा व टोमॅटोचे बाजारभाव',
        query: 'आज कांदा आणि टोमॅटोचे बाजारभाव काय सुरू आहेत व नाशिक बाजारात काय स्थिती आहे?',
      },
      {
        icon: Wheat,
        label: 'गव्हाची पहिली व महत्त्वाची पाणी पाळी',
        query: 'गव्हाच्या पिकाला पहिली पाणी पाळी (मुकुटमुळे फुटण्याची वेळ) कधी द्यावी?',
      },
      {
        icon: ShieldCheck,
        label: 'पीएम-किसान योजनेचे नियम',
        query: 'पीएम-किसान योजनेचे ₹६,००० चे हप्ते कसे जमा होतात व कोणती कागदपत्रे लागतात?',
      },
      {
        icon: HelpCircle,
        label: 'आधार पडताळणी का आवश्यक आहे?',
        query: 'या पोर्टलवर आधार कार्ड अपलोड केल्यावर काय लाभ मिळतो आणि मंजुरी कोण देते?',
      },
    ],
  },
  {
    code: 'gu',
    nativeName: 'ગુજરાતી',
    englishLabel: 'Gujarati',
    badge: 'ખેડૂત મિત્ર',
    welcomeGreeting:
      'નમસ્તે ખેડૂત મિત્ર! 🙏 હું તમારો **કિસાન સહાયક AI** છું.\n\nતમે આ પેજ પર દર્શાવેલા **ટેકાના ભાવ (MSP)**, **શાકભાજીના માર્કેટ યાર્ડના ભાવ**, **વાવણી-સિંચાઈ અને ખાતરની સલાહ**, **પીએમ-કિસાન યોજના**, અથવા **આધાર કાર્ડ વેરિફિકેશન** વિશે સરળ ગુજરાતીમાં પૂછી શકો છો.\n\nકહો, આજે તમને શું માહિતી જોઈએ છે?',
    prompts: [
      {
        icon: Wheat,
        label: 'ઘઉંનો ટેકાનો ભાવ અને ૨૫ ક્વિન્ટલની આવક',
        query: 'ઘઉંનો હાલનો ટેકાનો ભાવ (MSP) કેટલો છે અને ૨૫ ક્વિન્ટલ વેચતાં કેટલી રકમ મળશે?',
      },
      {
        icon: TrendingUp,
        label: 'ટામેટા અને ડુંગળીના માર્કેટ યાર્ડ ભાવ',
        query: 'ટામેટા અને ડુંગળીના આજના માર્કેટ યાર્ડના ભાવ શું છે?',
      },
      {
        icon: Wheat,
        label: 'ઘઉંમાં પહેલું પિયત ક્યારે આપવું?',
        query: 'ઘઉંમાં પહેલું પિયત (સીઆરઆઈ સ્ટેજ) ક્યારે આપવું જોઈએ?',
      },
      {
        icon: ShieldCheck,
        label: 'પીએમ-કિસાન યોજનાના નિયમો',
        query: 'પીએમ-કિસાન યોજના અંતર્ગત વાર્ષિક ₹૬,૦૦૦ ની સહાય મેળવવાના નિયમો શું છે?',
      },
      {
        icon: HelpCircle,
        label: 'આધાર વેરિફિકેશન કેમ જરૂરી છે?',
        query: 'આ પેજ પર આધાર કાર્ડ વેરિફિકેશન કરાવવાથી શું લાભ મળે છે?',
      },
    ],
  },
  {
    code: 'bn',
    nativeName: 'বাংলা',
    englishLabel: 'Bengali',
    badge: 'কৃষক বন্ধু',
    welcomeGreeting:
      'নমস্কার কৃষক ভাই! 🙏 আমি আপনার **কিষাণ সহায়ক AI**।\n\nআপনি এই ড্যাশবোর্ডে দেওয়া **শস্যের সরকারি সহায়ক মূল্য (MSP)**, **সবজির পাইকারি বাজার দর**, **চাষের বৈজ্ঞানিক পরামর্শ**, **পিএম-কিষাণ প্রকল্প**, বা **আধার যাচাইকরণ** সম্পর্কে যে কোনো প্রশ্ন সহজ ভাষায় করতে পারেন।\n\nআজ আপনাকে কীভাবে সাহায্য করতে পারি?',
    prompts: [
      {
        icon: Wheat,
        label: 'গমের এমএসপি ও ২৫ কুইন্টালের দর',
        query: 'গমের বর্তমান সরকারি এমএসপি কত এবং ২৫ কুইন্টাল বিক্রি করলে কত টাকা পাব?',
      },
      {
        icon: TrendingUp,
        label: 'টমেটো ও পেঁয়াজের বাজার দর',
        query: 'আজ পাইকারি বাজারে টমেটো ও পেঁয়াজের দর কী চলছে?',
      },
      {
        icon: Wheat,
        label: 'গম গাছে প্রথম সেচ কখন দেবেন?',
        query: 'গমের ফলন ভালো পেতে প্রথম সেচ কখন ও কীভাবে দেওয়া উচিত?',
      },
      {
        icon: ShieldCheck,
        label: 'পিএম-কিষাণ প্রকল্পের নিয়ম',
        query: 'পিএম-কিষাণ প্রকল্পে প্রতি বছর ₹৬,০০০ পাওয়ার জন্য কী কী যোগ্যতা থাকা প্রয়োজন?',
      },
      {
        icon: HelpCircle,
        label: 'আধার যাচাইকরণ কেন জরুরি?',
        query: 'এই পোর্টালে আধার কার্ড জমা দিলে কী কী সরকারি সুবিধা পাওয়া যায়?',
      },
    ],
  },
  {
    code: 'te',
    nativeName: 'తెలుగు',
    englishLabel: 'Telugu',
    badge: 'రైతు మిత్ర',
    welcomeGreeting:
      'నమస్కారం రైతు సోదరా! 🙏 నేను మీ **కిసాన్ సహాయక్ AI**.\n\nఈ పేజీలో ఉన్న **కనీస మద్దతు ధరలు (MSP)**, **మార్కెట్ యార్డ్ కూరగాయల ధరలు**, **వ్యవసాయ సాగు సలహాలు**, **పీఎం-కిసాన్ పథకం**, లేదా **ఆధార్ ధృవీకరణ** గురించి మీరు సులభమైన తెలుగులో అడగవచ్చు.\n\nఈరోజు మీకు ఏ సమాచారం కావాలి?',
    prompts: [
      {
        icon: Wheat,
        label: 'గోధుమ MSP & 25 క్వింటాళ్ల లెక్కింపు',
        query: 'గోధుమ ప్రస్తుత ప్రభుత్వ మద్దతు ధర (MSP) ఎంత మరియు 25 క్వింటాళ్లకు ఎంత మొత్తం వస్తుంది?',
      },
      {
        icon: TrendingUp,
        label: 'టమోటా, ఉల్లిపాయల మార్కెట్ ధరలు',
        query: 'నేడు టమోటా మరియు ఉల్లిపాయల హోల్‌సేల్ మార్కెట్ ధరలు ఎలా ఉన్నాయి?',
      },
      {
        icon: Wheat,
        label: 'గోధుమ పంటకు మొదటి నీటి తడి ఎప్పుడు?',
        query: 'గోధుమ విత్తిన తర్వాత మొదటి నీటి తడి ఎప్పుడు ఇవ్వాలి?',
      },
      {
        icon: ShieldCheck,
        label: 'పీఎం-కిసాన్ పథకం వివరాలు',
        query: 'పీఎం-కిసాన్ ₹6,000 వార్షిక సహాయం విడతల వివరాలు మరియు అర్హతలు ఏమిటి?',
      },
      {
        icon: HelpCircle,
        label: 'ఆధార్ ధృవీకరణ ఎందుకు అవసరం?',
        query: 'ఈ పేజీలో ఆధార్ కార్డు అప్‌లోడ్ చేయడం ఎందుకు అవసరం మరియు ఎవరికి వెళ్తుంది?',
      },
    ],
  },
];

export const KisanAIAssistant: React.FC<KisanAIAssistantProps> = ({
  crops,
  vegetables,
  cropQuantities,
  vegetableQuantities,
  totalGrainValue,
  totalVegetableValue,
  farmerSubmission,
  isOpen,
  onToggle,
}) => {
  // Selected language state (default: Hindi for high rural relevance)
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('hi');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const currentLangConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome-initial',
      role: 'model',
      text: currentLangConfig.welcomeGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Synchronize with global platform language selection
  useEffect(() => {
    const handleLangChange = (e: any) => {
      const lang = e.detail?.language;
      if (lang && SUPPORTED_LANGUAGES.some((l) => l.code === lang)) {
        handleSelectLanguage(lang);
      }
    };
    const saved = localStorage.getItem('kishansetu_language') as SupportedLanguage;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      setSelectedLanguage(saved);
    }
    window.addEventListener('kishansetu_language_changed', handleLangChange);
    return () => window.removeEventListener('kishansetu_language_changed', handleLangChange);
  }, []);

  // Handle language switch
  const handleSelectLanguage = (langCode: SupportedLanguage) => {
    setSelectedLanguage(langCode);
    setShowLanguageDropdown(false);

    const newConfig = SUPPORTED_LANGUAGES.find((l) => l.code === langCode) || SUPPORTED_LANGUAGES[0];

    // Add a friendly notification in the chat
    const switchNotice: AIChatMessage = {
      id: `lang-switch-${Date.now()}`,
      role: 'model',
      text: `🌐 **${newConfig.nativeName} (${newConfig.englishLabel})** भाषा चुनी गई।\n\n${newConfig.welcomeGreeting}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, switchNotice]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: currentLangConfig.welcomeGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorMessage(null);
  };

  const handleSend = async (textToSend?: string) => {
    const question = (textToSend || inputText).trim();
    if (!question || isLoading) return;

    setInputText('');
    setErrorMessage(null);

    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Prepare contextual snapshot from the current page
    const pageContext = {
      selectedLanguage,
      crops: crops.map((c) => ({
        name: c.name,
        hindi: c.hindiName,
        msp: c.mspRate,
        enteredQuintals: cropQuantities[c.id] || 0,
        estimatedValue: (cropQuantities[c.id] || 0) * c.mspRate,
      })),
      vegetables: vegetables.map((v) => ({
        name: v.name,
        hindi: v.hindiName,
        ratePerQuintal: v.mandiRatePerQuintal,
        market: v.primaryMarket,
        enteredQuintals: vegetableQuantities[v.id] || 0,
        estimatedValue: (vegetableQuantities[v.id] || 0) * v.mandiRatePerQuintal,
      })),
      totalCalculatedEarnings: {
        grainMspTotal: totalGrainValue,
        vegetableMandiTotal: totalVegetableValue,
        grandTotal: totalGrainValue + totalVegetableValue,
      },
      farmerVerification: {
        status: farmerSubmission?.status || 'not_submitted',
        farmerName: farmerSubmission?.farmerName,
        aadhaar: farmerSubmission?.aadhaarNumber,
        village: farmerSubmission?.village,
        kisanRegistrationId: farmerSubmission?.kisanRegistrationNumber,
      },
    };

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          language: selectedLanguage,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            text: m.text,
          })),
          context: pageContext,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned error ${response.status}`);
      }

      const data = await response.json();
      const botMessage: AIChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'उत्तर प्राप्त नहीं हो सका। कृपया पुनः प्रयास करें।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Failed to get AI answer:', err);
      const isMissingKey = err.message?.includes('GEMINI_API_KEY') || err.message?.includes('key is not configured');
      const errText = isMissingKey
        ? '⚠️ **Gemini API Key Needed**: Please configure your `GEMINI_API_KEY` in the AI Studio **Settings > Secrets** panel so Kisan Sahayak AI can connect and respond.'
        : `⚠️ **Unable to connect**: ${err.message || 'Could not fetch response from server'}. Please verify your connection or try again.`;

      setErrorMessage(errText);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          text: errText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render formatted text cleanly with farmer-friendly typography
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          // Check if bullet point
          const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ') || line.trim().startsWith('• ');
          const cleanedLine = isBullet ? line.trim().replace(/^[*•-]\s+/, '') : line;

          // Parse **bold** parts
          const parts = cleanedLine.split(/(\*\*.*?\*\*)/g);

          const formattedContent = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-slate-900 dark:text-slate-100">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          });

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-1">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span className="flex-1">{formattedContent}</span>
              </div>
            );
          }

          return <p key={idx}>{formattedContent}</p>;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom-Right) */}
      {!isOpen && (
        <button
          type="button"
          onClick={onToggle}
          aria-label="Open Kisan AI Sahayak Assistant"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-950/20 hover:shadow-xl transition-all duration-200 border-2 border-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-300/50 group active:scale-95"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold block leading-none text-amber-200">
                Kisan AI Sahayak
              </span>
              <span className="text-[10px] bg-emerald-900/90 text-amber-300 px-1 py-0.2 rounded border border-emerald-700 font-medium">
                {currentLangConfig.nativeName}
              </span>
            </div>
            <span className="text-[10px] text-emerald-100 block leading-tight mt-0.5">
              अपनी भाषा में सवाल पूछें
            </span>
          </div>
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        </button>
      )}

      {/* Slide-out / Popover Assistant Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-assistant-title"
          className="fixed bottom-0 sm:bottom-5 right-0 sm:right-5 z-50 w-full sm:w-[460px] md:w-[500px] h-[92vh] sm:h-[660px] max-h-[720px] bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-emerald-700 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700/90 border border-amber-400/80 flex items-center justify-center text-amber-300 shadow-2xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="ai-assistant-title" className="text-sm font-bold text-white tracking-tight">
                    Kisan Sahayak AI (किसान सहायक)
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-emerald-950 px-1.5 py-0.2 rounded font-mono">
                    Gemini
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/90 leading-tight mt-0.5">
                  कृषि मित्र • सरल व आत्मीय भाषा में सहायता
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition-colors"
                aria-label="Clear chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onToggle}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* STEP 1: PROMINENT LANGUAGE SELECTOR BAR */}
          <div className="bg-amber-50/90 dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/60 px-3.5 py-2 flex-shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 dark:text-amber-200">
                <Globe2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>बातचीत की भाषा चुनें (Select Language First):</span>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-800 dark:bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                Active: {currentLangConfig.nativeName}
              </span>
            </div>

            {/* Quick Language Selection Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar scroll-smooth">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-emerald-800 dark:bg-emerald-600 text-white border-emerald-900 dark:border-emerald-500 shadow-xs scale-[1.02]'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-amber-200/80 dark:border-slate-700 hover:bg-amber-100 dark:hover:bg-slate-700 hover:text-emerald-900 dark:hover:text-emerald-300'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span
                      className={`text-[9px] font-normal ${
                        isSelected ? 'text-amber-300 dark:text-amber-200' : 'text-slate-400 dark:text-slate-400'
                      }`}
                    >
                      ({lang.englishLabel})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Context status ticker */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1 border-b border-emerald-100 dark:border-emerald-900/60 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">डैशबोर्ड डाटा कनेक्टेड:</span>
              <span className="text-emerald-700 dark:text-emerald-400 truncate">
                6 फसलें (MSP) • 6 मंडियां • 4 कृषि चरण • PM-KISAN
              </span>
            </div>
            {totalGrainValue + totalVegetableValue > 0 && (
              <span className="text-[10px] font-mono font-bold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 whitespace-nowrap">
                ₹{(totalGrainValue + totalVegetableValue).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 dark:bg-slate-950/80">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                      isUser
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-800 text-amber-300'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-2xs relative group ${
                      isUser
                        ? 'bg-amber-500 text-white rounded-tr-xs'
                        : 'bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                    }`}
                  >
                    <div className="pr-5">
                      {isUser ? (
                        <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      ) : (
                        renderFormattedText(msg.text)
                      )}
                    </div>

                    <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] opacity-75">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:opacity-100 flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                          title="Copy answer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-emerald-700 dark:text-emerald-400">कॉपी हुआ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>कॉपी</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 animate-bounce" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-xs p-3.5 shadow-2xs text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse delay-100" />
                    <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse delay-200" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                    किसान सहायक {currentLangConfig.nativeName} में जानकारी तैयार कर रहे हैं...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips (Adapted to Selected Language) */}
          <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex-shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1 px-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{currentLangConfig.nativeName} में पूछे जाने वाले मुख्य सवाल (Tap to Ask):</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              {currentLangConfig.prompts.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSend(item.query)}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-900 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-shrink-0"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  selectedLanguage === 'hi'
                    ? 'अपनी भाषा में पूछें (जैसे: गेहूं का सरकारी भाव क्या है?)...'
                    : selectedLanguage === 'hinglish'
                    ? 'Apna sawaal likhein (jaise: Wheat ka MSP kitna hai?)...'
                    : selectedLanguage === 'pa'
                    ? 'ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਪੁੱਛੋ (ਜਿਵੇਂ: ਕਣਕ ਦਾ ਐਮ.ਐਸ.ਪੀ ਕੀ ਹੈ?)...'
                    : selectedLanguage === 'mr'
                    ? 'आपल्या भाषेत विचारा (उदा. गव्हाचा हमीभाव किती आहे?)...'
                    : selectedLanguage === 'gu'
                    ? 'તમારી ભાષામાં પૂછો (જેમ કે: ઘઉંનો ટેકાનો ભાવ શું છે?)...'
                    : selectedLanguage === 'bn'
                    ? 'আপনার ভাষায় প্রশ্ন করুন (যেমন: গমের দর কত?)...'
                    : selectedLanguage === 'te'
                    ? 'మీ భాషలో అడగండి (ఉదా: గోధుమ మద్దతు ధర ఎంత?)...'
                    : 'Ask any farming or page question...'
                }
                disabled={isLoading}
                className="w-full text-xs sm:text-sm pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold transition-all shadow-xs flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
