export type SupportedLanguage = 
  | 'en' 
  | 'hi' 
  | 'pa' 
  | 'mr' 
  | 'gu' 
  | 'bn' 
  | 'te' 
  | 'ta' 
  | 'hinglish';

export interface LanguageInfo {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  greeting: string;
  subtext: string;
  region: string;
  accentColor: string;
}

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}
