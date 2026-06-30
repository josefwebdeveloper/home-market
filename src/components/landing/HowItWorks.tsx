"use client";

import { useLocale } from "./LocaleProvider";

export function HowItWorks() {
  const { t, dir } = useLocale();

  return (
    <section id="how" className="px-6 py-20 md:px-12 md:py-28">
      <div
        className={`mx-auto max-w-6xl ${dir === "rtl" ? "text-right" : "text-left"}`}
      >
        <h2 className="font-display text-4xl text-olive-950 md:text-5xl">
          {t.stepsTitle}
        </h2>
        <ol className="mt-12 space-y-0">
          {t.steps.map((step, i) => (
            <li
              key={step.t}
              className="group relative flex gap-6 border-t border-olive-800/10 py-8 md:gap-10"
            >
              <span className="font-display text-3xl text-terracotta-500/40 transition group-hover:text-terracotta-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-olive-950">{step.t}</h3>
                <p className="mt-1 text-olive-800/75">{step.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
