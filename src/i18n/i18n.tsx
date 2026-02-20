'use client';

import en from '@/i18n/en.json';
import es from '@/i18n/es.json';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Locale = 'es' | 'en';
type Dict = typeof es;

const dictionaries: Record<Locale, Dict> = { es, en };
const STORAGE_KEY = 'lang';

function getNavigatorLocale(): Locale {
  if (typeof navigator === 'undefined') return 'es';
  const lang = (navigator.languages?.[0] ?? navigator.language ?? 'es').toLowerCase();
  return lang.startsWith('es') ? 'es' : 'en';
}

function getByPath(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function interpolate(str: string, vars?: Record<string, string | number>) {
  if (!vars) return str;
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => String(vars[k] ?? ''));
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');

  useEffect(() => {
    const stored =
      typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) as Locale | null) : null;
    const initial = stored === 'es' || stored === 'en' ? stored : getNavigatorLocale();
    setLocale(initial);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, l);
  };

  const t = useMemo(() => {
    const dict = dictionaries[locale];
    return (key: string, vars?: Record<string, string | number>) => {
      const value = getByPath(dict, key);
      if (typeof value !== 'string') return key;
      return interpolate(value, vars);
    };
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
