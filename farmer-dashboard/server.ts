import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization for Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured. Please add it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Fallback knowledge engine when GEMINI_API_KEY is not configured in secrets
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
  const isScheme = q.includes('scheme') || q.includes('pm-kisan') || q.includes('kisan') || q.includes('pmfby') || q.includes('yojana') || q.includes('योजना') || q.includes('बीमा') || q.includes('ਕਿਸਾਨ') || q.includes('योजना');
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

// Gemini AI Assistant endpoint for Farmer Dashboard questions
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

    // If Gemini key is not configured, reply immediately using local agricultural dataset in requested language
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

    const systemInstruction = `You are "Kisan Sahayak" (किसान सहायक / Kisan Mitra), a warm, caring, highly knowledgeable agricultural companion and village guide talking directly to a farmer.

CRITICAL INSTRUCTION - SELECTED LANGUAGE:
The farmer has explicitly chosen to speak in: ${targetLang.name}.
${targetLang.instruction}
Always answer in this selected language without fail.

CRITICAL INSTRUCTION - HUMAN-FRIENDLY TONE:
1. Warmth & Respect: Greet the farmer with heartfelt respect (e.g. "राम राम किसान भाई!", "Sat Sri Akal", or "Namaste Farmer Friend!"). Talk like an experienced, caring local farmer guide or Krishi Vigyan Kendra elder brother, NOT a dry robot or corporate manual.
2. Empathy & Clarity: Farming is hard work. Be encouraging and respectful of their labor. Never use robotic phrases like "Based on the provided context" or "According to the JSON database". Instead say: "जैसा कि आपके इस पेज पर दिख रहा है..." or "आपके डैशबोर्ड में...".
3. Farmer Math Made Simple: When answering about quintals or rates, always remind that 1 क्विंटल = 100 किलोग्राम (100 kg), and show the math step-by-step so the farmer can verify it with total peace of mind (e.g., "25 क्विंटल × ₹2,275 प्रति क्विंटल = कुल ₹56,875").
4. Actionable Advice: If answering about crops or diseases, give practical, doable advice (organic neem spray, proper drying to 12% moisture to avoid घुन/weevils, checking moisture before taking to mandi).
5. Explain Page Features Clearly: If the question touches on verification or calculation, guide them simply where to click or type on this page (e.g., "आप ऊपर 'Crop Rates' बॉक्स में अपनी मात्रा लिखकर भी सीधा जोड़ देख सकते हैं").

DATA AVAILABLE ON THIS FARMER DASHBOARD PAGE:

1. GRAIN & CROP MSP RATES (न्यूनतम समर्थन मूल्य 2025-26):
- Wheat (गेहूं): ₹2,275 / क्विंटल (₹2,275 per 100 kg)
- Paddy / Rice (धान - Common grade): ₹2,183 / क्विंटल
- Maize (मक्का): ₹2,090 / क्विंटल
- Mustard (सरसों): ₹5,650 / क्विंटल
- Gram / Chana (चना): ₹5,440 / क्विंटल
- Bajra (बाजरा): ₹2,500 / क्विंटल
- The farmer can input their harvest in quintals to see instant calculated returns.

2. VEGETABLE MARKET MANDI RATES (ताजा थोक मंडी भाव):
- Potato (आलू): ₹1,450 / क्विंटल (Agra / Indore Mandi)
- Onion (प्याज): ₹2,100 / क्विंटल (Nashik / Lasalgaon Mandi)
- Tomato (टमाटर): ₹1,850 / क्विंटल (Kolar / Madanapalle Mandi)
- Green Pea (मटर): ₹3,600 / क्विंटल (Jabalpur Mandi)
- Cauliflower (फूलगोभी): ₹1,600 / क्विंटल (Hapur Mandi)
- Green Chilli (हरी मिर्च): ₹4,200 / क्विंटल (Guntur Mandi)

3. CROP PRODUCTION & SCIENTIFIC GUIDANCE (कृषि वैज्ञानिक सलाह):
- मिट्टी की तैयारी (Soil Prep): गहरी ग्रीष्मकालीन जुताई, 8-10 टन सड़ी गोबर खाद/एकड़, मिट्टी परीक्षण pH (6.5-7.5)।
- बुवाई व सिंचाई (Sowing & Irrigation): प्रमाणित बीज, एजोटोबैक्टर उपचार। गेहूं में 20-25 दिन पर पहली सिंचाई (CRI/ताजमूल अवस्था) सबसे आवश्यक है। ड्रिप/स्प्रिंकलर से 40-50% पानी की बचत।
- कीट व रोग नियंत्रण (Pest Control): माहू (aphids) व सफेद मक्खी के लिए 1500ppm नीम का तेल छिड़कें, बीजोपचार के लिए ट्राइकोडर्मा, फेरोमोन ट्रैप लगाएं।
- कटाई व सुरक्षित भंडारण (Harvest & Storage): फसल में 10-12% से कम नमी होने पर ही भंडारित करें ताकि घुन न लगे। नीम की सूखी पत्तियां या जीआई साइलो टंकी का प्रयोग करें।

4. GOVERNMENT SCHEMES & BENEFITS (सरकारी योजनाएं):
- PM-KISAN: ₹6,000 प्रति वर्ष (₹2,000 की 3 किस्तें सीधे बैंक खाते में)।
- PMFBY (फसल बीमा): रबी फसल पर मात्र 1.5%, खरीफ पर 2%, बागवानी पर 5% प्रीमियम। बेमौसम बारिश, पाला या ओलावृष्टि से सुरक्षा।
- Kisan Credit Card (KCC): समय पर चुकाने पर मात्र 4% ब्याज दर पर ₹3 लाख तक ऋण, ₹1.6 लाख तक बिना बंधक।
- Soil Health Card (मृदा स्वास्थ्य कार्ड): 3 साल में 1 बार 12 पोषक तत्वों की मुफ्त जांच।
- PM Krishi Sinchayee: ड्रिप और स्प्रिंकलर पर 45% से 55% तक सरकारी सब्सिडी।
- e-NAM: देश की 1400+ मंडियों से ऑनलाइन बोली लगाकर फसल बेचने की सुविधा।

5. AADHAAR VERIFICATION (आधार सत्यापन व किसान पंजीकरण):
- किसान अपना आधार कार्ड और खेत का ब्यौरा अपलोड करते हैं।
- ब्लॉक कृषि अधिकारी (BAO) द्वारा जांच के बाद पक्का किसान पंजीकरण नंबर (Kisan ID) जारी होता है।
- इससे सरकारी खरीद केंद्र (Procurement Mandi) पर टोकन और PM-KISAN की राशि बिना रुकावट सीधे खाते में मिलती है।

FARMER'S CURRENT DASHBOARD CONTEXT:
${JSON.stringify(context, null, 2)}

FORMATTING RULES:
- Use bold text for key prices, numbers, and crop names.
- Keep paragraphs short and friendly.
- Conclude with a warm, encouraging closing (e.g. "कोई और भी शंका हो तो पूछिए, आपकी सेवा में हमेशा तैयार हूँ!").`;

    // Construct contents from history and current question
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I could not generate an answer at this moment. Please try again.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error in /api/ai/ask, falling back to localized answer:', error);
    const fallbackReply = buildLocalizedDashboardAnswer(
      req.body?.question || '',
      req.body?.language || 'hi',
      req.body?.context || {}
    );
    res.json({ reply: fallbackReply });
  }
});

async function startServer() {
  // Setup Vite middleware in dev or static files in production
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
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
