"use client";

import { Header } from "./Header";
import { Hero } from "./Hero";
import { VaadPlanSection } from "./VaadPlanSection";
import { HowItWorks } from "./HowItWorks";
import { WaitlistForm } from "./WaitlistForm";
import { LocaleProvider, useLocale } from "./LocaleProvider";

function Footer() {
  const { t } = useLocale();
  return (
    <footer className="border-t border-olive-800/8 px-6 py-8 text-center text-xs text-olive-600/60 md:px-12">
      {t.footer}
    </footer>
  );
}

function PageContent() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-sun-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-40 h-80 w-80 rounded-full bg-olive-400/20 blur-3xl" />
      <div className="grain pointer-events-none absolute inset-0 opacity-40" />
      <Header />
      <main>
        <Hero />
        <VaadPlanSection />
        <HowItWorks />
        <WaitlistForm />
      </main>
      <Footer />
    </div>
  );
}

export function LandingPage() {
  return (
    <LocaleProvider>
      <PageContent />
    </LocaleProvider>
  );
}
