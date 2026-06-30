"use client";

import { useState, type FormEvent } from "react";
import { joinWaitlist } from "@/lib/firestore/waitlist";
import { useLocale } from "./LocaleProvider";

type FormStatus = "idle" | "pending" | "success" | "not_configured" | "error";

export function WaitlistForm() {
  const { t, locale, dir } = useLocale();
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("pending");

    const fd = new FormData(e.currentTarget);
    const result = await joinWaitlist({
      email: String(fd.get("email") ?? ""),
      role: String(fd.get("role") ?? "resident") as
        | "organizer"
        | "vendor"
        | "vaad"
        | "resident",
      city: String(fd.get("city") ?? ""),
      locale,
    });

    if (result.ok) setStatus("success");
    else if (result.reason === "not_configured") setStatus("not_configured");
    else setStatus("error");
  }

  return (
    <section
      id="waitlist"
      className="relative px-6 py-20 md:px-12 md:py-28"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-terracotta-400/50 to-transparent" />
      <div
        className={`mx-auto max-w-xl ${dir === "rtl" ? "text-right" : "text-left"}`}
      >
        <h2 className="font-display text-4xl text-olive-950">{t.formTitle}</h2>
        <p className="mt-2 text-olive-800/75">{t.formSub}</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-olive-800">
              {t.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-olive-800/15 bg-cream-50 px-4 py-3 text-olive-950 outline-none transition focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20"
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-olive-800">
              {t.role}
            </label>
            <select
              id="role"
              name="role"
              className="w-full rounded-xl border border-olive-800/15 bg-cream-50 px-4 py-3 text-olive-950 outline-none transition focus:border-terracotta-500"
            >
              <option value="vaad">{t.roles.vaad}</option>
              <option value="organizer">{t.roles.organizer}</option>
              <option value="vendor">{t.roles.vendor}</option>
              <option value="resident">{t.roles.resident}</option>
            </select>
          </div>

          <div>
            <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-olive-800">
              {t.city}
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              placeholder="Herzliya"
              className="w-full rounded-xl border border-olive-800/15 bg-cream-50 px-4 py-3 text-olive-950 outline-none transition focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={status === "pending" || status === "success"}
            className="w-full rounded-full bg-terracotta-600 py-3.5 text-sm font-semibold text-cream-50 transition hover:bg-terracotta-500 disabled:opacity-60"
          >
            {status === "pending" ? t.pending : t.submit}
          </button>

          {status === "success" && (
            <p className="text-center text-sm font-medium text-olive-700">{t.success}</p>
          )}
          {status === "not_configured" && (
            <p className="text-center text-sm text-olive-600">{t.notConfigured}</p>
          )}
          {status === "error" && (
            <p className="text-center text-sm text-red-700">{t.error}</p>
          )}
        </form>
      </div>
    </section>
  );
}
