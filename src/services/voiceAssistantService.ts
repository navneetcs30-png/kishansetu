/**
 * KishanSetu Voice Assistant Service
 * Real-time Speech Recognition (STT), Speech Synthesis (TTS),
 * and Voice Command NLP Action Dispatcher.
 */

import { queryKnowledgeBase } from './agriKnowledgeBase';

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
  private activeAudio: HTMLAudioElement | null = null;
  private isNativeSpeaking: boolean = false;
  private isAudioSpeaking: boolean = false;
  private onSpeakStartCallback?: () => void;
  private onSpeakEndCallback?: () => void;
  private cachedVoices: SpeechSynthesisVoice[] = [];
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

      // Pre-warm SpeechSynthesis voices if supported
      if ('speechSynthesis' in window) {
        try {
          this.cachedVoices = window.speechSynthesis.getVoices();
          window.speechSynthesis.onvoiceschanged = () => {
            this.cachedVoices = window.speechSynthesis.getVoices();
          };
        } catch (e) {
          // ignore
        }
      }

      // Listen for Native Android TTS callbacks dispatched from AndroidNativeTTS
      window.addEventListener('kishan_native_tts_start', () => {
        this.isNativeSpeaking = true;
        this.onSpeakStartCallback?.();
      });

      window.addEventListener('kishan_native_tts_end', () => {
        this.isNativeSpeaking = false;
        this.onSpeakEndCallback?.();
      });
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
    return (
      ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) ||
      !!(window as any).AndroidNativeTTS ||
      typeof Audio !== 'undefined'
    );
  }

  public isNativeAndroidTTSAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    const native = (window as any).AndroidNativeTTS;
    if (!native) return false;
    if (typeof native.isAvailable === 'function') {
      return native.isAvailable();
    }
    return true;
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

  // --- Speech Synthesis (TTS) Multi-Tier Execution ---
  public speak(
    text: string, 
    languageCode: string, 
    onStart?: () => void, 
    onEnd?: () => void
  ): void {
    if (!this.isSpeechSynthesisSupported() || this.isMuted) return;

    this.stopSpeaking();

    // Clean markdown and non-verbal tokens for clean speech pronunciation
    const cleanText = text
      .replace(/[*#_`>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\n\s*\n/g, '. ')
      .replace(/\n/g, '. ')
      .trim();

    if (!cleanText) return;

    this.onSpeakStartCallback = onStart;
    this.onSpeakEndCallback = onEnd;

    const locale = SPEECH_LOCALE_MAP[languageCode] || 'hi-IN';

    // Tier 1: Native Android TextToSpeech Engine (APK container / Android WebView)
    if (typeof window !== 'undefined' && (window as any).AndroidNativeTTS?.speakText) {
      try {
        this.isNativeSpeaking = true;
        onStart?.();
        (window as any).AndroidNativeTTS.speakText(cleanText, locale, this.speechRate);
        return;
      } catch (err) {
        console.warn('AndroidNativeTTS speak call failed, trying next tier:', err);
        this.isNativeSpeaking = false;
      }
    }

    // Tier 2: W3C Web SpeechSynthesis API (Desktop Chrome / Safari / Edge)
    if (
      typeof window !== 'undefined' && 
      'speechSynthesis' in window && 
      'SpeechSynthesisUtterance' in window
    ) {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = locale;
        utterance.rate = this.speechRate;
        utterance.pitch = 1.0;

        // Try selecting authentic native voice for the locale
        const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
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

        utterance.onerror = (err) => {
          console.warn('Web SpeechSynthesis error event, trying streaming audio fallback:', err);
          this.currentUtterance = null;
          this.speakViaAudioFallback(cleanText, locale, onStart, onEnd);
        };

        window.speechSynthesis.speak(utterance);
        return;
      } catch (e) {
        console.warn('Speech synthesis speak threw error, falling back to audio stream:', e);
      }
    }

    // Tier 3: HTML5 Audio Stream Fallback
    this.speakViaAudioFallback(cleanText, locale, onStart, onEnd);
  }

  private speakViaAudioFallback(
    text: string,
    locale: string,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    if (typeof Audio === 'undefined') {
      onEnd?.();
      return;
    }

    try {
      this.stopSpeaking();
      const lang = locale.split('-')[0] || 'hi';
      const truncatedText = text.length > 190 ? text.substring(0, 190) : text;
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(truncatedText)}`;
      
      const audio = new Audio(url);
      this.activeAudio = audio;
      this.isAudioSpeaking = true;

      audio.onplay = () => {
        onStart?.();
      };

      audio.onended = () => {
        this.isAudioSpeaking = false;
        this.activeAudio = null;
        onEnd?.();
      };

      audio.onerror = () => {
        this.isAudioSpeaking = false;
        this.activeAudio = null;
        onEnd?.();
      };

      audio.play().catch((err) => {
        console.warn('Audio fallback playback blocked or failed:', err);
        this.isAudioSpeaking = false;
        this.activeAudio = null;
        onEnd?.();
      });
    } catch (e) {
      console.warn('Could not play audio fallback:', e);
      onEnd?.();
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined') {
      if ((window as any).AndroidNativeTTS?.stopSpeaking) {
        try {
          (window as any).AndroidNativeTTS.stopSpeaking();
        } catch (e) {
          // ignore
        }
      }

      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {
          // ignore
        }
        this.currentUtterance = null;
      }

      if (this.activeAudio) {
        try {
          this.activeAudio.pause();
          this.activeAudio.currentTime = 0;
        } catch (e) {
          // ignore
        }
        this.activeAudio = null;
      }
    }
    this.isNativeSpeaking = false;
    this.isAudioSpeaking = false;
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined') return false;
    if (this.isNativeSpeaking) return true;
    if ((window as any).AndroidNativeTTS?.isSpeaking?.()) return true;
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) return true;
    if (this.isAudioSpeaking) return true;
    return false;
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

  // --- Offline / Client-Side Comprehensive Knowledge & Voice Action Parser ---
  private localFallbackVoiceCommand(transcript: string, language: string): VoiceCommandResponse {
    const res = queryKnowledgeBase(transcript, language);
    return {
      action: res.action || 'GENERAL',
      target: res.target,
      speechReply: res.speechReply,
      displayText: res.answer || res.displayText || res.speechReply,
      executed: res.executed ?? (res.action !== undefined && res.action !== 'GENERAL'),
      source: 'knowledge_engine'
    };
  }
}

export const voiceAssistantService = new VoiceAssistantService();
