import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { platformDb } from './src/server/db';
import { supabaseService } from './src/server/supabaseService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization for Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(customApiKey?: string): GoogleGenAI {
  const key = customApiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY environment variable is not configured. Please add it in .env or provide an API key in settings.');
  }
  if (!aiClient || customApiKey) {
    const client = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'kishansetu-portal',
        },
      },
    });
    if (!customApiKey) aiClient = client;
    return client;
  }
  return aiClient;
}

// Fallback knowledge engine when GEMINI_API_KEY is not configured
function buildLocalizedDashboardAnswer(
  question: string,
  language: string,
  context: any
): string {
  const q = question.toLowerCase();
  const lang = language || 'hi';

  const grainTotal = context?.totalCalculatedEarnings?.grainMspTotal ?? 56875;
  const vegTotal = context?.totalCalculatedEarnings?.vegetableMandiTotal ?? 21750;
  const grandTotal = context?.totalCalculatedEarnings?.grandTotal ?? (grainTotal + vegTotal);

  const isWheat = q.includes('wheat') || q.includes('gehun') || q.includes('गेहूं') || q.includes('कणक') || q.includes('गव्हा') || q.includes('ઘઉં') || q.includes('గోధుమ');
  const isRice = q.includes('rice') || q.includes('paddy') || q.includes('dhan') || q.includes('धान') || q.includes('ਚੌਲ') || q.includes('तांदूळ') || q.includes('ડાંગર');
  const isMustard = q.includes('mustard') || q.includes('sarson') || q.includes('सरसों') || q.includes('ਸਰ੍ਹੋਂ');
  const isMandi = q.includes('mandi') || q.includes('sabzi') || q.includes('vegetable') || q.includes('मंडी') || q.includes('सब्जी') || q.includes('tomato') || q.includes('onion') || q.includes('potato') || q.includes('आलू') || q.includes('प्याज') || q.includes('टमाटर');
  const isTotal = q.includes('total') || q.includes('earning') || q.includes('kamai') || q.includes('hisaab') || q.includes('कमाई') || q.includes('जोड़') || q.includes('ਕੁੱਲ') || q.includes('हिशोब') || q.includes('નફો') || q.includes('మొత్తం');
  const isIrrigation = q.includes('water') || q.includes('irrigation') || q.includes('sinchayee') || q.includes('paani') || q.includes('सिंचाई') || q.includes('पानी') || q.includes('ਸਿੰਚਾਈ');
  const isScheme = q.includes('scheme') || q.includes('pm-kisan') || q.includes('kisan') || q.includes('pmfby') || q.includes('yojana') || q.includes('योजना') || q.includes('बीमा') || q.includes('ਕਿਸਾਨ');
  const isVerification = q.includes('aadhaar') || q.includes('verify') || q.includes('verification') || q.includes('kyc') || q.includes('आधार') || q.includes('सत्यापन') || q.includes('admin') || q.includes('प्रमाणन');

  if (lang === 'pa') {
    if (isWheat) {
      return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! 🙏\n\nਤੁਹਾਡੇ ਇਸ ਡੈਸ਼ਬੋਰਡ ਮੁਤਾਬਕ ਕਣਕ ਦਾ ਸਰਕਾਰੀ ਘੱਟੋ-ਘੱਟ ਸਮਰਥਨ ਮੁੱਲ (MSP) **₹2,275 ਪ੍ਰਤੀ ਕੁਇੰਟਲ** (100 ਕਿੱਲੋ) ਹੈ।\n• 1 ਕੁਇੰਟਲ = 100 ਕਿਲੋਗ੍ਰਾਮ ਹੁੰਦਾ ਹੈ।\n• ਜੇਕਰ ਤੁਸੀਂ 25 ਕੁਇੰਟਲ ਕਣਕ ਵੇਚਦੇ ਹੋ, ਤਾਂ ਕੁੱਲ ਰਕਮ **₹56,875** ਬਣਦੀ ਹੈ।\nਤੁਸੀਂ ਉੱਪਰ ਦਿੱਤੇ ਕਣਕ ਦੇ ਖਾਨੇ ਵਿੱਚ ਆਪਣੀ ਮਾਤਰਾ ਭਰ ਕੇ ਤੁਰੰਤ ਹਿਸਾਬ ਦੇਖ ਸਕਦੇ ਹੋ।`;
    }
    if (isMandi) {
      return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! 🙏\n\nਤੁਹਾਡੇ ਪੇਜ 'ਤੇ ਸਬਜ਼ੀਆਂ ਦੇ ਤਾਜ਼ਾ ਮੰਡੀ ਭਾਅ ਇਸ ਪ੍ਰਕਾਰ ਹਨ:\n• **ਆਲੂ**: ₹1,450 / ਕੁਇੰਟਲ\n• **ਪਿਆਜ਼**: ₹2,100 / ਕੁਇੰਟਲ\n• **ਟਮਾਟਰ**: ₹1,850 / ਕੁਇੰਟਲ\n• **ਹਰੀ ਮਟਰ**: ₹3,600 / ਕੁਇੰਟਲ\n• **ਹਰੀ ਮਿਰਚ**: ₹4,200 / ਕੁਇੰਟਲ`;
    }
    if (isIrrigation) {
      return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! 🙏\n\nਕਣਕ ਦੀ ਬਿਜਾਈ ਤੋਂ **20 ਤੋਂ 25 ਦਿਨਾਂ ਬਾਅਦ (CRI ਸਟੇਜ)** ਪਹਿਲਾ ਪਾਣੀ ਲਾਉਣਾ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ। ਇਸ ਸਮੇਂ ਪਾਣੀ ਮਿਲਣ ਨਾਲ ਬੂਟੇ ਦੇ ਫੁੱਟਾਅ ਬਹੁਤ ਵਧੀਆ ਹੁੰਦੇ ਹਨ। ਤੁਪਕਾ ਸਿੰਚਾਈ (Drip) 'ਤੇ ਸਰਕਾਰ ਵੱਲੋਂ 45-55% ਸਬਸਿਡੀ ਵੀ ਦਿੱਤੀ ਜਾ ਰਹੀ ਹੈ।`;
    }
    return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! 🙏\n\nਤੁਹਾਡੇ ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ 6 ਮੁੱਖ ਫਸਲਾਂ ਦੇ MSP ਰੇਟ, 6 ਸਬਜ਼ੀ ਮੰਡੀ ਭਾਅ ਅਤੇ ਸਰਕਾਰੀ ਸਕੀਮਾਂ (PM-KISAN ₹6,000) ਜੁੜੀਆਂ ਹੋਈਆਂ ਹਨ। ਤੁਹਾਡੀ ਕੁੱਲ ਅਨੁਮਾਨਿਤ ਕਮਾਈ **₹${grandTotal.toLocaleString('en-IN')}** ਦਿਖਾਈ ਦੇ ਰਹੀ ਹੈ। ਕੋਈ ਵੀ ਹੋਰ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਬੇਝਿਜਕ ਪੁੱਛੋ!`;
  }

  if (lang === 'mr') {
    if (isWheat) {
      return `नमस्कार शेतकरी बंधू! 🙏\n\nआपल्या या डॅशबोर्डनुसार गव्हाचा हमीभाव (MSP) **₹२,२७५ प्रति क्विंटल** आहे.\n• १ क्विंटल = १०० किलो असतो.\n• जर आपल्याकडे २५ क्विंटल गहू असेल, तर त्याचे एकूण मूल्य **₹५६,८७५** होते.\nआपण वरील रकान्यामध्ये आपल्या उत्पादनाचे वजन टाकून थेट हिशोब पाहू शकता.`;
    }
    if (isScheme) {
      return `नमस्कार शेतकरी बंधू! 🙏\n\nपीएम-किसान योजनेअंतर्गत शेतकऱ्यांना वर्षाला **₹६,००० (३ हप्त्यांमध्ये ₹२,०००)** थेट बँक खात्यात जमा केले जातात. तसेच पीक विम्यामध्ये रब्बी पिकांसाठी केवळ १.५% प्रीमियम भरून नैसर्गिक नुकसानीपासून पूर्ण संरक्षण मिळते.`;
    }
    return `नमस्कार शेतकरी बंधू! 🙏\n\nआपल्या डॅशबोर्डवर धान्य आणि भाजीपाला दर उपलब्ध आहेत. सध्याची एकूण अंदाजित रक्कम **₹${grandTotal.toLocaleString('en-IN')}** आहे. शेतीविषयक कोणत्याही प्रश्नासाठी मी सदैव आपल्या सेवेत आहे!`;
  }

  if (lang === 'gu') {
    if (isWheat) {
      return `નમસ્તે ખેડૂત મિત્ર! 🙏\n\nતમારા ડેશબોર્ડ મુજબ ઘઉંનો ટેકાનો ભાવ (MSP) **₹૨,૨૭૫ પ્રતિ ક્વિન્ટલ** (૧૦૦ કિલો) છે.\n• ૧ ક્વિન્ટલ = ૧૦૦ કિલોગ્રામ.\n• ૨૫ ક્વિન્ટલ ઘઉંનું કુલ સરકારી મૂલ્ય **₹૫૬,૮૭૫** થાય છે.`;
    }
    return `નમસ્તે ખેડૂત મિત્ર! 🙏\n\nતમારા પેજ પર ઘઉં, ડાંગર, મકાઈ તેમજ શાકભાજી બજારના તાજા ભાવો અને પીએમ કિસાન યોજનાની વિગતો ઉપલબ્ધ છે. તમારી કુલ ગણતરી કરેલ રકમ **₹${grandTotal.toLocaleString('en-IN')}** છે.`;
  }

  if (lang === 'bn') {
    if (isWheat) {
      return `নমস্কার কৃষক ভাই! 🙏\n\nআপনার এই ড্যাশবোর্ড অনুযায়ী গমের সরকারি সহায়ক মূল্য (MSP) **₹২,২৭৫ প্রতি কুইন্টাল** (১০০ কেজি)।\n• ১ কুইন্টাল = ১০০ কিলোগ্রাম।\n• ২৫ কুইন্টাল গমের মোট মূল্য দাঁড়ায় **₹৫৬,৮৭৫**।`;
    }
    return `নমস্কার কৃষক ভাই! 🙏\n\nআপনার ড্যাশবোর্ডে গম, ধান, সরিষা ও শাকসবজির পাইকারি দর এবং পিএম-কিসান যোজনার সম্পূর্ণ তথ্য যুক্ত রয়েছে। আপনার মোট আনুমানিক উপার্জন **₹${grandTotal.toLocaleString('en-IN')}**।`;
  }

  if (lang === 'te') {
    if (isWheat) {
      return `నమస్కారం రైతు సోదరా! 🙏\n\nమీ డ్యాష్‌బోర్డ్ ప్రకారం గోధుమ కనీస మద్దతు ధర (MSP) **క్వింటాలుకు ₹2,275** (100 కిలోలు).\n• 1 క్వింటాల్ = 100 కిలోలు.\n• 25 క్వింటాళ్ల గోధుమలకు మొత్తం **₹56,875** లభిస్తుంది.`;
    }
    return `నమస్కారం రైతు సోదరా! 🙏\n\nమీ డ్యాష్‌బోర్డులో పంటల MSP ధరలు, మార్కెట్ రేట్లు మరియు ప్రభుత్వ పథకాల వివరాలు ఉన్నాయి. మీ ప్రస్తుత అంచనా ఆదాయం **₹${grandTotal.toLocaleString('en-IN')}**.`;
  }

  if (lang === 'en') {
    if (isWheat) {
      return `Hello Farmer Friend! 🙏\n\nAccording to this dashboard, the official Minimum Support Price (MSP) for Wheat is **₹2,275 per quintal** (100 kg).\n• 1 Quintal = 100 Kilograms (₹22.75/kg).\n• For 25 quintals of harvest, your calculated earnings are: **25 × ₹2,275 = ₹56,875**.\nYou can adjust the quantity in the "Crop Rates" panel above to instantly view your calculated returns.`;
    }
    if (isRice) {
      return `Hello Farmer Friend! 🙏\n\nThe official MSP for Paddy (Rice - Common Grade) on this page is **₹2,183 per quintal** (Grade A is ₹2,203/quintal). 1 quintal equals 100 kilograms.`;
    }
    if (isMandi) {
      return `Hello Farmer Friend! 🙏\n\nHere are the latest vegetable wholesale mandi rates benchmarked on your page:\n• **Potato**: ₹1,450 / quintal (Agra Mandi)\n• **Onion**: ₹2,100 / quintal (Nashik / Lasalgaon Mandi)\n• **Tomato**: ₹1,850 / quintal (Kolar Mandi)\n• **Green Peas**: ₹3,600 / quintal (Jabalpur Mandi)\n• **Green Chilli**: ₹4,200 / quintal (Guntur Mandi)`;
    }
    if (isTotal) {
      return `Hello Farmer Friend! 🙏\n\nHere is the breakdown of your currently entered harvest:\n• **Grains (MSP)**: ₹${grainTotal.toLocaleString('en-IN')}\n• **Vegetables (Mandi)**: ₹${vegTotal.toLocaleString('en-IN')}\n• **Grand Total Estimated Earnings**: **₹${grandTotal.toLocaleString('en-IN')}**\nYou can modify quantities anytime or tap "Reset" to start fresh.`;
    }
    if (isIrrigation) {
      return `Hello Farmer Friend! 🙏\n\nFor wheat crops, the **first irrigation at 20-25 days after sowing (Crown Root Initiation / CRI stage)** is the most critical. Delaying watering at this stage reduces tillering and yield. Using drip or sprinkler irrigation can save 40-50% water, with 45-55% government subsidy available under PM Krishi Sinchayee Yojana.`;
    }
    if (isScheme) {
      return `Hello Farmer Friend! 🙏\n\nKey Government Schemes featured on your dashboard:\n• **PM-KISAN**: ₹6,000 annual direct income support in 3 equal installments of ₹2,000.\n• **PMFBY (Crop Insurance)**: Comprehensive risk cover at just 1.5% premium for Rabi crops and 2% for Kharif.\n• **Kisan Credit Card (KCC)**: Concessional farm credit up to ₹3 Lakh at an effective 4% interest rate on timely repayment.`;
    }
    if (isVerification) {
      return `Hello Farmer Friend! 🙏\n\nTo verify your farmer identity, click the **"Upload Aadhaar & Farm Records"** button in the top banner. Your submission will be reviewed by the Block Agriculture Officer in the Admin Page. Once verified, you will receive an official Kisan Registration ID for mandi procurement tokens and direct benefit transfers.`;
    }
    return `Hello Farmer Friend! 🙏\n\nI am your **Kisan Sahayak AI**. On this page, you have 6 crop MSP rates, 6 vegetable mandi rates, 4 agricultural production guidance stages, and 6 central government schemes. Your current estimated total is **₹${grandTotal.toLocaleString('en-IN')}**. Feel free to ask any farming questions!`;
  }

  if (lang === 'hinglish') {
    if (isWheat) {
      return `Ram Ram Kisan bhai! 🙏\n\nAapke dashboard ke mutabiq Gehun (Wheat) ka sarkari MSP rate **₹2,275 per quintal** (100 kg) hai.\n• 1 Quintal = 100 Kilograms hota hai.\n• Agar aapke paas 25 quintal gehun hai, toh kul sarkari mulya: **25 × ₹2,275 = ₹56,875** banega.\nAap upar panel mein quantity badal kar live hisaab dekh sakte hain.`;
    }
    if (isMandi) {
      return `Ram Ram Kisan bhai! 🙏\n\nAapke page par taaza sabzi mandi rates is prakaar hain:\n• **Aloo (Potato)**: ₹1,450 / quintal\n• **Pyaaz (Onion)**: ₹2,100 / quintal\n• **Tamatar (Tomato)**: ₹1,850 / quintal\n• **Hari Matar**: ₹3,600 / quintal\n• **Hari Mirch**: ₹4,200 / quintal`;
    }
    if (isTotal) {
      return `Ram Ram Kisan bhai! 🙏\n\nAapka current entered hisaab:\n• **Anaaj (MSP)**: ₹${grainTotal.toLocaleString('en-IN')}\n• **Sabzi (Mandi)**: ₹${vegTotal.toLocaleString('en-IN')}\n• **Total Anumanit Kamai**: **₹${grandTotal.toLocaleString('en-IN')}**\nAap kisi bhi waqt quantity badal kar naya hisaab jod sakte hain!`;
    }
    return `Ram Ram Kisan bhai! 🙏\n\nAapke page par Gehun, Dhaan, Makka, Sabzi Mandi rates aur PM-KISAN ki sabhi jaankari uplabdh hai. Total hisaab **₹${grandTotal.toLocaleString('en-IN')}** hai. Kheti se juda koi bhi sawaal puchiye!`;
  }

  // Default: Hindi (Devanagari)
  if (isWheat) {
    return `राम राम किसान भाई! 🙏\n\nआपके इस डैशबोर्ड के अनुसार गेहूं का न्यूनतम समर्थन मूल्य (MSP) **₹2,275 प्रति क्विंटल** (100 किलो) निर्धारित है।\n• **1 क्विंटल = 100 किलोग्राम** होता है (यानी लगभग ₹22.75 प्रति किलो)।\n• यदि आपके पास **25 क्विंटल** गेहूं है, तो आपकी कुल अनुमानित आय: **25 × ₹2,275 = ₹56,875** बनेगी।\nआप ऊपर 'Crop Rates' पैनल में अपनी पैदावार की मात्रा लिखकर तुरंत नया जोड़ भी देख सकते हैं।`;
  }

  if (isRice) {
    return `राम राम किसान भाई! 🙏\n\nआपके डैशबोर्ड पर धान (Common Grade Paddy) का सरकारी समर्थन मूल्य **₹2,183 प्रति क्विंटल** और Grade-A धान का मूल्य **₹2,203 प्रति क्विंटल** है। 1 क्विंटल = 100 किलोग्राम होता है।`;
  }

  if (isMustard) {
    return `राम राम किसान भाई! 🙏\n\nसरसों का सरकारी न्यूनतम समर्थन मूल्य (MSP) **₹5,650 प्रति क्विंटल** है। यदि आपके पास 10 क्विंटल सरसों है, तो कुल मूल्य **₹56,500** बनेगा।`;
  }

  if (isMandi) {
    return `राम राम किसान भाई! 🙏\n\nआपके डैशबोर्ड पर प्रमुख सब्जी मंडियों के आज के थोक भाव:\n• **आलू (Potato)**: ₹1,450 / क्विंटल (आगरा मंडी)\n• **प्याज (Onion)**: ₹2,100 / क्विंटल (नासिक / लासलगांव मंडी)\n• **टमाटर (Tomato)**: ₹1,850 / क्विंटल (कोलार मंडी)\n• **हरी मटर (Green Peas)**: ₹3,600 / क्विंटल (जबलपुर मंडी)\n• **हरी मिर्च (Green Chilli)**: ₹4,200 / क्विंटल (गुंटूर मंडी)\n• **फूलगोभी**: ₹1,600 / क्विंटल (हापुड़ मंडी)`;
  }

  if (isTotal) {
    return `राम राम किसान भाई! 🙏\n\nआपके वर्तमान डैशबोर्ड पर दर्ज फसलों का पूरा हिसाब इस प्रकार है:\n• **अनाज (MSP) मूल्य**: ₹${grainTotal.toLocaleString('en-IN')}\n• **सब्जी मंडी मूल्य**: ₹${vegTotal.toLocaleString('en-IN')}\n• **कुल अनुमानित आय**: **₹${grandTotal.toLocaleString('en-IN')}**\nआप किसी भी फसल के आगे मात्रा बदलकर या 'Reset' दबाकर नया हिसाब लगा सकते हैं!`;
  }

  if (isIrrigation) {
    return `राम राम किसान भाई! 🙏\n\nगेहूं की फसल में सबसे महत्वपूर्ण सिंचाई **बुवाई के 20 से 25 दिन बाद (CRI अवस्था / ताजमूल निकलते समय)** अवश्य करनी चाहिए। इस समय पानी की कमी से कल्ले कम निकलते हैं और पैदावार घटती है।\n• ड्रिप या स्प्रिंकलर पद्धति अपनाने से 40-50% पानी की बचत होती है।\n• इस पर प्रधानमंत्री कृषि सिंचाई योजना के तहत 45% से 55% तक सरकारी अनुदान (सब्सिडी) भी मिलता है।`;
  }

  if (isScheme) {
    return `राम राम किसान भाई! 🙏\n\nआपके डैशबोर्ड पर उपलब्ध मुख्य सरकारी योजनाएं:\n• **PM-KISAN**: प्रतिवर्ष ₹6,000 की सहायता (₹2,000 की 3 समान किस्तें) सीधे आपके बैंक खाते में।\n• **PMFBY (फसल बीमा)**: रबी फसल पर मात्र 1.5% और खरीफ पर 2% प्रीमियम देकर बेमौसम बारिश व ओलावृष्टि से सुरक्षा।\n• **Kisan Credit Card (KCC)**: समय पर चुकाने पर मात्र 4% प्रभावी ब्याज पर ₹3 लाख तक का आसान ऋण।`;
  }

  if (isVerification) {
    return `राम राम किसान भाई! 🙏\n\nआधार सत्यापन हेतु ऊपर स्टेटस बैनर में **"Upload Aadhaar & Farm Records"** पर क्लिक करें। अपना आधार कार्ड और खतौनी/जमीन का ब्यौरा दर्ज करें। आपका फॉर्म ब्लॉक कृषि अधिकारी द्वारा 'Admin Verification Desk' में जांचा जाएगा। सत्यापन पूर्ण होते ही आपको सरकारी **Kisan ID** मिल जाएगा जिससे खरीद केंद्रों पर टोकन और सभी योजनाओं का लाभ बिना रुकावट मिलेगा।`;
  }

  return `राम राम किसान भाई! 🙏\n\nमैं आपका **किसान सहायक AI** हूँ। आपके इस डैशबोर्ड पर 6 प्रमुख फसलों के MSP रेट, 6 सब्जी मंडियों के थोक भाव, 4 वैज्ञानिक उत्पादन चरण और 6 सरकारी योजनाएं उपलब्ध हैं।\n• आपकी वर्तमान कुल अनुमानित फसल कमाई: **₹${grandTotal.toLocaleString('en-IN')}** है।\nआप गेहूं के भाव, सिंचाई की सही तकनीक, खाद, सब्जी मंडी भाव या आधार सत्यापन से जुड़ा कोई भी प्रश्न अपनी चुनी हुई भाषा में पूछ सकते हैं!`;
}

// Gemini AI Assistant endpoint
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { question, history = [], context = {}, language = 'hi' } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'A valid question string is required.' });
      return;
    }

    let ai: GoogleGenAI | null = null;
    try {
      if (process.env.GEMINI_API_KEY) {
        ai = getAIClient();
      }
    } catch (err: any) {
      console.warn('Gemini client init notice, falling back to local dataset:', err.message);
    }

    if (!ai) {
      const fallbackReply = buildLocalizedDashboardAnswer(question, language, context);
      res.json({ reply: fallbackReply });
      return;
    }

    const languageMap: Record<string, { name: string; instruction: string }> = {
      hi: {
        name: 'हिन्दी (Hindi)',
        instruction: 'You MUST reply in natural, warm, and respectful Hindi in Devanagari script (e.g. "राम राम किसान भाई! 🙏"). Use simple, rural-friendly words that any farmer can easily understand. Avoid complicated formal jargon.',
      },
      en: {
        name: 'English',
        instruction: 'You MUST reply in simple, friendly, and respectful English. Address the user warmly as "Farmer Friend" or "Kisan Brother". Keep explanations clear, human, and free of unnecessary technical jargon.',
      },
      hinglish: {
        name: 'Hinglish (Hindi in English script)',
        instruction: 'You MUST reply in conversational, friendly Hinglish (Hindi words written using English Latin alphabet, e.g. "Ram Ram Kisan bhai! 🙏 Aapke page par gehun ka MSP rate..."). Talk like a helpful, caring village friend.',
      },
      pa: {
        name: 'ਪੰਜਾਬੀ (Punjabi)',
        instruction: 'You MUST reply in warm, respectful Punjabi in Gurmukhi script (e.g. "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! 🙏"). Use everyday farmer-friendly vocabulary.',
      },
      mr: {
        name: 'मराठी (Marathi)',
        instruction: 'You MUST reply in warm, respectful Marathi in Devanagari script (e.g. "नमस्कार शेतकरी बंधू! 🙏"). Keep language simple, encouraging, and clear.',
      },
      gu: {
        name: 'ગુજરાતી (Gujarati)',
        instruction: 'You MUST reply in warm, respectful Gujarati in Gujarati script (e.g. "નમસ્તે ખેડૂત મિત્ર! 🙏"). Use simple, everyday farming language.',
      },
      bn: {
        name: 'বাংলা (Bengali)',
        instruction: 'You MUST reply in warm, respectful Bengali in Bengali script (e.g. "নমস্কার কৃষক ভাই! 🙏"). Keep terms clear, caring, and practical.',
      },
      te: {
        name: 'తెలుగు (Telugu)',
        instruction: 'You MUST reply in warm, respectful Telugu in Telugu script (e.g. "నమస్కారం రైతు సోదరా! 🙏"). Use polite, encouraging, farmer-friendly terms.',
      },
    };

    const targetLang = languageMap[language] || languageMap.hi;

    const systemInstruction = `You are "Kisan Sahayak" (किसान सहायक / Kisan Mitra), a warm, caring, highly knowledgeable agricultural companion and village guide in the KishanSetu ecosystem talking directly to a farmer.

CRITICAL INSTRUCTION - SELECTED LANGUAGE:
The farmer has explicitly chosen to speak in: ${targetLang.name}.
${targetLang.instruction}
Always answer in this selected language without fail.

CRITICAL INSTRUCTION - HUMAN-FRIENDLY TONE:
1. Warmth & Respect: Greet the farmer with heartfelt respect (e.g. "राम राम किसान भाई!", "Sat Sri Akal", or "Namaste Farmer Friend!").
2. Empathy & Clarity: Farming is hard work. Be encouraging and respectful of their labor.
3. Farmer Math Made Simple: When answering about quintals or rates, always remind that 1 क्विंटल = 100 किलोग्राम (100 kg), and show the math step-by-step.
4. Actionable Advice: Give practical, doable advice.

DATA AVAILABLE ON KISHANSETU:
1. GRAIN MSP RATES: Wheat ₹2,275/Q, Paddy ₹2,183/Q, Maize ₹2,090/Q, Mustard ₹5,650/Q, Gram ₹5,440/Q, Bajra ₹2,500/Q.
2. VEGETABLE MANDI RATES: Potato ₹1,450/Q, Onion ₹2,100/Q, Tomato ₹1,850/Q, Peas ₹3,600/Q, Cauliflower ₹1,600/Q, Green Chilli ₹4,200/Q.
3. SCHEMES: PM-KISAN (₹6,000/yr), PMFBY (1.5%-2% premium), KCC (4% interest), PM Krishi Sinchayee (45-55% subsidy).
4. VERIFICATION: Aadhaar KYC verification for official Kisan ID.

CURRENT CONTEXT:
${JSON.stringify(context, null, 2)}`;

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        if (msg.role === 'user' || msg.role === 'model') {
          contents.push({
            role: msg.role,
            parts: [{ text: msg.text }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: question }],
    });

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
    } catch (modelErr: any) {
      console.warn('Gemini 2.5 flash attempt failed, falling back to gemini-1.5-flash:', modelErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
    }

    const reply = response.text || 'I could not generate an answer at this moment. Please try again.';
    res.json({ reply, source: 'gemini_cloud_live' });
  } catch (error: any) {
    console.error('Gemini API Error in /api/ai/ask, falling back to localized answer:', error);
    const fallbackReply = buildLocalizedDashboardAnswer(
      req.body?.question || '',
      req.body?.language || 'hi',
      req.body?.context || {}
    );
    res.json({ reply: fallbackReply, source: 'localized_engine' });
  }
});

// ==========================================
// 🎙️ REAL-TIME VOICE COMMAND PARSING API
// ==========================================

export interface VoiceCommandResult {
  action: 'NAVIGATE_MODULE' | 'FOCUS_PANEL' | 'SET_THEME' | 'SET_LANGUAGE' | 'OPEN_MODAL' | 'CALCULATE' | 'GENERAL';
  target?: string;
  speechReply: string;
  displayText: string;
  executed: boolean;
  source?: string;
}

function parseLocalizedVoiceCommand(
  transcript: string,
  language: string = 'hi',
  currentModule: string = 'farmer'
): VoiceCommandResult {
  const t = transcript.toLowerCase().trim();
  const isHi = language === 'hi' || language === 'hinglish';
  
  // 1. Navigation Commands
  if (t.includes('consumer') || t.includes('उपभोक्ता') || t.includes('खरीददारी') || t.includes('दुकान') || t.includes('store') || t.includes('shop')) {
    return {
      action: 'NAVIGATE_MODULE',
      target: 'consumer',
      speechReply: isHi ? 'उपभोक्ता स्टोर खोला जा रहा है। यहां आप ताजी सब्जियां और फल खरीद सकते हैं।' : 'Switching to Consumer Store. You can browse and order farm-fresh produce directly from farmers.',
      displayText: isHi ? 'उपभोक्ता स्टोर पर नेविगेट किया गया' : 'Navigated to Consumer Store',
      executed: true,
      source: 'realtime_nlp_rule'
    };
  }
  
  if (t.includes('farmer') || t.includes('किसान') || t.includes('mandi') || t.includes('मंडी') || t.includes('खेती') || t.includes('फसल')) {
    return {
      action: 'NAVIGATE_MODULE',
      target: 'farmer',
      speechReply: isHi ? 'किसान हब खोला जा रहा है। यहां आप सरकारी समर्थन मूल्य और मंडी के ताजा भाव देख सकते हैं।' : 'Switching to Farmer Hub. You can view official MSP rates, Mandi benchmarks, and farming guidance.',
      displayText: isHi ? 'किसान हब पर नेविगेट किया गया' : 'Navigated to Farmer Hub',
      executed: true,
      source: 'realtime_nlp_rule'
    };
  }

  if (t.includes('bulk') || t.includes('थोक') || t.includes('procurement') || t.includes('खरीदार') || t.includes('b2b') || t.includes('व्यापारी')) {
    return {
      action: 'NAVIGATE_MODULE',
      target: 'bulk_buyer',
      speechReply: isHi ? 'थोक खरीदार डेस्क खोला जा रहा है। यहां बड़े पैमाने पर खरीद और अनुबंध किए जा सकते हैं।' : 'Opening B2B Bulk Buyer Desk. Manage high-volume institutional procurement contracts.',
      displayText: isHi ? 'थोक खरीदार डेस्क पर नेविगेट किया गया' : 'Navigated to B2B Bulk Buyer Desk',
      executed: true,
      source: 'realtime_nlp_rule'
    };
  }

  if (t.includes('admin') || t.includes('एडमिन') || t.includes('प्रशासन') || t.includes('कंसोल') || t.includes('control tower')) {
    return {
      action: 'NAVIGATE_MODULE',
      target: 'admin',
      speechReply: isHi ? 'प्रशासन कंसोल खोला जा रहा है। सुपर एडमिन नियंत्रण केंद्र में आपका स्वागत है।' : 'Opening Admin Console. Welcome to the Super Admin Governance Center.',
      displayText: isHi ? 'प्रशासन कंसोल पर नेविगेट किया गया' : 'Navigated to Admin Console',
      executed: true,
      source: 'realtime_nlp_rule'
    };
  }

  // 2. Theme Commands
  if (t.includes('dark') || t.includes('डार्क') || t.includes('रात') || t.includes('black') || t.includes('काला')) {
    return {
      action: 'SET_THEME',
      target: 'dark',
      speechReply: isHi ? 'डार्क मोड सक्रिय कर दिया गया है।' : 'Dark mode has been enabled.',
      displayText: isHi ? 'डार्क मोड सक्रिय' : 'Dark Mode Enabled',
      executed: true,
      source: 'realtime_nlp_rule'
    };
  }

  if (t.includes('light') || t.includes('लाइट') || t.includes('ब्राइट') || t.includes('उजाला') || t.includes('white') || t.includes('दिन')) {
    return {
      action: 'SET_THEME',
      target: 'light',
      speechReply: isHi ? 'लाइट मोड सक्रिय कर दिया गया है।' : 'Light mode has been enabled.',
      displayText: isHi ? 'लाइट मोड सक्रिय' : 'Light Mode Enabled',
      executed: true,
      source: 'realtime_nlp_rule'
    };
  }

  // 3. Language Commands
  if (t.includes('भाषा') || t.includes('language') || t.includes('बोली')) {
    if (t.includes('english') || t.includes('अंग्रेजी')) {
      return { action: 'SET_LANGUAGE', target: 'en', speechReply: 'Language switched to English.', displayText: 'Language: English', executed: true, source: 'realtime_nlp_rule' };
    }
    if (t.includes('hindi') || t.includes('हिन्दी')) {
      return { action: 'SET_LANGUAGE', target: 'hi', speechReply: 'भाषा हिन्दी में बदल दी गई है।', displayText: 'भाषा: हिन्दी', executed: true, source: 'realtime_nlp_rule' };
    }
    if (t.includes('punjabi') || t.includes('पंजाबी')) {
      return { action: 'SET_LANGUAGE', target: 'pa', speechReply: 'ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲ ਦਿੱਤੀ ਗਈ ਹੈ।', displayText: 'ਭਾਸ਼ਾ: ਪੰਜਾਬੀ', executed: true, source: 'realtime_nlp_rule' };
    }
    return {
      action: 'OPEN_MODAL',
      target: 'language',
      speechReply: isHi ? 'भाषा चयन मेनू खोला जा रहा है।' : 'Opening language selection menu.',
      displayText: isHi ? 'भाषा मेनू खोला गया' : 'Language Menu Opened',
      executed: true,
      source: 'realtime_nlp_rule'
    };
  }

  // 4. Panel Specific Commands
  if (t.includes('wheat') || t.includes('गेहूं') || t.includes('msp') || t.includes('समर्थन मूल्य') || t.includes('अनाज')) {
    return {
      action: 'FOCUS_PANEL',
      target: 'grain',
      speechReply: isHi ? 'गेहूं का सरकारी समर्थन मूल्य ₹2,275 प्रति क्विंटल है। 1 क्विंटल 100 किलोग्राम का होता है।' : 'Official MSP for Wheat is ₹2,275 per quintal (100 kg). Opening Grain & Crop Rates panel.',
      displayText: isHi ? 'गेहूं समर्थन मूल्य: ₹2,275 / क्विंटल' : 'Wheat MSP: ₹2,275 / Quintal',
      executed: true,
      source: 'realtime_nlp_rule'
    };
  }

  if (t.includes('vegetable') || t.includes('सब्जी') || t.includes('आलू') || t.includes('प्याज') || t.includes('टमाटर') || t.includes('potato') || t.includes('onion') || t.includes('tomato')) {
    return {
      action: 'FOCUS_PANEL',
      target: 'vegetable',
      speechReply: isHi ? 'सब्जी मंडी भाव: आलू ₹1,450, प्याज ₹2,100, टमाटर ₹1,850 प्रति क्विंटल। सब्जी बाजार पैनल दिखाया जा रहा है।' : 'Mandi Rates: Potato ₹1,450/Q, Onion ₹2,100/Q, Tomato ₹1,850/Q. Focusing on Vegetable Market panel.',
      displayText: isHi ? 'सब्जी मंडी भाव पैनल दिखाया गया' : 'Vegetable Mandi Panel Focused',
      executed: true,
      source: 'realtime_nlp_rule'
    };
  }

  if (t.includes('order') || t.includes('ऑर्डर') || t.includes('tracking') || t.includes('डिलीवरी')) {
    return {
      action: 'FOCUS_PANEL',
      target: 'orders',
      speechReply: isHi ? 'उपभोक्ता स्टोर के ऑर्डर और ट्रैकिंग पैनल पर ले जाया जा रहा है।' : 'Opening My Orders and Live Tracking panel.',
      displayText: isHi ? 'माई ऑर्डर्स पैनल खोला गया' : 'My Orders Panel Opened',
      executed: true,
      source: 'realtime_nlp_rule'
    };
  }

  if (t.includes('contract') || t.includes('अनुबंध') || t.includes('टेंडर')) {
    return {
      action: 'FOCUS_PANEL',
      target: 'contracts',
      speechReply: isHi ? 'सक्रिय अनुबंध और थोक खरीद समझौते दिखाए जा रहे हैं।' : 'Focusing on Active Contracts in Bulk Buyer Desk.',
      displayText: isHi ? 'सक्रिय अनुबंध पैनल' : 'Active Contracts Focused',
      executed: true,
      source: 'realtime_nlp_rule'
    };
  }

  if (t.includes('grid') || t.includes('ग्रिड') || t.includes('सभी पैनल') || t.includes('all panel')) {
    return {
      action: 'FOCUS_PANEL',
      target: 'grid',
      speechReply: isHi ? 'सभी 4 पैनल 2×2 ग्रिड व्यू में दिखाए जा रहे हैं।' : 'Showing all panels in balanced 2×2 grid layout.',
      displayText: isHi ? '2×2 ग्रिड व्यू' : '2×2 Grid View Enabled',
      executed: true,
      source: 'realtime_nlp_rule'
    };
  }

  // 5. Help / Capabilities
  if (t.includes('help') || t.includes('मदद') || t.includes('सहायता') || t.includes('क्या कर सकते हो') || t.includes('commands') || t.includes('कमांड')) {
    return {
      action: 'GENERAL',
      speechReply: isHi
        ? 'आप बोलकर कह सकते हैं: "उपभोक्ता स्टोर खोलो", "किसान हब खोलो", "डार्क मोड ऑन करो", "गेहूं का भाव बताओ", या "सब्जी मंडी भाव दिखाओ"।'
        : 'You can say: "Open Consumer Store", "Go to Farmer Hub", "Enable Dark Mode", "What is wheat MSP", or "Show vegetable mandi rates".',
      displayText: isHi ? 'उपलब्ध वॉयस कमांड्स: "उपभोक्ता स्टोर खोलो", "किसान हब", "डार्क मोड", "गेहूं भाव", "मंडी भाव"' : 'Available commands: "Open Consumer Store", "Go to Farmer Hub", "Enable Dark Mode", "What is wheat MSP"',
      executed: false,
      source: 'realtime_nlp_rule'
    };
  }

  // 6. General Agricultural / Platform Query Fallback
  const generalReply = buildLocalizedDashboardAnswer(transcript, language, {});
  return {
    action: 'GENERAL',
    speechReply: generalReply.split('\n\n')[0].replace(/[*#]/g, ''),
    displayText: generalReply,
    executed: false,
    source: 'realtime_nlp_rule'
  };
}

app.post('/api/ai/voice-command', async (req, res) => {
  try {
    const { transcript, language = 'hi', currentModule = 'farmer', apiKey } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      res.status(400).json({ error: 'A valid voice transcript is required.' });
      return;
    }

    const customKey = apiKey || req.headers['x-gemini-key'] as string || process.env.GEMINI_API_KEY;
    
    // First, test if command is an immediate local navigation / control intent
    const localResult = parseLocalizedVoiceCommand(transcript, language, currentModule);
    if (localResult.executed) {
      res.json(localResult);
      return;
    }

    // If not an exact navigation rule and custom/env key is available, call Gemini real-time API
    if (customKey) {
      try {
        const ai = getAIClient(customKey);
        const prompt = `You are the real-time AI voice assistant for "KishanSetu" Agricultural platform.
The user spoke this voice command in language "${language}": "${transcript}".

Analyze if this is an action command or a question.
Return ONLY valid JSON matching this schema:
{
  "action": "NAVIGATE_MODULE" | "FOCUS_PANEL" | "SET_THEME" | "SET_LANGUAGE" | "OPEN_MODAL" | "GENERAL",
  "target": string (optional: "farmer", "consumer", "bulk_buyer", "admin", "dark", "light", "hi", "en", "grain", "vegetable", "orders", "contracts", "grid"),
  "speechReply": string (a short, warm, spoken audio reply in "${language}" suitable for Text-to-Speech),
  "displayText": string (a helpful formatted display answer)
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        if (response.text) {
          try {
            const parsed = JSON.parse(response.text);
            res.json({
              ...parsed,
              executed: parsed.action !== 'GENERAL',
              source: 'gemini_cloud_live'
            });
            return;
          } catch (e) {
            // fallback to local result
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini cloud voice command execution notice:', geminiErr?.message);
      }
    }

    // Return the high-speed local NLP result
    res.json(localResult);
  } catch (err: any) {
    console.error('Error in /api/ai/voice-command:', err);
    res.status(500).json({
      action: 'GENERAL',
      speechReply: 'क्षमा करें, आदेश समझने में त्रुटि हुई। कृपया पुनः बोलें।',
      displayText: 'Voice command processing error. Please try again.',
      executed: false,
      source: 'error_fallback'
    });
  }
});

// ==========================================
// 🛡️ ADMIN DATABASE AUTHENTICATION & ACCESS API
// ==========================================

// 1. Admin Login & Database Verification
app.post('/api/auth/admin/login', (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      res.status(400).json({ success: false, error: 'Both User ID and Password are required.' });
      return;
    }

    const verification = platformDb.verifyAdminCredentials(userId, password);
    if (!verification.success || !verification.user) {
      res.status(401).json({ success: false, error: verification.error || 'Invalid Admin User ID or Password.' });
      return;
    }

    const session = platformDb.createSession(verification.user.id, verification.user.role);

    res.json({
      success: true,
      token: session.token,
      user: {
        id: verification.user.id,
        username: verification.user.username,
        email: verification.user.email,
        name: verification.user.name,
        role: verification.user.role,
        roleMeta: verification.user.roleMeta,
        mfaEnabled: verification.user.mfaEnabled,
        lastLogin: verification.user.lastLogin,
      },
    });
  } catch (err: any) {
    console.error('Error in /api/auth/admin/login:', err);
    res.status(500).json({ success: false, error: 'Internal server authentication error.' });
  }
});

// 2. Admin Session Verification
app.get('/api/auth/admin/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || (req.query.token as string);

    if (!token) {
      res.status(401).json({ valid: false, error: 'No authorization token provided.' });
      return;
    }

    const check = platformDb.verifySession(token);
    if (!check.valid || !check.user) {
      res.status(401).json({ valid: false, error: 'Admin session is invalid or has expired.' });
      return;
    }

    res.json({
      valid: true,
      user: {
        id: check.user.id,
        username: check.user.username,
        email: check.user.email,
        name: check.user.name,
        role: check.user.role,
        roleMeta: check.user.roleMeta,
      },
    });
  } catch (err: any) {
    res.status(500).json({ valid: false, error: 'Session verification error.' });
  }
});

// 3. Update Admin Credentials (User ID / Password) in Database
app.post('/api/auth/admin/update-credentials', (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword, newEmail } = req.body;
    if (!currentPassword) {
      res.status(400).json({ success: false, error: 'Current master password is required to authorize changes.' });
      return;
    }

    const admin = platformDb.getAdminUser();
    if (!admin) {
      res.status(404).json({ success: false, error: 'Admin account not found in database.' });
      return;
    }

    const verify = platformDb.verifyAdminCredentials(admin.username, currentPassword);
    if (!verify.success) {
      res.status(401).json({ success: false, error: 'Current password verification failed. Access denied.' });
      return;
    }

    const updated = platformDb.updateAdminCredentials(
      admin.username,
      newUsername || admin.username,
      newPassword,
      newEmail
    );

    if (!updated.success) {
      res.status(400).json({ success: false, error: updated.error });
      return;
    }

    res.json({
      success: true,
      message: 'Admin credentials updated and persisted to database successfully.',
      user: {
        username: updated.user?.username,
        email: updated.user?.email,
        name: updated.user?.name,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to update credentials.' });
  }
});

// 4. Inspect Database Health & Admin Status
app.get('/api/admin/db-status', (_req, res) => {
  try {
    res.json(platformDb.getDatabaseStats());
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to read database statistics.' });
  }
});

// ==========================================
// ⚡ SUPABASE CLOUD DATABASE ENDPOINTS
// ==========================================

// 5. Inspect Supabase Cloud Connection & Sync Status
app.get('/api/supabase/status', async (_req, res) => {
  try {
    const status = await supabaseService.getStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to retrieve Supabase status' });
  }
});

// 6. Fetch Government MSP Rates (Supabase + local fallback)
app.get('/api/data/msp-rates', async (_req, res) => {
  try {
    const result = await supabaseService.getMspRates();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve MSP benchmark rates.' });
  }
});

// 7. Fetch Daily Mandi Vegetable Rates (Supabase + local fallback)
app.get('/api/data/mandi-rates', async (_req, res) => {
  try {
    const result = await supabaseService.getMandiRates();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve mandi rates.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 KishanSetu Platform running on http://localhost:${PORT}`);
  });
}

startServer();
