/**
 * KishanSetu Voice Assistant Service
 * Real-time Speech Recognition (STT), Speech Synthesis (TTS),
 * and Voice Command NLP Action Dispatcher.
 */

export type VoiceActionType = 
  | 'NAVIGATE_MODULE' 
  | 'FOCUS_PANEL' 
  | 'SET_THEME' 
  | 'SET_LANGUAGE' 
  | 'OPEN_MODAL' 
  | 'CALCULATE' 
  | 'GENERAL';

export interface VoiceCommandResponse {
  action: VoiceActionType;
  target?: string;
  speechReply: string;
  displayText: string;
  executed: boolean;
  source?: string;
}

export interface ListenCallbacks {
  onInterim?: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (err: any) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

// Map platform language codes to BCP 47 speech recognition locales
export const SPEECH_LOCALE_MAP: Record<string, string> = {
  hi: 'hi-IN',
  en: 'en-IN',
  hinglish: 'hi-IN',
  pa: 'pa-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  ta: 'ta-IN',
};

class VoiceAssistantService {
  private recognition: any = null;
  private isListeningActive: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isMuted: boolean = false;
  private speechRate: number = 1.0;

  // Key storage key
  private readonly API_KEY_STORAGE = 'kishansetu_gemini_api_key';

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('kishansetu_voice_muted');
      if (savedMute) this.isMuted = savedMute === 'true';
      const savedRate = localStorage.getItem('kishansetu_voice_rate');
      if (savedRate) this.speechRate = parseFloat(savedRate) || 1.0;
    }
  }

  // --- Capabilities Check ---
  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition
    );
  }

  public isSpeechSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  // --- API Key Management ---
  public getStoredApiKey(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(this.API_KEY_STORAGE) || '';
  }

  public setStoredApiKey(key: string): void {
    if (typeof window === 'undefined') return;
    if (key.trim()) {
      localStorage.setItem(this.API_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(this.API_KEY_STORAGE);
    }
  }

  public clearStoredApiKey(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.API_KEY_STORAGE);
  }

  // --- Mute & Rate Controls ---
  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('kishansetu_voice_muted', String(muted));
      if (muted) this.stopSpeaking();
    }
  }

  public getSpeechRate(): number {
    return this.speechRate;
  }

  public setSpeechRate(rate: number): void {
    this.speechRate = rate;
    if (typeof window !== 'undefined') {
      localStorage.setItem('kishansetu_voice_rate', String(rate));
    }
  }

  // --- Speech Recognition (STT) ---
  public startListening(languageCode: string, callbacks: ListenCallbacks): void {
    if (!this.isSpeechRecognitionSupported()) {
      callbacks.onError?.('Speech recognition is not supported in this browser. Please use keyboard chat.');
      return;
    }

    this.stopListening();
    this.stopSpeaking();

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();

      const locale = SPEECH_LOCALE_MAP[languageCode] || 'hi-IN';
      this.recognition.lang = locale;
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListeningActive = true;
        callbacks.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          callbacks.onInterim?.(interimTranscript);
        }

        if (finalTranscript) {
          this.isListeningActive = false;
          callbacks.onFinal(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListeningActive = false;
        console.warn('Voice recognition notice:', event.error);
        callbacks.onError?.(event.error);
      };

      this.recognition.onend = () => {
        this.isListeningActive = false;
        callbacks.onEnd?.();
      };

      this.recognition.start();
    } catch (err) {
      this.isListeningActive = false;
      callbacks.onError?.(err);
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
      this.recognition = null;
    }
    this.isListeningActive = false;
  }

  public isListening(): boolean {
    return this.isListeningActive;
  }

  // --- Speech Synthesis (TTS) ---
  public speak(
    text: string, 
    languageCode: string, 
    onStart?: () => void, 
    onEnd?: () => void
  ): void {
    if (!this.isSpeechSynthesisSupported() || this.isMuted) return;

    this.stopSpeaking();

    try {
      // Clean markdown format for natural voice reading
      const cleanText = text
        .replace(/[*#_`>]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\n\s*\n/g, '. ')
        .replace(/\n/g, '. ')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const locale = SPEECH_LOCALE_MAP[languageCode] || 'hi-IN';
      utterance.lang = locale;
      utterance.rate = this.speechRate;
      utterance.pitch = 1.0;

      // Try selecting an authentic native voice for the locale
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(
        (v) => v.lang.startsWith(locale.split('-')[0]) || v.lang === locale
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        this.currentUtterance = utterance;
        onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        onEnd?.();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      onEnd?.();
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking;
  }

  // --- Real-time Voice Command API Caller ---
  public async processVoiceCommand(
    transcript: string, 
    language: string, 
    currentModule: string
  ): Promise<VoiceCommandResponse> {
    const apiKey = this.getStoredApiKey();

    try {
      const response = await fetch('/api/ai/voice-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-gemini-key': apiKey } : {}),
        },
        body: JSON.stringify({
          transcript,
          language,
          currentModule,
          apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: VoiceCommandResponse = await response.json();
      return data;
    } catch (error) {
      console.warn('Network voice-command processing failed, using local offline fallback:', error);
      return this.localFallbackVoiceCommand(transcript, language);
    }
  }

  // --- Offline / Client-Side Fallback NLP Rule Parser ---
  private localFallbackVoiceCommand(transcript: string, language: string): VoiceCommandResponse {
    const t = transcript.toLowerCase().trim();
    const isHi = language === 'hi' || language === 'hinglish';

    // 1. Language change commands
    if (t.includes('hindi') || t.includes('हिंदी') || t.includes('हिन्दी')) {
      return {
        action: 'SET_LANGUAGE',
        target: 'hi',
        speechReply: 'भाषा को हिंदी में बदल दिया गया है।',
        displayText: 'भाषा: हिंदी (Hindi)',
        executed: true,
        source: 'client_local_rule'
      };
    }
    if (t.includes('english') || t.includes('अंग्रेजी') || t.includes('अंग्रेज़ी')) {
      return {
        action: 'SET_LANGUAGE',
        target: 'en',
        speechReply: 'Language switched to English.',
        displayText: 'Language: English',
        executed: true,
        source: 'client_local_rule'
      };
    }
    if (t.includes('punjabi') || t.includes('पंजाबी') || t.includes('ਪੰਜਾਬੀ')) {
      return {
        action: 'SET_LANGUAGE',
        target: 'pa',
        speechReply: 'ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲ ਦਿੱਤੀ ਗਈ ਹੈ।',
        displayText: 'ਭਾਸ਼ਾ: ਪੰਜਾਬੀ (Punjabi)',
        executed: true,
        source: 'client_local_rule'
      };
    }
    if (t.includes('marathi') || t.includes('मराठी')) {
      return {
        action: 'SET_LANGUAGE',
        target: 'mr',
        speechReply: 'भाषा मराठीमध्ये बदलली आहे.',
        displayText: 'भाषा: मराठी (Marathi)',
        executed: true,
        source: 'client_local_rule'
      };
    }
    if (t.includes('gujarati') || t.includes('गुजराती') || t.includes('ગુજરાતી')) {
      return {
        action: 'SET_LANGUAGE',
        target: 'gu',
        speechReply: 'ભાષા ગુજરાતીમાં બદલાઈ ગઈ છે.',
        displayText: 'ભાષા: ગુજરાતી (Gujarati)',
        executed: true,
        source: 'client_local_rule'
      };
    }
    if (t.includes('bengali') || t.includes('बंगाली') || t.includes('বাংলা')) {
      return {
        action: 'SET_LANGUAGE',
        target: 'bn',
        speechReply: 'ভাষা বাংলায় পরিবর্তিত হয়েছে।',
        displayText: 'ভাষা: বাংলা (Bengali)',
        executed: true,
        source: 'client_local_rule'
      };
    }
    if (t.includes('telugu') || t.includes('तेलुगू') || t.includes('తెలుగు')) {
      return {
        action: 'SET_LANGUAGE',
        target: 'te',
        speechReply: 'భాష తెలుగులోకి మార్చబడింది.',
        displayText: 'భాష: తెలుగు (Telugu)',
        executed: true,
        source: 'client_local_rule'
      };
    }
    if (t.includes('tamil') || t.includes('तमिल') || t.includes('தமிழ்')) {
      return {
        action: 'SET_LANGUAGE',
        target: 'ta',
        speechReply: 'மொழி தமிழுக்கு மாற்றப்பட்டது.',
        displayText: 'மொழி: தமிழ் (Tamil)',
        executed: true,
        source: 'client_local_rule'
      };
    }
    if (t.includes('change language') || t.includes('भाषा बदलो') || t.includes('select language') || t.includes('भाषा चुनें')) {
      return {
        action: 'OPEN_MODAL',
        target: 'language',
        speechReply: isHi ? 'भाषा चयन विंडो खोली जा रही है।' : 'Opening language selector modal.',
        displayText: isHi ? 'भाषा चयन विंडो खुली' : 'Opened Language Modal',
        executed: true,
        source: 'client_local_rule'
      };
    }

    // 2. Module Navigation
    if (t.includes('consumer') || t.includes('उपभोक्ता') || t.includes('store') || t.includes('shop') || t.includes('दुकान') || t.includes('खरीदारी')) {
      return {
        action: 'NAVIGATE_MODULE',
        target: 'consumer',
        speechReply: isHi ? 'उपभोक्ता स्टोर खोला जा रहा है।' : 'Switching to Consumer Store.',
        displayText: isHi ? 'उपभोक्ता स्टोर पर नेविगेट किया गया' : 'Navigated to Consumer Store',
        executed: true,
        source: 'client_local_rule'
      };
    }

    if (t.includes('farmer') || t.includes('किसान') || t.includes('kisan') || t.includes('farming')) {
      return {
        action: 'NAVIGATE_MODULE',
        target: 'farmer',
        speechReply: isHi ? 'किसान हब खोला जा रहा है।' : 'Switching to Farmer Hub.',
        displayText: isHi ? 'किसान हब पर नेविगेट किया गया' : 'Navigated to Farmer Hub',
        executed: true,
        source: 'client_local_rule'
      };
    }

    if (t.includes('bulk') || t.includes('थोक') || t.includes('b2b') || t.includes('खरीदार') || t.includes('procurement')) {
      return {
        action: 'NAVIGATE_MODULE',
        target: 'bulk_buyer',
        speechReply: isHi ? 'थोक खरीदार डेस्क खोला जा रहा है।' : 'Opening B2B Bulk Buyer Desk.',
        displayText: isHi ? 'थोक खरीदार डेस्क पर नेविगेट किया गया' : 'Navigated to Bulk Buyer Desk',
        executed: true,
        source: 'client_local_rule'
      };
    }

    if (t.includes('admin') || t.includes('एडमिन') || t.includes('प्रशासन') || t.includes('governance')) {
      return {
        action: 'NAVIGATE_MODULE',
        target: 'admin',
        speechReply: isHi ? 'प्रशासन कंसोल खोला जा रहा है।' : 'Opening Admin Console.',
        displayText: isHi ? 'प्रशासन कंसोल पर नेविगेट किया गया' : 'Navigated to Admin Console',
        executed: true,
        source: 'client_local_rule'
      };
    }

    if (t.includes('security') || t.includes('सुरक्षा') || t.includes('2fa') || t.includes('profile')) {
      return {
        action: 'NAVIGATE_MODULE',
        target: 'security',
        speechReply: isHi ? 'सुरक्षा और 2FA सेटिंग्स खोली जा रही हैं।' : 'Opening Security and 2FA Settings.',
        displayText: isHi ? 'सुरक्षा सेटिंग्स पर नेविगेट किया गया' : 'Navigated to Security & 2FA',
        executed: true,
        source: 'client_local_rule'
      };
    }

    // 3. Theme toggle
    if (t.includes('dark') || t.includes('डार्क') || t.includes('black') || t.includes('रात') || t.includes('अंधेरा')) {
      return {
        action: 'SET_THEME',
        target: 'dark',
        speechReply: isHi ? 'डार्क मोड सक्रिय किया गया।' : 'Dark mode enabled.',
        displayText: isHi ? 'डार्क मोड सक्रिय' : 'Dark Mode Enabled',
        executed: true,
        source: 'client_local_rule'
      };
    }

    if (t.includes('light') || t.includes('लाइट') || t.includes('उजाला') || t.includes('white') || t.includes('दिन')) {
      return {
        action: 'SET_THEME',
        target: 'light',
        speechReply: isHi ? 'लाइट मोड सक्रिय किया गया।' : 'Light mode enabled.',
        displayText: isHi ? 'लाइट मोड सक्रिय' : 'Light Mode Enabled',
        executed: true,
        source: 'client_local_rule'
      };
    }

    // 4. Panel Focus Commands
    if (t.includes('grid') || t.includes('ग्रिड') || t.includes('all panels') || t.includes('सभी पैनल')) {
      return {
        action: 'FOCUS_PANEL',
        target: 'all',
        speechReply: isHi ? '2x2 ग्रिड दृश्य दिखाया जा रहा है।' : 'Displaying 2x2 multi-panel grid view.',
        displayText: isHi ? '2×2 ग्रिड दृश्य सक्रिय' : '2×2 Grid View Active',
        executed: true,
        source: 'client_local_rule'
      };
    }

    if (t.includes('vegetable') || t.includes('सब्जी') || t.includes('sabzi') || t.includes('onion') || t.includes('potato') || t.includes('tomato')) {
      return {
        action: 'FOCUS_PANEL',
        target: 'panel-vegetables',
        speechReply: isHi ? 'सब्जी मंडी भाव पैनल खोला गया।' : 'Focusing Vegetable Market Panel.',
        displayText: isHi ? 'सब्जी मंडी भाव पैनल सक्रिय' : 'Vegetable Market Focused',
        executed: true,
        source: 'client_local_rule'
      };
    }

    if (t.includes('wheat') || t.includes('गेहूं') || t.includes('grain') || t.includes('अनाज') || t.includes('msp') || t.includes('मंडी भाव')) {
      return {
        action: 'FOCUS_PANEL',
        target: 'panel-grains',
        speechReply: isHi ? 'अनाज व गेहूं समर्थन मूल्य पैनल खोला गया। गेहूं का न्यूनतम समर्थन मूल्य ₹2,275 प्रति क्विंटल है।' : 'Focusing Grain Rates & MSP Panel. Wheat MSP benchmark is ₹2,275 per quintal.',
        displayText: isHi ? 'अनाज एवं MSP पैनल सक्रिय' : 'Grain MSP Panel Focused',
        executed: true,
        source: 'client_local_rule'
      };
    }

    if (t.includes('order') || t.includes('ऑर्डर') || t.includes('cart') || t.includes('खरीद')) {
      return {
        action: 'FOCUS_PANEL',
        target: 'panel-orders',
        speechReply: isHi ? 'आपके ऑर्डर का विवरण दिखाया जा रहा है।' : 'Showing your orders and cart details.',
        displayText: isHi ? 'ऑर्डर पैनल सक्रिय' : 'Orders Panel Focused',
        executed: true,
        source: 'client_local_rule'
      };
    }

    if (t.includes('contract') || t.includes('अनुबंध') || t.includes('टेंडर') || t.includes('tender')) {
      return {
        action: 'FOCUS_PANEL',
        target: 'panel-contracts',
        speechReply: isHi ? 'सक्रिय व्यापारिक अनुबंध दिखाए जा रहे हैं।' : 'Showing active trade contracts.',
        displayText: isHi ? 'अनुबंध पैनल सक्रिय' : 'Contracts Panel Focused',
        executed: true,
        source: 'client_local_rule'
      };
    }

    if (t.includes('scheme') || t.includes('योजना') || t.includes('subsidy') || t.includes('सब्सिडी')) {
      return {
        action: 'FOCUS_PANEL',
        target: 'panel-schemes',
        speechReply: isHi ? 'सरकारी कृषि योजनाएं और सब्सिडी पैनल खोला गया।' : 'Displaying Government Agriculture Schemes & Subsidies.',
        displayText: isHi ? 'सरकारी योजनाएं पैनल सक्रिय' : 'Govt Schemes Focused',
        executed: true,
        source: 'client_local_rule'
      };
    }

    if (t.includes('guidance') || t.includes('मार्गदर्शन') || t.includes('सलाह') || t.includes('advisory')) {
      return {
        action: 'FOCUS_PANEL',
        target: 'panel-guidance',
        speechReply: isHi ? 'उत्पादन मार्गदर्शन व विशेषज्ञ सलाह पैनल खोला गया।' : 'Opening Production Guidance & Agronomic Advice.',
        displayText: isHi ? 'उत्पादन मार्गदर्शन सक्रिय' : 'Guidance Panel Focused',
        executed: true,
        source: 'client_local_rule'
      };
    }

    return {
      action: 'GENERAL',
      speechReply: isHi 
        ? 'मैं आपकी सहायता के लिए तैयार हूँ। आप "किसान हब खोलो", "डार्क मोड करो", "गेहूं का भाव", या कोई भी सवाल पूछ सकते हैं।' 
        : 'I am your KisanSetu Voice Assistant. You can say "Farmer Hub", "Dark Mode", "Wheat MSP", or ask any farming question.',
      displayText: isHi ? `आदेश: "${transcript}"` : `Command: "${transcript}"`,
      executed: false,
      source: 'client_local_rule'
    };
  }
}

export const voiceAssistantService = new VoiceAssistantService();
