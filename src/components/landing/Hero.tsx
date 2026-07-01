"use client";

import { useLocale } from "./LocaleProvider";

export function Hero() {
  const { t, dir } = useLocale();

  return (
    <section className="relative z-10 px-6 pb-20 pt-8 md:px-12 md:pb-28 md:pt-12">
      <div
        className={`mx-auto max-w-6xl ${dir === "rtl" ? "text-right" : "text-left"}`}
      >
        <div className="animate-rise opacity-0 [animation-delay:100ms] [animation-fill-mode:forwards]">
          <span className="inline-block rounded-full bg-sun-400/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-olive-800">
            Israel · produce · courtyard
          </span>
        </div>

        <h1 className="animate-rise mt-8 max-w-3xl whitespace-pre-line font-display text-5xl leading-[1.05] text-olive-950 opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards] md:text-7xl">
          {t.heroTitle}
        </h1>

        <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-olive-800/85 opacity-0 [animation-delay:350ms] [animation-fill-mode:forwards] md:text-xl">
          {t.heroSub}
        </p>

        <div className="animate-rise mt-10 flex flex-wrap gap-4 opacity-0 [animation-delay:500ms] [animation-fill-mode:forwards]">
          <a
            href="/login"
            className="group inline-flex items-center gap-2 rounded-full bg-olive-900 px-7 py-3.5 text-sm font-semibold text-cream-50 shadow-lg shadow-olive-900/20 transition hover:bg-terracotta-600"
          >
            {t.ctaPrimary}
            <span className="transition group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center rounded-full border border-olive-800/20 bg-cream-50/60 px-7 py-3.5 text-sm font-semibold text-olive-900 backdrop-blur transition hover:border-olive-800/40"
          >
            Dashboard
          </a>
        </div>

        {/* Decorative stall preview */}
        <div className="animate-rise relative mt-16 opacity-0 [animation-delay:650ms] [animation-fill-mode:forwards] md:mt-20">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-sun-300/30 via-transparent to-olive-400/20 blur-2xl" />
          <div className="relative grid grid-cols-2 gap-3 rounded-2xl border border-olive-800/10 bg-cream-50/70 p-4 backdrop-blur-md md:grid-cols-4 md:gap-4 md:p-6">
            {["🍅", "🥒", "🍑", "🍯"].map((emoji, i) => (
              <div
                key={emoji}
                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-olive-700/20 bg-cream-100/80 py-8 transition hover:border-terracotta-400/50 hover:bg-sun-100/50"
                style={{ animationDelay: `${700 + i * 80}ms` }}
              >
                <span className="text-3xl">{emoji}</span>
                <span className="mt-2 text-[10px] uppercase tracking-widest text-olive-600/60">
                  {["ירקות", "ירקות", "פירות", "דבש"][i]}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-olive-600/50">
            6 / 8 דוכנים · פתוח לירקות
          </p>
        </div>
      </div>
    </section>
  );
}
