"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/app/AppShell";
import { getBuildingPlan } from "@/lib/firestore/plans";
import type { BuildingPlan } from "@/types/building-plan";
import { appCopy } from "@/lib/i18n/app-copy";

function PlanDetailContent() {
  const params = useParams();
  const planId = params.id as string;
  const [plan, setPlan] = useState<BuildingPlan | null>(null);

  useEffect(() => {
    getBuildingPlan(planId).then(setPlan);
  }, [planId]);

  if (!plan) {
    return (
      <AppShell>
        <p className="text-olive-700">…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title={plan.buildingName}>
      <div className="max-w-xl space-y-4">
        <p className="text-olive-700">
          {plan.address}, {plan.city}
        </p>
        <p className="text-lg font-semibold text-olive-950">
          עד {plan.maxStalls} דוכנים · {plan.rules.startHour}–{plan.rules.endHour}
        </p>

        <ul className="space-y-2 rounded-xl border border-olive-800/10 bg-white p-4">
          {plan.categoryLimits.map((item) => (
            <li key={item.category} className="flex justify-between text-sm">
              <span>{appCopy.categories[item.category]}</span>
              <span className="font-medium">max {item.max}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/dashboard/markets/new?planId=${plan.id}`}
          className="inline-block rounded-full bg-olive-900 px-6 py-3 text-sm font-semibold text-cream-50"
        >
          {appCopy.dashboard.newMarket}
        </Link>
      </div>
    </AppShell>
  );
}

export default function PlanDetailPage() {
  return (
    <RequireAuth>
      <PlanDetailContent />
    </RequireAuth>
  );
}
