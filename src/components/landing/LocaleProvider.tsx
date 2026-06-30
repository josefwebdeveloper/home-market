"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { copy, type Locale } from "@/lib/i18n/content";

interface LocaleContextValue {
  locale: Locale;
  t: (typeof copy)[Locale];
  toggle: () => void;
  dir: "rtl" | "ltr";
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function DirSync({ dir, locale }: { dir: "rtl" | "ltr"; locale: Locale }) {
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [dir, locale]);
  return null;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("he");
  const dir = locale === "he" ? "rtl" : "ltr";

  const toggle = () => setLocale((l) => (l === "he" ? "ru" : "he"));

  return (
    <LocaleContext.Provider
      value={{
        locale,
        t: copy[locale],
        toggle,
        dir,
      }}
    >
      <DirSync dir={dir} locale={locale} />
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
