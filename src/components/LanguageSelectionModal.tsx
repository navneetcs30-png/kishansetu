import React, { useState } from 'react';
import { 
  Languages, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Volume2,
  X 
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { SupportedLanguage } from '../i18n/types';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  canDismiss = true
}) => {
  const { language, setLanguage, languages, confirmLanguageSelection, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language);
  const [speaking, setSpeaking] = useState(false);

  if (!isOpen) return null;

  const currentLangObj = languages.find((l) => l.code === selectedLang) || languages[0];

  const handleSpeakGreeting = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        setSpeaking(false);
      }
    }
  };

  const handleConfirm = () => {
    confirmLanguageSelection(selectedLang);
    if (onClose) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-modal-title"
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto transition-all">
        {/* Decorative Top Accent Gradient Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500" />

        {/* Modal Header */}
        <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
              <Languages className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  KishanSetu Localization
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                  • 9 Regional Languages
                </span>
              </div>
              <h2 id="lang-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {t('langModal.chooseTitle', 'Choose Your Preferred Language')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {t('langModal.chooseSub', 'Select the language you want to experience the KishanSetu digital ecosystem in.')}
              </p>
            </div>
          </div>

          {canDismiss && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close language selector"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Active Language Live Preview Banner */}
        <div className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800/80 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {currentLangObj.greeting}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 hidden sm:inline">
                ({currentLangObj.subtext})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSpeakGreeting(currentLangObj.greeting)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
              speaking
                ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
            }`}
            title="Listen to native voice pronunciation"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{speaking ? 'Speaking...' : 'Listen Audio'}</span>
          </button>
        </div>

        {/* Language Cards Grid */}
        <div className="p-6 sm:p-8 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {languages.map((langItem) => {
              const isSelected = selectedLang === langItem.code;
              return (
                <button
                  key={langItem.code}
                  type="button"
                  onClick={() => {
                    setSelectedLang(langItem.code);
                    setLanguage(langItem.code);
                  }}
                  className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group ${
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                          {langItem.nativeName}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-xs">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {langItem.label}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                      {langItem.code.toUpperCase()}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>{langItem.region}</span>
                    <span className="group-hover:translate-x-1 transition-transform text-emerald-500 font-bold">
                      →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer & Continue Button */}
        <div className="px-6 py-4 sm:px-8 sm:py-5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t('langModal.quickSwitch', 'You can change language anytime from the top navigation bar.')}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {canDismiss && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>{t('langModal.enterBtn', 'Enter KishanSetu Platform')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
