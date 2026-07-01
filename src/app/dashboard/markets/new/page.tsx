"use client";

import { useEffect, useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/app/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { getBuildingPlan, listActiveBuildingPlans } from "@/lib/firestore/plans";
import { createMarketEvent } from "@/lib/firestore/markets";
import type { BuildingPlan } from "@/types/building-plan";
import { appCopy } from "@/lib/i18n/app-copy";

function NewMarketForm() {
  const c = appCopy.marketForm;
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPlanId = searchParams.get("planId");
  const { user } = useAuth();
  const [plans, setPlans] = useState<BuildingPlan[]>([]);
  const [planId, setPlanId] = useState(preselectedPlanId ?? "");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    listActiveBuildingPlans().then(setPlans);
  }, []);

  useEffect(() => {
    if (preselectedPlanId) setPlanId(preselectedPlanId);
  }, [preselectedPlanId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !planId) return;
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const plan = await getBuildingPlan(planId);
    if (!plan) return;

    try {
      const marketId = await createMarketEvent({
        plan,
        title: String(fd.get("title")),
        date: String(fd.get("date")),
        organizerId: user.uid,
      });
      router.push("/dashboard");
    } finally {
      setPending(false);
    }
  }

  return (
    <AppShell title={c.title}>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-olive-800">
            {c.pickPlan}
          </label>
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            required
            className="w-full rounded-xl border border-olive-800/15 px-4 py-3"
          >
            <option value="">—</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.buildingName} · {plan.city}
              </option>
            ))}
          </select>
        </div>

        <input
          name="title"
          required
          placeholder={c.marketTitle}
          defaultValue="שוק ירקות בחצר"
          className="w-full rounded-xl border border-olive-800/15 px-4 py-3"
        />
        <input
          name="date"
          type="date"
          required
          className="w-full rounded-xl border border-olive-800/15 px-4 py-3"
        />

        <button
          type="submit"
          disabled={pending || !planId}
          className="w-full rounded-full bg-terracotta-600 py-3 font-semibold text-white disabled:opacity-60"
        >
          {c.create}
        </button>
      </form>
    </AppShell>
  );
}

function NewMarketPageInner() {
  return (
    <RequireAuth>
      <NewMarketForm />
    </RequireAuth>
  );
}

export default function NewMarketPage() {
  return (
    <Suspense fallback={<div className="p-8 text-olive-700">…</div>}>
      <NewMarketPageInner />
    </Suspense>
  );
}
