import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Settings,
  Send,
  Bot,
  User,
  Key,
  RotateCcw,
  CheckCircle2,
  Sun,
  Moon,
  Sprout,
  ShoppingBag,
  Building2,
  ShieldCheck,
  Languages,
  ArrowRight,
  Maximize2,
  Minimize2,
  Radio,
  Sliders,
} from 'lucide-react';
import {
  voiceAssistantService,
  VoiceCommandResponse,
  SPEECH_LOCALE_MAP,
} from '../services/voiceAssistantService';
import { useLanguage } from '../i18n/LanguageContext';
import { SupportedLanguage } from '../i18n/types';

export interface GlobalVoiceAssistantProps {
  activeModule: string;
  onNavigateModule: (module: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSetTheme: (theme: 'light' | 'dark') => void;
  onOpenLanguageModal: () => void;
}

interface ChatItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  action?: VoiceCommandResponse;
  timestamp: string;
}

const QUICK_COMMAND_PRESETS = [
  { label: '🌾 Farmer Hub', prompt: 'Switch to Farmer Hub' },
  { label: '🛒 Consumer Store', prompt: 'Open Consumer Store' },
  { label: '🏢 Bulk Buyer', prompt: 'Switch to Bulk Buyer' },
  { label: '🛡️ Admin Console', prompt: 'Open Admin Console' },
  { label: '🌓 Toggle Dark/Light', prompt: 'Toggle theme mode' },
  { label: '🌾 Wheat MSP Rates', prompt: 'Show wheat MSP rates' },
  { label: '🥬 Vegetable Mandi', prompt: 'Show vegetable mandi' },
  { label: '🌐 Switch to Hindi', prompt: 'Change language to Hindi' },
];

export const GlobalVoiceAssistant: React.FC<GlobalVoiceAssistantProps> = ({
  activeModule,
  onNavigateModule,
  theme,
  onToggleTheme,
  onSetTheme,
  onOpenLanguageModal,
}) => {
  const { language, setLanguage, languages, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(() => voiceAssistantService.getIsMuted());

  const [liveTranscript, setLiveTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [lastExecutedAction, setLastExecutedAction] = useState<VoiceCommandResponse | null>(null);

  const [chatLog, setChatLog] = useState<ChatItem[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text:
        language === 'hi'
          ? 'नमस्ते! मैं आपका किशनसेतु वॉयस सहायक हूँ। आप बोलकर वेबसाइट नियंत्रित कर सकते हैं, जैसे "किसान हब खोलो", "डार्क मोड", या "गेहूं का भाव"।'
          : 'Namaste! I am your KishanSetu Voice Assistant. Speak commands like "Farmer Hub", "Dark Mode", or "Wheat MSP Rates" to control the platform.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Settings Modal State
  const [showSettings, setShowSettings] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => voiceAssistantService.getStoredApiKey());
  const [keySavedToast, setKeySavedToast] = useState(false);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatLog, liveTranscript, isProcessing]);

  // Execute recognized voice action on platform
  const dispatchPlatformAction = (res: VoiceCommandResponse) => {
    setLastExecutedAction(res);
    setTimeout(() => setLastExecutedAction(null), 4500);

    switch (res.action) {
      case 'NAVIGATE_MODULE':
        if (res.target) {
          onNavigateModule(res.target);
        }
        break;

      case 'SET_THEME':
        if (res.target === 'dark' || res.target === 'light') {
          onSetTheme(res.target);
        } else {
          onToggleTheme();
        }
        break;

      case 'SET_LANGUAGE':
        if (res.target) {
          setLanguage(res.target as SupportedLanguage);
        }
        break;

      case 'OPEN_MODAL':
        if (res.target === 'language') {
          onOpenLanguageModal();
        }
        break;

      case 'FOCUS_PANEL':
        if (res.target) {
          // Dispatch custom event for dashboard panel jumping
          window.dispatchEvent(
            new CustomEvent('kishansetu_select_panel', { detail: { panelId: res.target } })
          );
        }
        break;

      default:
        break;
    }
  };

  // Process any incoming query (from mic or text input)
  const handleQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMessage: ChatItem = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatLog((prev) => [...prev, userMessage]);
    setLiveTranscript('');
    setIsProcessing(true);

    try {
      const result: VoiceCommandResponse = await voiceAssistantService.processVoiceCommand(
        queryText,
        language,
        activeModule
      );

      setIsProcessing(false);

      // Execute action if actionable
      if (result.action && result.action !== 'GENERAL') {
        dispatchPlatformAction(result);
      }

      const assistantMessage: ChatItem = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: result.displayText || result.speechReply,
        action: result,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatLog((prev) => [...prev, assistantMessage]);

      // Speak response aloud via SpeechSynthesis
      if (!isMuted && result.speechReply) {
        setIsSpeaking(true);
        voiceAssistantService.speak(
          result.speechReply,
          language,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
    } catch (err) {
      console.error('Error handling voice query:', err);
      setIsProcessing(false);
      const fallbackMsg: ChatItem = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I could not complete that request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatLog((prev) => [...prev, fallbackMsg]);
    }
  };

  // Toggle Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      voiceAssistantService.stopListening();
      setIsListening(false);
      setLiveTranscript('');
    } else {
      if (!voiceAssistantService.isSpeechRecognitionSupported()) {
        alert(
          'Speech recognition is not supported in this browser. Please type your query in the input box.'
        );
        return;
      }

      // Stop speech synthesis if speaking
      voiceAssistantService.stopSpeaking();
      setIsSpeaking(false);

      voiceAssistantService.startListening(language, {
        onStart: () => {
          setIsListening(true);
        },
        onInterim: (text) => {
          setLiveTranscript(text);
        },
        onFinal: (finalText) => {
          setIsListening(false);
          setLiveTranscript(finalText);
          handleQuery(finalText);
        },
        onError: (err) => {
          setIsListening(false);
          console.warn('Speech recognition error:', err);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    voiceAssistantService.setMuted(nextState);
    if (nextState) {
      setIsSpeaking(false);
    }
  };

  // Save Custom Gemini Key
  const handleSaveGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    voiceAssistantService.setStoredApiKey(geminiKeyInput);
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setShowSettings(false);
    }, 1200);
  };

  // Replay speech for a message
  const handleReplaySpeech = (text: string) => {
    if (isMuted) return;
    setIsSpeaking(true);
    voiceAssistantService.speak(
      text,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <>
      {/* Floating Launcher Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 print:hidden select-none">
        {/* Action Executed Floating Notification Toast */}
        {lastExecutedAction && (
          <div className="animate-bounce flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-lg border border-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>{lastExecutedAction.displayText}</span>
          </div>
        )}

        {/* The Floating Mic Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setIsMinimized(false);
          }}
          className={`relative group flex items-center justify-center p-3.5 rounded-full shadow-2xl transition-all duration-300 transform active:scale-95 cursor-pointer border ${
            isOpen
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-400 ring-4 ring-emerald-500/20'
              : 'bg-slate-900/90 dark:bg-emerald-700/90 backdrop-blur-md text-white hover:bg-emerald-600 border-slate-700/80 hover:border-emerald-400 ring-2 ring-emerald-500/30 hover:scale-105'
          }`}
          title="KishanSetu AI Voice Sahayak"
          aria-label="Toggle Voice AI Assistant"
        >
          {/* Animated Halo Wave Pulse Ring when listening or speaking */}
          {(isListening || isSpeaking) && (
            <span className="absolute -inset-1.5 rounded-full bg-emerald-500/40 animate-ping" />
          )}

          {/* Glowing gradient background aura */}
          <div className="absolute inset-0 rounded-full bg-radial from-emerald-400/30 to-transparent blur-xs opacity-75" />

          {/* Center Mic Icon & Sound Wave */}
          <div className="relative flex items-center gap-1.5">
            {isListening ? (
              <Radio className="w-6 h-6 text-rose-400 animate-pulse" />
            ) : isSpeaking ? (
              <Volume2 className="w-6 h-6 text-amber-300 animate-bounce" />
            ) : (
              <Mic className="w-6 h-6 text-emerald-300 group-hover:text-white transition-colors" />
            )}
          </div>

          {/* Quick status pill label next to mic button */}
          <span className="absolute -top-2 -left-2 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white text-[8px] font-black text-white items-center justify-center">
              AI
            </span>
          </span>
        </button>
      </div>

      {/* Slide-out Voice Assistant Drawer / Modal */}
      {isOpen && (
        <div
          className={`fixed bottom-20 right-5 z-50 w-[92vw] sm:w-[420px] transition-all duration-300 shadow-2xl rounded-2xl border overflow-hidden backdrop-blur-xl ${
            theme === 'dark'
              ? 'bg-slate-900/95 border-slate-700/80 text-white'
              : 'bg-white/95 border-emerald-200/90 text-slate-900'
          }`}
          style={{ maxHeight: isMinimized ? '64px' : '620px' }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-emerald-600/15 via-teal-600/10 to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight font-display">
                    {t('app.voiceAssistant', 'KishanSetu AI Sahayak')}
                  </h3>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    Real-time AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isListening
                    ? 'Listening... Speak your command'
                    : isSpeaking
                    ? 'Speaking aloud...'
                    : isProcessing
                    ? 'Processing AI request...'
                    : 'Voice Navigation & Agri Q&A'}
                </p>
              </div>
            </div>

            {/* Header Right Action Icons */}
            <div className="flex items-center gap-1">
              {/* Language Selector Dropdown */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-1.5 py-1 text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                title="Change assistant speech language"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.code.toUpperCase()})
                  </option>
                ))}
              </select>

              {/* Mute/Unmute TTS */}
              <button
                type="button"
                onClick={handleToggleMute}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  isMuted
                    ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
                title={isMuted ? 'Unmute Audio Speech' : 'Mute Audio Speech'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Gemini API Key Settings */}
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  showSettings
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
                title="Configure Google Gemini API Key"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Minimize/Expand Drawer */}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Close Drawer */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/50 transition cursor-pointer"
                title="Close Voice Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Settings Sub-Card: Custom Gemini API Key */}
              {showSettings && (
                <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/20 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold flex items-center gap-1 text-emerald-800 dark:text-emerald-300">
                      <Key className="w-3.5 h-3.5" /> Google Gemini API Key
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Supports gemini-2.5-flash
                    </span>
                  </div>
                  <form onSubmit={handleSaveGeminiKey} className="flex gap-1.5">
                    <input
                      type="password"
                      placeholder="Enter AIzaSy... or leave blank for server key"
                      value={geminiKeyInput}
                      onChange={(e) => setGeminiKeyInput(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition cursor-pointer shrink-0"
                    >
                      Save Key
                    </button>
                  </form>
                  {keySavedToast && (
                    <p className="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ API Key updated in browser storage!
                    </p>
                  )}
                  <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    If empty, KishanSetu uses the server environment key or high-speed multilingual NLP engine.
                  </p>
                </div>
              )}

              {/* Real-time Dynamic Audio Frequency Wave Visualizer */}
              {(isListening || isSpeaking || isProcessing) && (
                <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-600/10 via-teal-600/15 to-emerald-600/10 border-b border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      {isListening
                        ? 'Listening live to microphone...'
                        : isSpeaking
                        ? 'Voice synthesizing answer...'
                        : 'Querying Gemini Cloud AI...'}
                    </span>
                  </div>

                  {/* Dancing Sound Bars */}
                  <div className="flex items-center gap-1 h-5">
                    {[16, 24, 12, 28, 18, 22, 10, 26, 14, 20].map((height, idx) => (
                      <span
                        key={idx}
                        className="w-1 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"
                        style={{
                          height: `${height}px`,
                          animationDuration: `${0.3 + (idx % 4) * 0.15}s`,
                          animationDelay: `${idx * 0.05}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Interim Live Transcript Indicator */}
              {liveTranscript && (
                <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 animate-fadeIn">
                  <Radio className="w-3.5 h-3.5 animate-pulse shrink-0 text-amber-600 dark:text-amber-400" />
                  <span className="italic font-medium">"{liveTranscript}"</span>
                </div>
              )}

              {/* Scrollable Conversation Body */}
              <div
                ref={chatScrollRef}
                className="p-4 space-y-3 overflow-y-auto"
                style={{ maxHeight: '310px', minHeight: '220px' }}
              >
                {chatLog.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs transition-all ${
                        item.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : theme === 'dark'
                          ? 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/80'
                          : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1 opacity-75 text-[10px]">
                        <span className="font-semibold flex items-center gap-1">
                          {item.sender === 'user' ? (
                            <>
                              <User className="w-2.5 h-2.5" /> You
                            </>
                          ) : (
                            <>
                              <Bot className="w-2.5 h-2.5" /> AI Sahayak
                            </>
                          )}
                        </span>
                        <span>{item.timestamp}</span>
                      </div>

                      <p className="whitespace-pre-wrap leading-relaxed">{item.text}</p>

                      {/* Action executed pill */}
                      {item.action && item.action.action !== 'GENERAL' && (
                        <div className="mt-2 pt-1.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{item.action.displayText}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Replay voice button for assistant messages */}
                    {item.sender === 'assistant' && (
                      <button
                        type="button"
                        onClick={() => handleReplaySpeech(item.text)}
                        className="mt-1 text-[10px] text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 px-1 cursor-pointer transition"
                        title="Replay Voice Speech"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Speak again</span>
                      </button>
                    )}
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pl-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                    <span>Thinking...</span>
                  </div>
                )}
              </div>

              {/* Quick Preset Command Chips */}
              <div className="px-3 py-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Quick Voice Commands:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-normal">Click to try</span>
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-[72px] overflow-y-auto py-0.5">
                  {QUICK_COMMAND_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuery(preset.prompt)}
                      className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-slate-700/80 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-2xs shrink-0"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Input Bar */}
              <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 flex items-center gap-2">
                {/* Big Glow Mic Toggle Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl shadow-md transition-all transform active:scale-95 cursor-pointer shrink-0 flex items-center justify-center ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-500/20'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Click to Speak (Voice Command)'}
                  aria-label="Toggle speech listening"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Text Fallback Query Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (textInput.trim()) {
                      handleQuery(textInput);
                      setTextInput('');
                    }
                  }}
                  className="flex-1 flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    placeholder={
                      isListening
                        ? 'Listening to microphone...'
                        : 'Ask question or type voice command...'
                    }
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    disabled={isListening}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 transition"
                  />

                  <button
                    type="submit"
                    disabled={!textInput.trim() || isProcessing}
                    className={`p-2 rounded-xl text-white transition cursor-pointer shrink-0 ${
                      textInput.trim() && !isProcessing
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-xs'
                        : 'bg-slate-400/50 dark:bg-slate-700 cursor-not-allowed opacity-50'
                    }`}
                    title="Send Command"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
