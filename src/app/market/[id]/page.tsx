"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getMarketEvent, type MarketEventWithMeta } from "@/lib/firestore/markets";
import { appCopy } from "@/lib/i18n/app-copy";

export default function PublicMarketPage() {
  const params = useParams();
  const marketId = params.id as string;
  const [market, setMarket] = useState<MarketEventWithMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const c = appCopy.publicMarket;

  useEffect(() => {
    getMarketEvent(marketId).then((m) => {
      setMarket(m);
      setLoading(false);
    });
  }, [marketId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50 text-olive-700">
        …
      </div>
    );
  }

  if (!market || market.status !== "published") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream-50 px-6">
        <p className="text-olive-800">השוק לא נמצא או עדיין לא פורסם</p>
        <Link href="/" className="text-terracotta-600 underline">
          {c.back}
        </Link>
      </div>
    );
  }

  const openSlots = market.slots.filter((s) => s.status === "open").length;

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-olive-800/10 px-6 py-5">
        <Link href="/" className="font-display text-xl text-olive-900">
          שוק בחצר
        </Link>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <span className="rounded-full bg-sun-400/25 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-olive-800">
          {market.city}
        </span>
        <h1 className="mt-4 font-display text-4xl text-olive-950">{market.title}</h1>

        <dl className="mt-8 space-y-4 rounded-2xl border border-olive-800/10 bg-white p-6">
          <div>
            <dt className="text-xs uppercase tracking-widest text-olive-600">{c.when}</dt>
            <dd className="mt-1 text-lg font-medium text-olive-950">
              {market.date} · {market.startHour}–{market.endHour}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-olive-600">{c.where}</dt>
            <dd className="mt-1 text-lg font-medium text-olive-950">
              {market.buildingName}
              <span className="mt-1 block text-sm font-normal text-olive-700">
                {market.address}, {market.city}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-olive-600">{c.stalls}</dt>
            <dd className="mt-1 text-lg font-medium text-olive-950">
              {openSlots} {c.open} / {market.slots.length}
            </dd>
          </div>
        </dl>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {market.slots.map((slot) => (
            <li
              key={slot.id}
              className="rounded-xl border border-dashed border-olive-700/20 bg-cream-100/80 p-4 text-center"
            >
              <p className="text-sm font-medium text-olive-900">
                {appCopy.categories[slot.category]}
              </p>
              <p className="mt-1 text-xs text-olive-600">
                {slot.status === "open" ? c.open : c.booked}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
