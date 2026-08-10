"use client";

/**
 * src/Components/Languagecontext.tsx
 * Lightweight i18n context — no extra library required.
 *
 * Setup (in app/layout.tsx or src/app/layout.tsx):
 *   import { LanguageProvider } from "@/Components/Languagecontext";
 *   <LanguageProvider>{children}</LanguageProvider>
 *
 * Usage in any component:
 *   const { t, locale, setLocale } = useLanguage();
 *   <p>{t("cart")}</p>
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, Locale, TranslationKey } from "./translations";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "ghorerbazar_locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("bn");

  // Restore saved preference on mount
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && saved in translations) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  };

  const t = (key: TranslationKey): string => translations[locale][key] ?? translations.en[key];

  return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}