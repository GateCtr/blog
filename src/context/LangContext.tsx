import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Lang = 'en' | 'fr';

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>({ lang: 'en', toggle: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem('gatectr-lang');
    return stored === 'fr' ? 'fr' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('gatectr-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => setLang(l => (l === 'en' ? 'fr' : 'en'));

  return <LangContext.Provider value={{ lang, toggle }}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
