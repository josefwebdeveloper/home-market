"use client";

import { useLocale } from "./LocaleProvider";

export function Header() {
  const { t, toggle, dir } = useLocale();

  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12">
      <div className={dir === "rtl" ? "text-right" : "text-left"}>
        <p className="font-display text-2xl tracking-tight text-olive-900">
          {t.brand}
        </p>
        <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-olive-600/70">
          {t.tagline}
        </p>
      </div>
      <button
        type="button"
        onClick={toggle}
        className="rounded-full border border-olive-800/15 bg-cream-50/80 px-4 py-2 text-sm font-medium text-olive-800 backdrop-blur transition hover:border-terracotta-500 hover:text-terracotta-600"
      >
        {t.lang}
      </button>
    </header>
  );
}
