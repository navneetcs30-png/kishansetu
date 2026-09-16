import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { SupportedLanguage, LanguageInfo } from './types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageInfo[];
  currentLanguageInfo: LanguageInfo;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  confirmLanguageSelection: (lang: SupportedLanguage) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Determine initial language
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kishansetu_language') as SupportedLanguage;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    }
    // Default to Hindi for high Indian agriculture accessibility
    return 'hi';
  });

  // Modal open state for language selection gate
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const alreadySelected = localStorage.getItem('kishansetu_lang_selected');
      return !alreadySelected;
    }
    return false;
  });

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kishansetu_language', newLang);
      localStorage.setItem('kishansetu_lang_selected', 'true');
      window.dispatchEvent(new CustomEvent('kishansetu_language_changed', { detail: { language: newLang } }));
    }
  }, []);

  const confirmLanguageSelection = useCallback((chosenLang: SupportedLanguage) => {
    setLanguage(chosenLang);
    setIsLanguageModalOpen(false);
  }, [setLanguage]);

  // Translation helper function
  const t = useCallback(
    (key: string, fallback?: string): string => {
      const activeDict = TRANSLATIONS[language];
      if (activeDict && activeDict[key]) {
        return activeDict[key];
      }
      // Fallback to English
      const enDict = TRANSLATIONS.en;
      if (enDict && enDict[key]) {
        return enDict[key];
      }
      return fallback || key;
    },
    [language]
  );

  const currentLanguageInfo = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languages: SUPPORTED_LANGUAGES,
      currentLanguageInfo,
      isLanguageModalOpen,
      setIsLanguageModalOpen,
      confirmLanguageSelection,
    }),
    [language, setLanguage, t, currentLanguageInfo, isLanguageModalOpen, confirmLanguageSelection]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
