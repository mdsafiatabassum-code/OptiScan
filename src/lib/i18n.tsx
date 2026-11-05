import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations, type Language, type TranslationDict } from '@/lib/translations';

const STORAGE_KEY = 'optiscan:language';
const DEFAULT_LANGUAGE: Language = 'en';

function loadLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'hi' || stored === 'kn') return stored;
  } catch {
    // ignore
  }
  return DEFAULT_LANGUAGE;
}

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(loadLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({ language, setLanguage, t: translations[language] }),
    [language, setLanguage],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export function useT(): TranslationDict {
  return useI18n().t;
}
