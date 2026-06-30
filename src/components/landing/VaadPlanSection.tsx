"use client";

import { useLocale } from "./LocaleProvider";

export function VaadPlanSection() {
  const { t, dir } = useLocale();

  return (
    <section
      id="plan"
      className="relative border-y border-olive-800/8 bg-olive-950 px-6 py-20 text-cream-50 md:px-12 md:py-28"
    >
      <div className="grain pointer-events-none absolute inset-0 opacity-30" />
      <div
        className={`relative mx-auto max-w-6xl ${dir === "rtl" ? "text-right" : "text-left"}`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sun-400">
          Building Plan
        </p>
        <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
          {t.planTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-100/75">
          {t.planDesc}
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.planItems.map((item) => (
            <article
              key={item.n}
              className="group relative overflow-hidden rounded-2xl border border-cream-100/10 bg-cream-50/5 p-6 transition hover:border-sun-400/40 hover:bg-cream-50/10"
            >
              <span className="font-display text-5xl text-sun-400/20 transition group-hover:text-sun-400/35">
                {item.n}
              </span>
              <h3 className="mt-4 text-xl font-semibold">{item.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-100/65">
                {item.d}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
