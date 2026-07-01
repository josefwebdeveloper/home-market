"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/app/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { listBuildingPlansByUser } from "@/lib/firestore/plans";
import { listMarketsByOrganizer, publishMarketEvent } from "@/lib/firestore/markets";
import type { BuildingPlan } from "@/types/building-plan";
import type { MarketEventWithMeta } from "@/lib/firestore/markets";
import { appCopy } from "@/lib/i18n/app-copy";

function DashboardContent() {
  const c = appCopy.dashboard;
  const { user } = useAuth();
  const [plans, setPlans] = useState<BuildingPlan[]>([]);
  const [markets, setMarkets] = useState<MarketEventWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      listBuildingPlansByUser(user.uid),
      listMarketsByOrganizer(user.uid),
    ]).then(([p, m]) => {
      setPlans(p);
      setMarkets(m);
      setLoading(false);
    });
  }, [user]);

  async function handlePublish(marketId: string) {
    await publishMarketEvent(marketId);
    if (!user) return;
    const updated = await listMarketsByOrganizer(user.uid);
    setMarkets(updated);
  }

  if (loading) {
    return <p className="text-olive-700">…</p>;
  }

  return (
    <AppShell title={c.title}>
      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl text-olive-950">{c.plans}</h2>
            <Link
              href="/dashboard/plans/new"
              className="rounded-full bg-olive-900 px-4 py-2 text-sm font-semibold text-cream-50"
            >
              {c.newPlan}
            </Link>
          </div>
          {plans.length === 0 ? (
            <p className="text-sm text-olive-700/80">{c.emptyPlans}</p>
          ) : (
            <ul className="space-y-3">
              {plans.map((plan) => (
                <li key={plan.id}>
                  <Link
                    href={`/dashboard/plans/${plan.id}`}
                    className="block rounded-xl border border-olive-800/10 bg-white p-4 hover:border-terracotta-400/50"
                  >
                    <p className="font-semibold text-olive-950">{plan.buildingName}</p>
                    <p className="text-sm text-olive-700">
                      {plan.city} · עד {plan.maxStalls} דוכנים
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl text-olive-950">{c.markets}</h2>
            <Link
              href="/dashboard/markets/new"
              className="rounded-full border border-olive-800/20 px-4 py-2 text-sm font-semibold text-olive-900"
            >
              {c.newMarket}
            </Link>
          </div>
          {markets.length === 0 ? (
            <p className="text-sm text-olive-700/80">{c.emptyMarkets}</p>
          ) : (
            <ul className="space-y-3">
              {markets.map((market) => {
                const open = market.slots.filter((s) => s.status === "open").length;
                return (
                  <li
                    key={market.id}
                    className="rounded-xl border border-olive-800/10 bg-white p-4"
                  >
                    <p className="font-semibold text-olive-950">{market.title}</p>
                    <p className="text-sm text-olive-700">
                      {market.date} · {open}/{market.slots.length} {c.openSlots}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {market.status === "draft" && (
                        <button
                          type="button"
                          onClick={() => handlePublish(market.id)}
                          className="rounded-full bg-terracotta-600 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          {c.publish}
                        </button>
                      )}
                      {market.status === "published" && (
                        <Link
                          href={`/market/${market.id}`}
                          className="rounded-full border border-olive-800/15 px-3 py-1.5 text-xs font-semibold text-olive-900"
                        >
                          {c.viewPublic}
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
