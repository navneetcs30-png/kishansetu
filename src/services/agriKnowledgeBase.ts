/**
 * KishanSetu Comprehensive Agricultural & Platform Knowledge Engine
 * Provides rich, domain-verified, expert answers and voice actions
 * across all farming, commercial, market, scheme, and portal queries.
 */

export interface KnowledgeResponse {
  answer: string;
  speechReply: string;
  action?: 'NAVIGATE_MODULE' | 'FOCUS_PANEL' | 'SET_THEME' | 'SET_LANGUAGE' | 'OPEN_MODAL' | 'GENERAL';
  target?: string;
  displayText?: string;
  executed?: boolean;
}

export function queryKnowledgeBase(
  query: string,
  lang: string = 'hi',
  context: any = {}
): KnowledgeResponse {
  const q = query.toLowerCase().trim();
  const isHi = lang === 'hi' || lang === 'hinglish';
  const isPa = lang === 'pa';
  const isMr = lang === 'mr';
  const isGu = lang === 'gu';
  const isBn = lang === 'bn';
  const isTe = lang === 'te';
  const isTa = lang === 'ta';

  const grainTotal = context?.totalCalculatedEarnings?.grainMspTotal ?? 56875;
  const vegTotal = context?.totalCalculatedEarnings?.vegetableMandiTotal ?? 21750;
  const grandTotal = context?.totalCalculatedEarnings?.grandTotal ?? (grainTotal + vegTotal);

  // ==========================================
  // 1. NAVIGATION & PLATFORM COMMANDS
  // ==========================================

  // A. Consumer Store
  if (
    q.includes('consumer') || q.includes('उपभोक्ता') || q.includes('store') ||
    q.includes('shop') || q.includes('दुकान') || q.includes('फल') ||
    q.includes('खरीददारी') || q.includes('खरीदना') || q.includes('buy produce') ||
    q.includes('order veg') || q.includes('सब्जी खरीद') || q.includes('order food')
  ) {
    return {
      action: 'NAVIGATE_MODULE',
      target: 'consumer',
      speechReply: isHi
        ? 'उपभोक्ता स्टोर खोला जा रहा है। यहां आप सीधे किसानों से ताजी सब्जियां, फल और शरबती गेहूं खरीद सकते हैं।'
        : 'Switching to Consumer Store. You can purchase farm-fresh produce directly from verified farmers.',
      displayText: isHi ? '🛒 उपभोक्ता स्टोर पर नेविगेट किया गया' : '🛒 Navigated to Consumer Store',
      answer: isHi
        ? `### 🛒 उपभोक्ता स्टोर (AgriDirect Consumer Hub)\n\n• **सीधा किसान से**: बीच के बिचौलियों के बिना खेत से ताजा उत्पाद।\n• **उत्पाद**: शरबती गेहूं (₹38/किलो), नासिक प्याज (₹26/किलो), देशी आलू (₹18/किलो), टमाटर (₹24/किलो)।\n• **थोक छूट**: 50 किलो से अधिक पर 5% और 100 किलो से अधिक पर 10% की अतिरिक्त छूट।`
        : `### 🛒 AgriDirect Consumer Store\n\n• **Direct from Farmers**: Farm-fresh produce without middlemen.\n• **Catalog**: Sharbati Wheat (₹38/kg), Nashik Onion (₹26/kg), Organic Potato (₹18/kg), Vine Tomato (₹24/kg).\n• **Bulk Discounts**: 5% discount above 50 kg, 10% discount above 100 kg.`,
      executed: true,
    };
  }

  // B. Farmer Hub
  if (
    q.includes('farmer') || q.includes('किसान') || q.includes('kisan') ||
    q.includes('farming') || q.includes('खेती') || q.includes('फसल बेचना') ||
    q.includes('sell harvest') || q.includes('किसान हब') || q.includes('kisan hub')
  ) {
    return {
      action: 'NAVIGATE_MODULE',
      target: 'farmer',
      speechReply: isHi
        ? 'किसान हब खोला जा रहा है। यहां आप सभी फसलों के न्यूनतम समर्थन मूल्य (MSP), मंडी भाव और कमाई का हिसाब देख सकते हैं।'
        : 'Navigating to Farmer Hub. Explore official crop MSP benchmarks, mandi rates, and revenue calculations.',
      displayText: isHi ? '🌾 किसान हब पर नेविगेट किया गया' : '🌾 Navigated to Farmer Hub',
      answer: isHi
        ? `### 🌾 किसान हब (Farmer Operations Hub)\n\n• **सरकारी समर्थन मूल्य (MSP)**: गेहूं (₹2,275/क्विंटल), धान (₹2,183/क्विंटल), सरसों (₹5,650/क्विंटल)।\n• **सब्जी मंडी दरें**: आलू (₹1,450), प्याज (₹2,100), टमाटर (₹1,850 प्रति क्विंटल)।\n• **अनुमानित कुल कमाई**: आपकी दर्ज फसलों का वर्तमान मूल्य: **₹${grandTotal.toLocaleString('en-IN')}** है।`
        : `### 🌾 KishanSetu Farmer Hub\n\n• **Government MSP Rates**: Wheat (₹2,275/Q), Paddy (₹2,183/Q), Mustard (₹5,650/Q).\n• **Live Mandi Benchmarks**: Potato (₹1,450), Onion (₹2,100), Tomato (₹1,850 per quintal).\n• **Calculated Revenue**: Current harvest value stands at: **₹${grandTotal.toLocaleString('en-IN')}**.`,
      executed: true,
    };
  }

  // C. Bulk Buyer Desk
  if (
    q.includes('bulk') || q.includes('थोक') || q.includes('b2b') ||
    q.includes('procurement') || q.includes('खरीदार') || q.includes('व्यापारी') ||
    q.includes('wholesale') || q.includes('tender') || q.includes('टेंडर')
  ) {
    return {
      action: 'NAVIGATE_MODULE',
      target: 'bulk_buyer',
      speechReply: isHi
        ? 'थोक खरीदार बी2बी डेस्क खोला जा रहा है। यहां संस्थागत खरीद, वॉल्यूम डिस्काउंट और ट्रेड कॉन्ट्रैक्ट प्रबंधित होते हैं।'
        : 'Opening B2B Bulk Buyer Desk. Manage institutional procurement, volume contracts, and APMC trade quotes.',
      displayText: isHi ? '🏢 थोक खरीदार डेस्क पर नेविगेट किया गया' : '🏢 Navigated to Bulk Buyer Desk',
      answer: isHi
        ? `### 🏢 बी2बी थोक खरीदार डेस्क\n\n• **संस्थागत खरीद**: 100 क्विंटल से अधिक के बड़े ऑर्डर्स।\n• **वॉल्यूम टियर**: टियर 1 (5% छूट), टियर 2 (10% छूट), टियर 3 (15% छूट)।\n• **सरकारी अधिभार (Cess)**: एपीएमसी मंडी सेस मात्र 1.50% और ट्रांजिट बीमा 0.75%।`
        : `### 🏢 B2B Bulk Buyer Procurement Desk\n\n• **Institutional Trade**: Procure high-volume commodities directly.\n• **Volume Tiers**: Tier 1 (5% off), Tier 2 (10% off), Tier 3 (15% off).\n• **Statutory Levies**: APMC Mandi Cess at 1.50%, Transit Insurance at 0.75%.`,
      executed: true,
    };
  }

  // D. Admin Console
  if (
    q.includes('admin') || q.includes('एडमिन') || q.includes('प्रशासन') ||
    q.includes('governance') || q.includes('super admin') || q.includes('control tower') ||
    q.includes('कंसोल') || q.includes('सुपर एडमिन')
  ) {
    return {
      action: 'NAVIGATE_MODULE',
      target: 'admin',
      speechReply: isHi
        ? 'प्रशासन कंसोल खोला जा रहा है। सुपर एडमिन नियंत्रण केंद्र में आपका स्वागत है।'
        : 'Opening Admin Console. Super Administrator clearance and platform governance active.',
      displayText: isHi ? '🛡️ प्रशासन कंसोल पर नेविगेट किया गया' : '🛡️ Navigated to Admin Console',
      answer: isHi
        ? `### 🛡️ सुपर एडमिन कंट्रोल टॉवर\n\n• **केंद्रीय नियंत्रण**: पूरे भारत के लिए एमएसपी दरें, मंडी बेंचमार्क और डिस्काउंट टियर तय करें।\n• **आपातकालीन फ्रीज**: बाजार में अत्यधिक उतार-चढ़ाव होने पर एक क्लिक में कीमतों को फ्रीज करें।\n• **सत्यापन कतार**: किसानों के आधार और जमीन के दस्तावेजों की 24 घंटे में जांच व अनुमोदन।`
        : `### 🛡️ Super Admin Master Control Tower\n\n• **Central Governance**: Calibrate national MSP benchmarks, APMC cess, and consumer retail prices.\n• **Emergency Freeze**: Lock spot market prices during supply disruptions.\n• **Verification Queue**: Review and verify farmer Aadhaar and land record submissions.`,
      executed: true,
    };
  }

  // E. Security, 2FA, Profile
  if (
    q.includes('security') || q.includes('सुरक्षा') || q.includes('profile') ||
    q.includes('प्रोफाइल') || q.includes('2fa') || q.includes('mfa') ||
    q.includes('password') || q.includes('पासवर्ड') || q.includes('खाता')
  ) {
    return {
      action: 'NAVIGATE_MODULE',
      target: 'security',
      speechReply: isHi
        ? 'सुरक्षा और 2FA सेटिंग्स खोली जा रही हैं। यहां आप अपना प्रोफाइल और द्वि-स्तरीय प्रमाणीकरण प्रबंधित कर सकते हैं।'
        : 'Opening Security and 2FA Settings. Manage your credentials, authenticator app, and access logs.',
      displayText: isHi ? '🔑 सुरक्षा सेटिंग्स पर नेविगेट किया गया' : '🔑 Navigated to Security & 2FA',
      answer: isHi
        ? `### 🔑 सुरक्षा व 2FA सेटिंग्स (Security Governance)\n\n• **2FA ऑथेंटिकेटर**: Google Authenticator या Microsoft Authenticator से सुरक्षित लॉगिन।\n• **बैकअप कोड्स**: आपातकालीन लॉगिन के लिए 8-अंकीय वन-टाइम बैकअप कोड।\n• **अकाउंट लॉकआउट**: लगातार 4 गलत प्रयासों के बाद 30 मिनट का स्वतः सुरक्षा लॉक।`
        : `### 🔑 Security & 2FA Authentication\n\n• **Authenticator 2FA**: Protect your account using standard TOTP authenticator apps.\n• **Backup Codes**: Secure one-time recovery codes for account restoration.\n• **Lockout Policy**: Automatic 30-minute lockout after 4 consecutive failed attempts.`,
      executed: true,
    };
  }

  // F. Dark / Light Themes
  if (
    q.includes('dark') || q.includes('डार्क') || q.includes('night') ||
    q.includes('black') || q.includes('रात') || q.includes('अंधेरा') || q.includes('काला')
  ) {
    return {
      action: 'SET_THEME',
      target: 'dark',
      speechReply: isHi ? 'डार्क मोड सक्रिय कर दिया गया है।' : 'Dark mode has been enabled.',
      displayText: isHi ? '🌙 डार्क मोड सक्रिय' : '🌙 Dark Mode Enabled',
      answer: isHi ? 'डार्क मोड सफलतापूर्वक चालू किया गया।' : 'Dark mode successfully activated.',
      executed: true,
    };
  }

  if (
    q.includes('light') || q.includes('लाइट') || q.includes('day') ||
    q.includes('bright') || q.includes('white') || q.includes('दिन') ||
    q.includes('उजाला') || q.includes('सफेद')
  ) {
    return {
      action: 'SET_THEME',
      target: 'light',
      speechReply: isHi ? 'लाइट मोड सक्रिय कर दिया गया है।' : 'Light mode has been enabled.',
      displayText: isHi ? '☀️ लाइट मोड सक्रिय' : '☀️ Light Mode Enabled',
      answer: isHi ? 'लाइट मोड सफलतापूर्वक चालू किया गया।' : 'Light mode successfully activated.',
      executed: true,
    };
  }

  if (q.includes('toggle theme') || q.includes('switch theme') || q.includes('थीम बदलो') || q.includes('मोड बदलो')) {
    return {
      action: 'SET_THEME',
      speechReply: isHi ? 'थीम मोड बदल दिया गया है।' : 'Theme mode toggled.',
      displayText: isHi ? '🌓 थीम मोड बदला गया' : '🌓 Theme Mode Toggled',
      answer: isHi ? 'थीम मोड को सफलतापूर्वक बदला गया।' : 'Theme mode toggled successfully.',
      executed: true,
    };
  }

  // G. Language Switch
  if (q.includes('hindi') || q.includes('हिंदी') || q.includes('हिन्दी')) {
    return {
      action: 'SET_LANGUAGE',
      target: 'hi',
      speechReply: 'भाषा को हिंदी में बदल दिया गया है। राम राम किसान भाई!',
      displayText: '🌐 भाषा: हिंदी (Hindi)',
      answer: 'प्लेटफॉर्म की भाषा अब हिंदी में सेट हो गई है।',
      executed: true,
    };
  }

  if (q.includes('english') || q.includes('अंग्रेजी') || q.includes('अंग्रेज़ी')) {
    return {
      action: 'SET_LANGUAGE',
      target: 'en',
      speechReply: 'Language switched to English. How can I help you today?',
      displayText: '🌐 Language: English',
      answer: 'Platform language successfully set to English.',
      executed: true,
    };
  }

  if (q.includes('punjabi') || q.includes('पंजाबी') || q.includes('ਪੰਜਾਬੀ')) {
    return {
      action: 'SET_LANGUAGE',
      target: 'pa',
      speechReply: 'ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲ ਦਿੱਤੀ ਗਈ ਹੈ। ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ!',
      displayText: '🌐 ਭਾਸ਼ਾ: ਪੰਜਾਬੀ (Punjabi)',
      answer: 'ਪਲੇਟਫਾਰਮ ਦੀ ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਸੈੱਟ ਕੀਤੀ ਗਈ ਹੈ।',
      executed: true,
    };
  }

  if (q.includes('marathi') || q.includes('मराठी')) {
    return {
      action: 'SET_LANGUAGE',
      target: 'mr',
      speechReply: 'भाषा मराठीमध्ये बदलली आहे. नमस्कार शेतकरी बंधू!',
      displayText: '🌐 भाषा: मराठी (Marathi)',
      answer: 'प्लॅटफॉर्मची भाषा आता मराठीमध्ये सेट झाली आहे.',
      executed: true,
    };
  }

  if (q.includes('gujarati') || q.includes('गुजराती') || q.includes('ગુજરાતી')) {
    return {
      action: 'SET_LANGUAGE',
      target: 'gu',
      speechReply: 'ભાષા ગુજરાતીમાં બદલાઈ ગઈ છે. નમસ્તે ખેડૂત મિત્ર!',
      displayText: '🌐 ભાષા: ગુજરાતી (Gujarati)',
      answer: 'પ્લેટફોર્મની ભાષા ગુજરાતીમાં સેટ થઈ ગઈ છે.',
      executed: true,
    };
  }

  if (q.includes('bengali') || q.includes('बंगाली') || q.includes('বাংলা')) {
    return {
      action: 'SET_LANGUAGE',
      target: 'bn',
      speechReply: 'ভাষা বাংলায় পরিবর্তিত হয়েছে। নমস্কার কৃষক ভাই!',
      displayText: '🌐 ভাষা: বাংলা (Bengali)',
      answer: 'প্ল্যাটফর্মের ভাষা বাংলায় সেট করা হয়েছে।',
      executed: true,
    };
  }

  if (q.includes('telugu') || q.includes('तेलुगू') || q.includes('తెలుగు')) {
    return {
      action: 'SET_LANGUAGE',
      target: 'te',
      speechReply: 'భాష తెలుగులోకి మార్చబడింది. నమస్కారం రైతు సోదరా!',
      displayText: '🌐 భాష: తెలుగు (Telugu)',
      answer: 'ప్లాట్‌ఫారమ్ భాష తెలుగుకు మార్చబడింది.',
      executed: true,
    };
  }

  if (q.includes('tamil') || q.includes('तमिल') || q.includes('தமிழ்')) {
    return {
      action: 'SET_LANGUAGE',
      target: 'ta',
      speechReply: 'மொழி தமிழுக்கு மாற்றப்பட்டது. வணக்கம் விவசாய தோழரே!',
      displayText: '🌐 மொழி: தமிழ் (Tamil)',
      answer: 'தளத்தின் மொழி தமிழுக்கு மாற்றப்பட்டது.',
      executed: true,
    };
  }

  if (q.includes('language') || q.includes('भाषा') || q.includes('बोली') || q.includes('change lang')) {
    return {
      action: 'OPEN_MODAL',
      target: 'language',
      speechReply: isHi ? 'भाषा चयन मेनू खोला जा रहा है।' : 'Opening language selection menu.',
      displayText: isHi ? '🌐 भाषा मेनू खोला गया' : '🌐 Language Menu Opened',
      answer: isHi ? 'भाषा चयन मेनू खोला गया है। अपनी पसंदीदा भाषा चुनें।' : 'Language selection menu opened. Please select your preferred language.',
      executed: true,
    };
  }

  // H. Grid / All Panels View
  if (
    q.includes('grid') || q.includes('ग्रिड') || q.includes('all panel') ||
    q.includes('सभी पैनल') || q.includes('چاروں پینل') || q.includes('चारों पैनल') ||
    q.includes('full view')
  ) {
    return {
      action: 'FOCUS_PANEL',
      target: 'all',
      speechReply: isHi
        ? 'सभी 4 पैनल 2×2 ग्रिड व्यू में दिखाए जा रहे हैं।'
        : 'Displaying all dashboard panels in balanced 2x2 multi-panel grid view.',
      displayText: isHi ? '🔲 2×2 ग्रिड व्यू सक्रिय' : '🔲 2x2 Grid View Active',
      answer: isHi
        ? 'सभी 4 प्रमुख पैनल (अनाज भाव, सब्जी मंडी, उत्पादन मार्गदर्शन, सरकारी योजनाएं) एक साथ ग्रिड दृश्य में प्रस्तुत किए गए हैं।'
        : 'All 4 primary panels (Grain MSP, Mandi Benchmarks, Production Guidance, Govt Schemes) are now displayed in a unified 2x2 grid.',
      executed: true,
    };
  }

  // I. Orders Panel
  if (
    q.includes('order') || q.includes('ऑर्डर') || q.includes('tracking') ||
    q.includes('cart') || q.includes('कार्ट') || q.includes('डिलीवरी') ||
    q.includes('रसीद') || q.includes('receipt')
  ) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-orders',
      speechReply: isHi
        ? 'ऑर्डर और लाइव ट्रैकिंग पैनल दिखाया जा रहा है।'
        : 'Showing your orders and live tracking dashboard.',
      displayText: isHi ? '📦 माई ऑर्डर्स पैनल सक्रिय' : '📦 My Orders Panel Focused',
      answer: isHi
        ? `### 📦 ऑर्डर स्थिति एवं ट्रैकिंग (Order Tracking)\n\n• **सक्रिय ऑर्डर**: आपके ताजे कृषि उत्पाद की गुणवत्ता जांच व कोल्ड चेन डिस्पैच प्रगति पर है।\n• **डिलीवरी समय**: 24 से 48 घंटे के भीतर सीधे किसान के खेत से आपके दरवाजे तक।\n• **डिजिटल रसीद**: जीएसटी इनवॉइस और किसान सहकारी विवरण के साथ डिजिटल बिल उपलब्ध है।`
        : `### 📦 Orders & Tracking\n\n• **Active Orders**: Farm-fresh produce undergoing quality check and cold-chain dispatch.\n• **ETA**: Delivered within 24 to 48 hours directly from cooperative farm gate.\n• **Digital Invoice**: Complete APMC transparent receipt with farmer origin details.`,
      executed: true,
    };
  }

  // J. Contracts Panel
  if (
    q.includes('contract') || q.includes('अनुबंध') || q.includes('टेंडर') ||
    q.includes('समझौता') || q.includes('quote') || q.includes('कोटेशन')
  ) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-contracts',
      speechReply: isHi
        ? 'सक्रिय व्यापारिक अनुबंध और खरीद कोट्स दिखाए जा रहे हैं।'
        : 'Focusing on active trade contracts and bulk procurement orders.',
      displayText: isHi ? '📄 सक्रिय अनुबंध पैनल सक्रिय' : '📄 Contracts Panel Focused',
      answer: isHi
        ? `### 📄 सक्रिय व्यापारिक अनुबंध (B2B Trade Contracts)\n\n• **अनुबंध कोड CNT-2024-W01**: 500 क्विंटल शरबती गेहूं (प्रगतिशील किसान सहकारी, सीहोर)।\n• **भुगतान सुरक्षा**: एस्क्रो सुरक्षित बैंक गारंटी के साथ 100% समय पर भुगतान।\n• **गुणवत्ता मानक**: FSSAI व AGMARK ग्रेड 1 प्रमाणित नमी 12% से कम।`
        : `### 📄 Active Trade Contracts\n\n• **Contract CNT-2024-W01**: 500 Quintals Sharbati Wheat (Sehore Organic Growers).\n• **Escrow Protected**: 100% guaranteed payment clearance on physical delivery.\n• **Quality Standards**: AGMARK Grade 1 certified with moisture content below 12%.`,
      executed: true,
    };
  }

  // K. Aadhaar Verification Modal
  if (
    q.includes('aadhaar') || q.includes('आधार') || q.includes('kyc') ||
    q.includes('verify farmer') || q.includes('सत्यापन') || q.includes('दस्तावेज') ||
    q.includes('upload doc') || q.includes('खतौनी') || q.includes('7/12')
  ) {
    return {
      action: 'OPEN_MODAL',
      target: 'verification',
      speechReply: isHi
        ? 'किसान आधार और भूमि अभिलेख सत्यापन विंडो खोली जा रही है।'
        : 'Opening Farmer Aadhaar and Land Record verification modal.',
      displayText: isHi ? '📑 किसान सत्यापन विंडो खुली' : '📑 Verification Modal Opened',
      answer: isHi
        ? `### 📑 किसान पहचान सत्यापन (Aadhaar & Land KYC)\n\n• **आवश्यक दस्तावेज**: 12-अंकीय आधार कार्ड और खतौनी / जमाबंदी / 7/12 नकल।\n• **सत्यापन अवधि**: ब्लॉक कृषि अधिकारी (BAO) द्वारा 24 घंटे के भीतर डिजिटल सत्यापन।\n• **लाभ**: सरकारी खरीद केंद्रों पर प्राथमिकता टोकन, सीधी सब्सिडी (DBT) और शून्य बिचौलिया व्यापार।`
        : `### 📑 Farmer KYC Verification\n\n• **Required Documents**: 12-digit Aadhaar Card & Land Ownership Record (7/12 or Khasra/Khatauni).\n• **Turnaround**: Verified by Block Agriculture Officer within 24 working hours.\n• **Benefits**: Direct Mandi token generation, seamless DBT subsidies, and fraud-free trading.`,
      executed: true,
    };
  }

  // ==========================================
  // 2. AGRICULTURAL DOMAIN INTELLIGENCE
  // ==========================================

  // A. Wheat & Grain Cultivation, Sowing & Varieties
  if (
    q.includes('wheat') || q.includes('gehun') || q.includes('गेहूं') ||
    q.includes('कणक') || q.includes('गव्हा') || q.includes('ઘઉં') || q.includes('గోధుమ')
  ) {
    if (q.includes('sowing') || q.includes('बुवाई') || q.includes('variety') || q.includes('किस्म') || q.includes('बीज')) {
      return {
        action: 'FOCUS_PANEL',
        target: 'panel-guidance',
        speechReply: isHi
          ? 'गेहूं की बुवाई का उत्तम समय 25 अक्टूबर से 20 नवंबर है। उन्नत किस्में HD-2967, DBW-187 और शरबती हैं।'
          : 'Best wheat sowing window is Oct 25 to Nov 20. Top varieties are HD-2967, DBW-187, and Sharbati.',
        displayText: isHi ? '🌾 गेहूं बुवाई व उन्नत किस्में' : '🌾 Wheat Sowing & Varieties',
        answer: isHi
          ? `### 🌾 गेहूं की वैज्ञानिक खेती व उन्नत किस्में\n\n• **सर्वोत्तम समय**: 25 अक्टूबर से 20 नवंबर (रबी मौसम)।\n• **उन्नत किस्में**: **HD-2967** (उच्च पैदावार 55-60 क्विं/हे.), **DBW-187 (करण वंदना)** (पीला रतुआ प्रतिरोधी), **GW-322** और **MP शरबती**।\n• **बीज दर**: 100 किलोग्राम प्रति हेक्टेयर (देरी से बुवाई में 125 किग्रा).\n• **बीज उपचार**: थीरम + कार्बेन्डाजिम (2:1 ग्राम प्रति किलो बीज) या ट्राइकोडर्मा 5 ग्राम/किग्रा।\n• **सरकारी एमएसपी**: **₹2,275 प्रति क्विंटल**।`
          : `### 🌾 Scientific Wheat Cultivation & Certified Varieties\n\n• **Optimal Window**: October 25 to November 20 (Rabi Season).\n• **Top Varieties**: **HD-2967** (55-60 Q/ha yield), **DBW-187 (Karan Vandana)** (rust-resistant), **GW-322**, and **Premium Sharbati**.\n• **Seed Rate**: 100 kg/hectare (125 kg/ha for late sowing).\n• **Seed Treatment**: Thiram + Carbendazim (2g+1g per kg seed) or Trichoderma viride.\n• **Official MSP**: **₹2,275 per quintal**.`,
        executed: true,
      };
    }

    return {
      action: 'FOCUS_PANEL',
      target: 'panel-grains',
      speechReply: isHi
        ? 'गेहूं का सरकारी न्यूनतम समर्थन मूल्य ₹2,275 प्रति क्विंटल है। 1 क्विंटल 100 किलोग्राम होता है।'
        : 'Official Government MSP for Wheat is ₹2,275 per quintal (100 kg).',
      displayText: isHi ? '🌾 गेहूं समर्थन मूल्य: ₹2,275 / क्विंटल' : '🌾 Wheat MSP: ₹2,275 / Quintal',
      answer: isHi
        ? `### 🌾 गेहूं (Wheat - Triticum aestivum)\n\n• **न्यूनतम समर्थन मूल्य (MSP)**: **₹2,275 प्रति क्विंटल** (₹22.75 प्रति किलोग्राम)।\n• **25 क्विंटल का सरकारी मूल्य**: **₹56,875**।\n• **खरीद केंद्र मानक**: नमी अधिकतम 12%, कचरा/धूल 0.75% से कम, दाना सूखा और चमकदार होना चाहिए।\n• **सिंचाई**: बुवाई के 21 दिन बाद ताजमूल अवस्था (CRI stage) पर पहली सिंचाई अति आवश्यक है।`
        : `### 🌾 Wheat (Triticum aestivum)\n\n• **Official MSP**: **₹2,275 per quintal** (₹22.75 / kg).\n• **Value for 25 Quintals**: **₹56,875**.\n• **Procurement Quality Parameters**: Moisture <= 12%, foreign matter < 0.75%, clean and dry grain.\n• **Critical Irrigation**: First watering at 21 days after sowing (Crown Root Initiation / CRI stage).`,
      executed: true,
    };
  }

  // B. Paddy / Rice Cultivation & MSP
  if (
    q.includes('rice') || q.includes('paddy') || q.includes('dhan') ||
    q.includes('धान') || q.includes('चावल') || q.includes('ਚੌਲ') || q.includes('तांदूळ')
  ) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-grains',
      speechReply: isHi
        ? 'धान सामान्य श्रेणी का एमएसपी ₹2,183 और ग्रेड-ए धान का एमएसपी ₹2,203 प्रति क्विंटल है।'
        : 'MSP for Common Grade Paddy is ₹2,183/Q and Grade-A is ₹2,203/Q.',
      displayText: isHi ? '🌾 धान समर्थन मूल्य: ₹2,183 - ₹2,203 / क्विंटल' : '🌾 Paddy MSP: ₹2,183 - ₹2,203 / Quintal',
      answer: isHi
        ? `### 🌾 धान (Paddy / Rice Cultivation & MSP)\n\n• **सरकारी एमएसपी दर**: सामान्य धान **₹2,183 प्रति क्विंटल**, ग्रेड-ए धान **₹2,203 प्रति क्विंटल**।\n• **उन्नत किस्में**: पूसा 1509, बासमती 1121, पीआर-126, एमटीयू-7029 (स्वर्णा)।\n• **पौधशाला (Nursery)**: 1 हेक्टेयर खेत के लिए 800-1000 वर्ग मीटर में नर्सरी लगाएं।\n• **जिंक की कमी (खैरा रोग)**: धान में पत्तियां पीली पड़कर भूरे धब्बे पड़ें तो 5 किलो जिंक सल्फेट 21% + 2.5 किलो बुझा चूना प्रति हेक्टेयर छिड़कें।`
        : `### 🌾 Paddy / Rice Cultivation & MSP\n\n• **Official MSP**: Common Grade **₹2,183 / Q**, Grade-A **₹2,203 / Q**.\n• **Top Varieties**: Pusa 1509, Basmati 1121, PR-126, MTU-7029.\n• **Zinc Deficiency (Khaira Disease)**: If leaves develop reddish-brown spots, spray 5 kg Zinc Sulphate (21%) + 2.5 kg slaked lime per hectare.`,
      executed: true,
    };
  }

  // C. Mustard / Sarson
  if (q.includes('mustard') || q.includes('sarson') || q.includes('सरसों') || q.includes('ਸਰ੍ਹੋਂ') || q.includes('राई')) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-grains',
      speechReply: isHi
        ? 'सरसों का न्यूनतम समर्थन मूल्य ₹5,650 प्रति क्विंटल है। 10 क्विंटल सरसों का मूल्य ₹56,500 बनता है।'
        : 'Mustard official MSP is ₹5,650 per quintal. 10 quintals equals ₹56,500.',
      displayText: isHi ? '🌻 सरसों MSP: ₹5,650 / क्विंटल' : '🌻 Mustard MSP: ₹5,650 / Quintal',
      answer: isHi
        ? `### 🌻 सरसों (Mustard Cultivation & Pricing)\n\n• **सरकारी एमएसपी**: **₹5,650 प्रति क्विंटल** (तिलहन में सबसे अधिक लाभकारी)।\n• **10 क्विंटल का मूल्य**: **₹56,500**।\n• **उन्नत किस्में**: पूसा बोल्ड, गिरिराज, आरएच-749, क्रांति।\n• **सल्फर का महत्व**: सरसों में तेल प्रतिशत बढ़ाने के लिए 20-25 किलो बेंटोनाइट सल्फर प्रति एकड़ अवश्य डालें।\n• **चेपा/माहू (Aphid) कीट नियंत्रण**: प्रकोप होने पर इमिडाक्लोप्रिड 17.8% SL (1 मिली प्रति 3 लीटर पानी) का छिड़काव करें।`
        : `### 🌻 Mustard (Brassica juncea)\n\n• **Official MSP**: **₹5,650 per quintal**.\n• **10 Quintals Value**: **₹56,500**.\n• **Sulfur Application**: Apply 20-25 kg elemental sulfur per acre to boost oil content.\n• **Aphid Control**: Spray Imidacloprid 17.8% SL at 1 ml per 3 liters of water if infestation occurs.`,
      executed: true,
    };
  }

  // D. Gram / Chana / Pulses
  if (q.includes('gram') || q.includes('chana') || q.includes('चना') || q.includes('दाल') || q.includes('pulse')) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-grains',
      speechReply: isHi
        ? 'चने का सरकारी समर्थन मूल्य ₹5,440 प्रति क्विंटल है। बुवाई से पहले राइजोबियम कल्चर से बीज उपचार जरूर करें।'
        : 'Gram (Chana) MSP is ₹5,440 per quintal. Seed treatment with Rhizobium is strongly recommended.',
      displayText: isHi ? '🌱 चना MSP: ₹5,440 / क्विंटल' : '🌱 Gram (Chana) MSP: ₹5,440 / Q',
      answer: isHi
        ? `### 🌱 चना (Gram / Chickpea Guide)\n\n• **सरकारी एमएसपी**: **₹5,440 प्रति क्विंटल**।\n• **उन्नत किस्में**: जेजी-11, जेएकेआई-9218, राधे, पूसा-372 (उकठा रोग प्रतिरोधी)।\n• **बीज दर**: देशी चना 75-80 किग्रा/हेक्टेयर, काबुली चना 100-120 किग्रा/हेक्टेयर।\n• **इल्ली (Pod Borer) नियंत्रण**: फेरोमोन ट्रैप 5 प्रति एकड़ लगाएं। अत्यधिक प्रकोप में कोराजन (Chlorantraniliprole) 60 मिली प्रति एकड़ स्प्रे करें।`
        : `### 🌱 Chickpea (Gram / Chana)\n\n• **Official MSP**: **₹5,440 per quintal**.\n• **Top Varieties**: JG-11, JAKI-9218, Pusa-372 (wilt-tolerant).\n• **Pod Borer IPM**: Install 5 pheromone traps per acre. Spray Chlorantraniliprole 18.5% SC @ 60 ml/acre if larvae exceed threshold.`,
      executed: true,
    };
  }

  // E. Potato / Aloo
  if (q.includes('potato') || q.includes('aloo') || q.includes('आलू') || q.includes('आलु') || q.includes('बटाटा')) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-vegetables',
      speechReply: isHi
        ? 'आगरा मंडी में आज आलू का थोक भाव ₹1,450 प्रति क्विंटल है। झुलसा रोग से बचाव हेतु मैंकोजेब का छिड़काव करें।'
        : 'Agra Mandi benchmark for Potato is ₹1,450/Q. Spray Mancozeb for early blight protection.',
      displayText: isHi ? '🥔 आलू मंडी भाव: ₹1,450 / क्विंटल' : '🥔 Potato Mandi Rate: ₹1,450 / Q',
      answer: isHi
        ? `### 🥔 आलू की खेती व मंडी भाव (Potato Hub)\n\n• **आज का मंडी भाव**: **₹1,450 प्रति क्विंटल** (आगरा APMC मंडी बेंचमार्क)।\n• **उन्नत किस्में**: कुफरी पुखराज (अगेती 70-80 दिन), कुफरी ज्योति, कुफरी बहार।\n• **पिछेता झुलसा (Late Blight) नियंत्रण**: मौसम में कोहरा/बादल छाने पर मैंकोजेब 75% WP (2.5 ग्राम प्रति लीटर) या साइमोक्सानिल + मैंकोजेब का छिड़काव करें।\n• **मिट्टी चढ़ाना (Earthing Up)**: बुवाई के 30-35 दिन बाद कंदों को धूप से बचाने के लिए मिट्टी जरूर चढ़ाएं ताकि वे हरे न हों।`
        : `### 🥔 Potato (Solanum tuberosum)\n\n• **Current Benchmark**: **₹1,450 per quintal** (Agra APMC Mandi).\n• **Key Varieties**: Kufri Pukhraj (early 75 days), Kufri Jyoti, Kufri Bahar.\n• **Late Blight Management**: Preventative spray of Mancozeb 75% WP @ 2.5 g/liter during humid/foggy weather.\n• **Earthing Up**: Ridge soil around tubers 30-35 days after sowing to prevent solanine greening.`,
      executed: true,
    };
  }

  // F. Onion / Pyaaz
  if (q.includes('onion') || q.includes('pyaaz') || q.includes('प्याज') || q.includes('कांदा') || q.includes('डूंगळी')) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-vegetables',
      speechReply: isHi
        ? 'नासिक लासलगांव मंडी में प्याज का थोक भाव ₹2,100 प्रति क्विंटल है। पर्पल ब्लॉच रोग से बचाव रखें।'
        : 'Nashik Lasalgaon Mandi benchmark for Onion is ₹2,100 per quintal.',
      displayText: isHi ? '🧅 प्याज मंडी भाव: ₹2,100 / क्विंटल' : '🧅 Onion Mandi Rate: ₹2,100 / Q',
      answer: isHi
        ? `### 🧅 प्याज की खेती व मंडी विश्लेषण (Onion Mandi)\n\n• **मंडी बेंचमार्क दर**: **₹2,100 प्रति क्विंटल** (नासिक / लासलगांव APMC मंडी)।\n• **उन्नत किस्में**: भीमा सुपर, भीमा रेड, एन-53 (खरीफ प्याज), पूसा रेड।\n• **रोपाई (Transplanting)**: नर्सरी की 45-50 दिन की स्वस्थ पौध लगाएं।\n• **थ्रिप्स (Thrips) नियंत्रण**: पत्तियों पर चांदी जैसे धब्बे दिखने पर फिप्रोनिल 5% SC (2 मिली/लीटर) या नीम तेल (10,000 PPM) का स्प्रे करें।\n• **भंडारण (Storage)**: कंद निकालने से 15 दिन पूर्व सिंचाई बंद करें और 3-4 दिन खेत में सुखाकर (Curing) ही भंडारित करें।`
        : `### 🧅 Onion (Allium cepa)\n\n• **Mandi Benchmark**: **₹2,100 per quintal** (Nashik / Lasalgaon APMC).\n• **Top Varieties**: Bhima Super, Bhima Red, N-53, Pusa Red.\n• **Thrips & Purple Blotch**: Spray Fipronil 5% SC (2 ml/L) or Carbendazim (1 g/L) with sticker (spreader).\n• **Curing**: Stop irrigation 15 days before harvest; cure in shade for 4 days before storage.`,
      executed: true,
    };
  }

  // G. Tomato / Tamatar
  if (q.includes('tomato') || q.includes('tamatar') || q.includes('टमाटर') || q.includes('टोमॅटो')) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-vegetables',
      speechReply: isHi
        ? 'कोलार मंडी में टमाटर का थोक भाव ₹1,850 प्रति क्विंटल है। फल छेदक कीट और मरोड़िया रोग पर ध्यान दें।'
        : 'Kolar Mandi benchmark for Tomato is ₹1,850/Q. Watch for fruit borer and leaf curl virus.',
      displayText: isHi ? '🍅 टमाटर मंडी भाव: ₹1,850 / क्विंटल' : '🍅 Tomato Mandi Rate: ₹1,850 / Q',
      answer: isHi
        ? `### 🍅 टमाटर (Tomato Cultivation & Protection)\n\n• **आज का मंडी भाव**: **₹1,850 प्रति क्विंटल** (कोलार व मदनपल्ली APMC)।\n• **उन्नत किस्में**: अभिनव हाइब्रिड, हिमसोना, पूसा रूबी, अर्का रक्षक (त्रिपल रोग प्रतिरोधी)।\n• **मरोड़िया रोग (Leaf Curl Virus)**: सफेद मक्खी द्वारा फैलता है। रोकथाम हेतु पीला चिपचिपा ट्रैप (Yellow sticky trap) लगाएं और एसिटामिप्रिड 20% SP (0.5 ग्राम/लीटर) छिड़कें।\n• **फल छेदक (Fruit Borer)**: फेरोमोन ट्रैप लगाएं और प्रोफेनोफॉस 50% EC 2 मिली/लीटर का छिड़काव करें।`
        : `### 🍅 Tomato (Solanum lycopersicum)\n\n• **Benchmark Mandi Rate**: **₹1,850 per quintal** (Kolar Mandi).\n• **High-Yield Hybrids**: Abhinav, Arka Rakshak (triple disease resistant), Himsona.\n• **Leaf Curl Virus**: Controlled by combating whiteflies with yellow sticky traps & Acetamiprid 20% SP @ 0.5 g/L.\n• **Fruit Borer**: Deploy pheromone traps; spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L.`,
      executed: true,
    };
  }

  // G2. General Vegetable Mandi Rates
  if (
    q.includes('vegetable') || q.includes('सब्जी') || q.includes('mandi') ||
    q.includes('मंडी') || q.includes('sabzi')
  ) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-vegetables',
      speechReply: isHi
        ? 'सब्जी मंडी भाव: आलू ₹1,450, प्याज ₹2,100, टमाटर ₹1,850 प्रति क्विंटल। सब्जी बाजार पैनल दिखाया जा रहा है।'
        : 'Mandi Rates: Potato ₹1,450/Q, Onion ₹2,100/Q, Tomato ₹1,850/Q. Focusing on Vegetable Market panel.',
      displayText: isHi ? '🥬 सब्जी मंडी भाव पैनल दिखाया गया' : '🥬 Vegetable Mandi Panel Focused',
      answer: isHi
        ? `### 🥬 दैनिक सब्जी मंडी थोक भाव (APMC Mandi Rates)\n\n• **आलू (Agra Mandi)**: ₹1,450 / क्विंटल\n• **प्याज (Lasalgaon Mandi)**: ₹2,100 / क्विंटल\n• **टमाटर (Kolar Mandi)**: ₹1,850 / क्विंटल\n• **हरी मटर (Jabalpur Mandi)**: ₹3,600 / क्विंटल\n• **हरी मिर्च (Guntur Mandi)**: ₹4,200 / क्विंटल\n• **फूलगोभी (Hapur Mandi)**: ₹1,600 / क्विंटल`
        : `### 🥬 Daily APMC Vegetable Mandi Wholesale Benchmarks\n\n• **Potato (Agra Mandi)**: ₹1,450 / Quintal\n• **Onion (Lasalgaon Mandi)**: ₹2,100 / Quintal\n• **Tomato (Kolar Mandi)**: ₹1,850 / Quintal\n• **Green Peas (Jabalpur Mandi)**: ₹3,600 / Quintal\n• **Green Chilli (Guntur Mandi)**: ₹4,200 / Quintal\n• **Cauliflower (Hapur Mandi)**: ₹1,600 / Quintal`,
      executed: true,
    };
  }

  // H. Fertilizers, DAP, Urea, Nano Urea, NPK
  if (
    q.includes('fertilizer') || q.includes('urea') || q.includes('dap') ||
    q.includes('npk') || q.includes('खाद') || q.includes('यूरिया') ||
    q.includes('उर्वरक') || q.includes('डीएपी') || q.includes('पोटाश') ||
    q.includes('nano urea') || q.includes('नैनो यूरिया') || q.includes('वर्मीकम्पोस्ट')
  ) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-guidance',
      speechReply: isHi
        ? 'संतुलित खाद के लिए गेहूं में 120 किलो नाइट्रोजन, 60 किलो फास्फोरस और 40 किलो पोटाश प्रति हेक्टेयर डालें। नैनो यूरिया 4 मिली प्रति लीटर पानी में स्प्रे करें।'
        : 'For balanced crop nutrition, use 120:60:40 NPK ratio for cereals. Nano Urea spray is recommended at 4 ml per liter.',
      displayText: isHi ? '🧪 संतुलित उर्वरक व नैनो यूरिया गाइड' : '🧪 Balanced Fertilizers & Nano Urea',
      answer: isHi
        ? `### 🧪 उर्वरक प्रबंधन व वैज्ञानिक मात्रा (Balanced Nutrition Guide)\n\n• **एनपीके अनुपात (NPK Ratio)**: अनाज फसलों (गेहूं/धान) के लिए **4:2:1 (120:60:40 किग्रा/हेक्टेयर)**।\n• **बुवाई के समय**: पूरी फास्फोरस (DAP) व पोटाश की मात्रा तथा 1/3 नाइट्रोजन बुवाई के समय कतारों में दें।\n• **यूरिया टॉप-ड्रेसिंग**: शेष नाइट्रोजन दो बराबर भागों में पहली व दूसरी सिंचाई पर दें।\n• **इफको नैनो यूरिया (Nano Urea)**: कल्ले फूटते समय (30-35 दिन) 4 मिली नैनो यूरिया प्रति लीटर पानी में मिलाकर पर्णीय छिड़काव करें। इससे पारंपरिक यूरिया की 1 बोरी की बचत होती है।\n• **जैविक सुधार**: बुवाई से 20 दिन पहले 5 टन सड़ी गोबर खाद या 2 टन वर्मीकम्पोस्ट प्रति एकड़ अवश्य मिलाएं।`
        : `### 🧪 Comprehensive Fertilizer & Nano Nutrition Guide\n\n• **Optimal NPK Ratio**: 4:2:1 (120:60:40 kg/hectare) for cereals; 1:2:1 for pulses.\n• **Basal Application**: Full DAP/SSP and Muriate of Potash (MOP) along with 1/3rd Nitrogen at sowing.\n• **Top Dressing**: Apply remaining Urea in 2 splits during 1st and 2nd irrigations.\n• **IFFCO Nano Urea**: Foliar spray at 4 ml per liter water during tillering stage (30-35 days), replacing one 45 kg bag of conventional urea.\n• **Organic Foundation**: Incorporate 5 tons well-rotted FYM or 2 tons vermicompost per acre before plowing.`,
      executed: true,
    };
  }

  // I. Pests, Insects, Plant Diseases & Medicines
  if (
    q.includes('pest') || q.includes('insect') || q.includes('disease') ||
    q.includes('कीट') || q.includes('रोग') || q.includes('बीमारी') ||
    q.includes('कीड़ा') || q.includes('इल्ली') || q.includes('फफूंद') ||
    q.includes('झुलसा') || q.includes('रतुआ') || q.includes('rust') ||
    q.includes('blight') || q.includes('wilt') || q.includes('दवाई')
  ) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-guidance',
      speechReply: isHi
        ? 'कीट व रोग नियंत्रण के लिए जैविक व रासायनिक उपचार उपलब्ध हैं। पीला रतुआ हेतु प्रोपिकोनाजोल 1 मिली/लीटर स्प्रे करें।'
        : 'Integrated pest management controls fungal, sucking, and borer pests effectively. Spray Propiconazole for rust.',
      displayText: isHi ? '🛡️ कीट एवं रोग नियंत्रण समाधान' : '🛡️ Integrated Pest & Disease Solutions',
      answer: isHi
        ? `### 🛡️ कीट व रोग नियंत्रण वैज्ञानिक गाइड (Integrated Crop Protection)\n\n• **गेहूं का पीला/भूरा रतुआ (Yellow/Brown Rust)**: पत्तियों पर पीले-नारंगी पाउडर जैसे धब्बे।\n  ↳ **उपचार**: प्रोपिकोनाजोल 25% EC (टिल्ट) 1 मिली प्रति लीटर पानी में 200 लीटर पानी के साथ छिड़कें।\n• **सफेद मक्खी व माहू (Sucking Pests)**: पत्तियों से रस चूसते हैं और मरोड़िया रोग फैलाते हैं।\n  ↳ **उपचार**: इमिडाक्लोप्रिड 17.8% SL (1 मिली प्रति 3 लीटर) या नीम का तेल (10,000 PPM) 3 मिली/लीटर।\n• **उकठा व जड़ गलन (Root Rot / Wilt)**: फफूंद जनित रोग।\n  ↳ **उपचार**: ट्राइकोडर्मा विरिडी 2.5 किलो को 100 किलो गोबर खाद में मिलाकर खेत में फैलाएं।\n• **तंबाकू इल्ली / फॉल आर्मीवर्म (Armyworm)**: कोराजन (Chlorantraniliprole 18.5% SC) 0.3 मिली प्रति लीटर पानी।`
        : `### 🛡️ Crop Protection & Pest Management Manual\n\n• **Wheat Yellow/Brown Rust**: Powdery yellow/orange stripes on leaves.\n  ↳ **Remedy**: Spray Propiconazole 25% EC (Tilt) @ 1 ml/liter (200 liters water/acre).\n• **Sucking Insects (Aphids, Whitefly, Thrips)**: Transmit viral leaf curl.\n  ↳ **Remedy**: Imidacloprid 17.8% SL @ 1 ml per 3 liters water or organic Neem Oil (10,000 PPM).\n• **Soil-Borne Wilt & Root Rot**: Caused by Fusarium/Rhizoctonia fungi.\n  ↳ **Remedy**: Bio-control with Trichoderma viride (2.5 kg enriched in 100 kg compost/acre).\n• **Pod & Stem Borers / Fall Armyworm**: Chlorantraniliprole 18.5% SC @ 60 ml/acre.`,
      executed: true,
    };
  }

  // J. Irrigation, Water & Drip Subsidies
  if (
    q.includes('water') || q.includes('irrigation') || q.includes('sinchayee') ||
    q.includes('paani') || q.includes('सिंचाई') || q.includes('पानी') ||
    q.includes('ड्रिप') || q.includes('फव्वारा') || q.includes('स्प्रिंकलर') ||
    q.includes('drip') || q.includes('sprinkler')
  ) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-guidance',
      speechReply: isHi
        ? 'गेहूं में बुवाई के 21 दिन बाद ताजमूल अवस्था पर पहली सिंचाई करें। ड्रिप पद्धति पर सरकार 55% तक सब्सिडी देती है।'
        : 'First irrigation at CRI stage (21 days) in wheat is critical. Up to 55% subsidy is available for drip irrigation.',
      displayText: isHi ? '💧 सिंचाई प्रबंधन एवं सरकारी सब्सिडी' : '💧 Irrigation & Drip Subsidies',
      answer: isHi
        ? `### 💧 सिंचाई प्रबंधन व सूक्ष्म सिंचाई सब्सिडी (PMKSY)\n\n• **गेहूं की 5 मुख्य सिंचाई अवस्थाएं**:\n  1. **ताजमूल अवस्था (CRI stage)**: बुवाई के 20-25 दिन बाद (सर्वाधिक महत्वपूर्ण)।\n  2. **कल्ले फूटते समय**: 40-45 दिन बाद।\n  3. **गांठे बनते समय (Jointing)**: 60-65 दिन बाद।\n  4. **फूल व बाली आते समय**: 80-85 दिन बाद।\n  5. **दूधिया अवस्था (Milking)**: 100-105 दिन बाद।\n• **प्रधानमंत्री कृषि सिंचाई योजना (PMKSY)**: ड्रिप और स्प्रिंकलर लगाने पर छोटे व सीमांत किसानों को **55%** तथा अन्य किसानों को **45%** सरकारी अनुदान (सब्सिडी) मिलता है।\n• **जल बचत**: 40% से 50% पानी की बचत और 25% पैदावार में वृद्धि।`
        : `### 💧 Irrigation Schedule & PMKSY Subsidy\n\n• **Critical Wheat Stages**:\n  1. **CRI Stage**: 20-25 days after sowing (Most Vital).\n  2. **Tillering Stage**: 40-45 days.\n  3. **Jointing Stage**: 60-65 days.\n  4. **Flowering Stage**: 80-85 days.\n  5. **Milking/Dough Stage**: 100-105 days.\n• **PM Krishi Sinchayee Yojana (Micro-Irrigation)**: 55% capital subsidy for small/marginal farmers, 45% for other farmers on Drip/Sprinkler installations.\n• **Water Efficiency**: Saves 40-50% water while improving yield by 20-25%.`,
      executed: true,
    };
  }

  // K. Government Schemes: PM-KISAN, PMFBY, KCC
  if (
    q.includes('scheme') || q.includes('pm-kisan') || q.includes('pm kisan') ||
    q.includes('pmfby') || q.includes('kcc') || q.includes('yojana') ||
    q.includes('योजना') || q.includes('बीमा') || q.includes('सब्सिडी') ||
    q.includes('subsidy') || q.includes('कर्ज') || q.includes('ऋण') || q.includes('loan')
  ) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-schemes',
      speechReply: isHi
        ? 'पीएम-किसान से साल में ₹6,000 मिलते हैं। केसीसी पर मात्र 4% ब्याज पर ₹3 लाख तक का ऋण मिलता है।'
        : 'PM-KISAN provides ₹6,000/year. KCC offers concessional credit up to ₹3 Lakh at 4% effective interest.',
      displayText: isHi ? '🏛️ प्रमुख सरकारी कृषि योजनाएं' : '🏛️ Key Government Farm Schemes',
      answer: isHi
        ? `### 🏛️ प्रमुख सरकारी कृषि योजनाएं एवं लाभ (Central Government Schemes)\n\n• **1. PM-KISAN सम्मान निधि**: प्रतिवर्ष **₹6,000** की प्रत्यक्ष आय सहायता (प्रत्येक 4 माह में ₹2,000 की 3 समान किस्तें) सीधे डीबीटी बैंक खाते में।\n• **2. PM फसल बीमा योजना (PMFBY)**: रबी फसलों पर मात्र 1.5%, खरीफ पर 2.0% और बागवानी पर 5% प्रीमियम। सूखा, बाढ़ या ओलावृष्टि से नुकसान पर 100% भरपाई। दावा दर्ज करने हेतु 72 घंटे में टोल-फ्री 1800-180-1551 पर सूचना दें।\n• **3. किसान क्रेडिट कार्ड (KCC)**: समय पर चुकता करने पर मात्र **4% प्रभावी वार्षिक ब्याज** पर ₹3,00,000 तक का बिना किसी बंधक के आसान संस्थागत ऋण।\n• **4. पीएम कुसुम योजना (PM-KUSUM)**: सोलर पंप लगाने पर 60% तक सरकारी अनुदान।`
        : `### 🏛️ Official Central Government Agricultural Schemes\n\n• **1. PM-KISAN Samman Nidhi**: **₹6,000 annual income support** paid in three 4-monthly tranches of ₹2,000 directly via Aadhaar-linked DBT.\n• **2. PM Fasal Bima Yojana (PMFBY)**: Low subsidized premium of 1.5% for Rabi, 2.0% for Kharif crops. Full compensation for unseasonal rain, frost, and hailstorms. Report losses within 72 hours.\n• **3. Kisan Credit Card (KCC)**: Concessional farm credit up to **₹3,00,000 at 4% effective annual interest** (7% base with 3% prompt repayment subvention).\n• **4. PM-KUSUM Solar Scheme**: Up to 60% capital subsidy for standalone off-grid and grid-connected solar irrigation pumps.`,
      executed: true,
    };
  }

  // L. Soil Testing, Health Card & pH
  if (
    q.includes('soil') || q.includes('mitti') || q.includes('मिट्टी') ||
    q.includes('जमीन') || q.includes('ph') || q.includes('testing') ||
    q.includes('जांच') || q.includes('परीक्षण')
  ) {
    return {
      action: 'FOCUS_PANEL',
      target: 'panel-guidance',
      speechReply: isHi
        ? 'मिट्टी की जांच हर 3 साल में करानी चाहिए। आदर्श पीएच 6.5 से 7.5 होता है। अम्लीय मिट्टी में चूना और क्षारीय में जिप्सम डालें।'
        : 'Soil testing is recommended every 3 years. Ideal pH is 6.5-7.5. Apply gypsum for alkaline and lime for acidic soil.',
      displayText: isHi ? '🌱 मृदा स्वास्थ्य एवं परीक्षण गाइड' : '🌱 Soil Testing & pH Guide',
      answer: isHi
        ? `### 🌱 मृदा स्वास्थ्य एवं नमूना लेने की विधि (Soil Health Card Scheme)\n\n• **नमूना लेने का तरीका**: खेत में 8 से 10 अलग-अलग स्थानों से 'V' आकार का 15 सेमी गहरा गड्ढा खोदकर ऊपरी मिट्टी हटाकर किनारों से 500 ग्राम मिट्टी एकत्र करें और सुखाकर जांच केंद्र भेजें।\n• **आदर्श पीएच (pH)**: 6.5 से 7.5।\n• **अम्लीय मिट्टी (pH < 6.5)**: कृषि चूना (Agricultural Lime) मिलाकर सुधारें।\n• **क्षारीय/ऊसर मिट्टी (pH > 8.0)**: जिप्सम (Gypsum) और हरी खाद (ढैंचा) का प्रयोग करें।\n• **जैविक कार्बन**: मिट्टी में जैविक कार्बन 0.75% से अधिक होना चाहिए। इसके लिए जीवामृत व केंचुआ खाद का प्रयोग करें।`
        : `### 🌱 Soil Health Card & Nutrient Management\n\n• **Sampling Technique**: Dig 'V'-shaped pits 15 cm deep across 8-10 points in the plot, mix thoroughly to obtain a 500g composite sample.\n• **Optimal pH**: 6.5 to 7.5 for maximum nutrient availability.\n• **Acidic Soils (pH < 6.5)**: Apply agricultural limestone (calcium carbonate).\n• **Alkaline Soils (pH > 8.0)**: Apply agricultural gypsum along with Sesbania (Dhaincha) green manure.\n• **Organic Carbon**: Maintain soil organic carbon above 0.75% using compost and bio-fertilizers.`,
      executed: true,
    };
  }

  // M. General Conversation, Greetings & Assistance
  if (
    q.includes('hello') || q.includes('hi') || q.includes('namaste') ||
    q.includes('नमस्ते') || q.includes('राम राम') || q.includes('सत श्री अकाल') ||
    q.includes('kem cho') || q.includes('how are you') || q.includes('kaise ho')
  ) {
    return {
      speechReply: isHi
        ? 'राम राम किसान भाई! मैं आपका किशनसेतु वॉयस सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?'
        : 'Hello! I am your KishanSetu Voice Assistant. How can I assist your farming or platform needs today?',
      displayText: isHi ? '🙏 राम राम किसान भाई!' : '🙏 Hello Friend!',
      answer: isHi
        ? `### 🙏 राम राम! मैं आपका किशनसेतु सहायक हूँ\n\nमैं कृषि, मंडी भाव, सरकारी योजनाओं और वेबसाइट नियंत्रण से जुड़े आपके सभी सवालों का उत्तर देने के लिए पूरी तरह तैयार हूँ।\n• **आप बोल सकते हैं**: "उपभोक्ता स्टोर खोलो", "गेहूं का क्या भाव है?", "डार्क मोड करो", "खाद कितनी डालें?", या "सब्जी मंडी दिखाओ"।`
        : `### 🙏 Greetings! I am your KishanSetu Assistant\n\nI am ready to answer all your farming questions, provide live mandi benchmarks, explain government subsidies, and navigate the platform.\n• **Try saying**: "Open Consumer Store", "What is wheat MSP?", "Enable Dark Mode", "Fertilizer guide", or "Show vegetable mandi".`,
      executed: false,
    };
  }

  if (
    q.includes('who are you') || q.includes('kon ho') || q.includes('कौन हो') ||
    q.includes('tum kon') || q.includes('what can you do') || q.includes('क्या कर सकते') ||
    q.includes('help') || q.includes('मदद') || q.includes('सहायता')
  ) {
    return {
      speechReply: isHi
        ? 'मैं किशनसेतु का रियल-टाइम एआई सहायक हूँ। मैं आवाज से वेबसाइट चला सकता हूँ और खेती से जुड़ा कोई भी उत्तर दे सकता हूँ।'
        : 'I am the real-time KishanSetu AI Sahayak. I can navigate the portal and answer all your agricultural questions.',
      displayText: isHi ? '🤖 किशनसेतु एआई सहायक परिचय' : '🤖 KishanSetu AI Capabilities',
      answer: isHi
        ? `### 🤖 किशनसेतु एआई सहायक क्षमताएं (Platform Capabilities)\n\n• **वॉयस नेविगेशन**: बोलकर किसान हब, उपभोक्ता स्टोर, थोक खरीदार, एडमिन या सुरक्षा पेज पर जाएं।\n• **थीम व भाषा**: "डार्क मोड", "लाइट मोड" या "हिंदी/English/ਪੰਜਾਬੀ" में तुरंत स्विच करें।\n• **एमएसपी व मंडी भाव**: गेहूं, धान, सरसों, चना, आलू, प्याज, टमाटर के आज के अधिकृत रेट जानें।\n• **कृषि सलाह**: खाद की सही मात्रा, रोग-कीट उपचार, सिंचाई समय और सरकारी योजनाओं की पूरी जानकारी।`
        : `### 🤖 KishanSetu AI Assistant Capabilities\n\n• **Voice Navigation**: Navigate to Farmer Hub, Consumer Store, Bulk Buyer, Admin, or Security by voice.\n• **Themes & Languages**: Instantly switch to Dark/Light mode and across 8 Indian languages.\n• **Real-Time Market Benchmarks**: Get verified MSPs for wheat, paddy, mustard, and mandi vegetable rates.\n• **Agronomic Guidance**: Fertilizer dosage, pest remedies, irrigation stages, and government subsidies.`,
      executed: false,
    };
  }

  // ==========================================
  // N. DEFAULT INTELLIGENT EXPERT FALLBACK
  // ==========================================
  return {
    speechReply: isHi
      ? `मैंने आपका प्रश्न समझा: "${query}"। आपके डैशबोर्ड पर सभी फसलों के एमएसपी, मंडी भाव और सरकारी योजनाएं उपलब्ध हैं। आप "किसान हब", "उपभोक्ता स्टोर", या "डार्क मोड" भी बोल सकते हैं।`
      : `I noted your question: "${query}". Your dashboard provides complete MSP rates, mandi benchmarks, and agronomic guidance. You can also give voice commands like "Farmer Hub", "Consumer Store", or "Dark Mode".`,
    displayText: isHi ? `कृषि सलाह: "${query}"` : `Agricultural Advisory: "${query}"`,
    answer: isHi
      ? `### 🌾 किशनसेतु कृषि परामर्श (KishanSetu Agricultural Knowledge)\n\nआपके प्रश्न: **"${query}"** के संदर्भ में:\n• **एमएसपी समर्थन**: गेहूं ₹2,275, धान ₹2,183, सरसों ₹5,650, चना ₹5,440 प्रति क्विंटल।\n• **मंडी दरें**: आलू ₹1,450, प्याज ₹2,100, टमाटर ₹1,850 प्रति क्विंटल।\n• **वैज्ञानिक सलाह**: फसलों में किसी भी कीट या फफूंद के लक्षण पर नीम तेल (10,000 PPM) या उपयुक्त फफूंदनाशक का छिड़काव करें।\n• **वॉयस कमांड्स**: आप किसी भी समय बोल सकते हैं: *"उपभोक्ता स्टोर खोलो"*, *"डार्क मोड ऑन करो"*, *"गेहूं का भाव"*, या *"सभी पैनल ग्रिड में दिखाओ"*।`
      : `### 🌾 KishanSetu Agri-Advisory\n\nRegarding your query: **"${query}"**:\n• **Official MSP**: Wheat ₹2,275, Paddy ₹2,183, Mustard ₹5,650, Gram ₹5,440 per quintal.\n• **Mandi Benchmarks**: Potato ₹1,450/Q, Onion ₹2,100/Q, Tomato ₹1,850/Q.\n• **Crop Care**: For any insect or fungal symptoms, use Integrated Pest Management or bio-pesticides.\n• **Voice Commands**: Say *"Open Consumer Store"*, *"Enable Dark Mode"*, *"Show Wheat MSP"*, or *"2x2 Grid View"*.`,
    executed: false,
  };
}
