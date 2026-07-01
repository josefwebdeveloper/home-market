"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/app/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { createBuildingPlan } from "@/lib/firestore/plans";
import type { CategoryLimit, ProduceCategory } from "@/types/building-plan";
import { appCopy } from "@/lib/i18n/app-copy";

const defaultCategories: CategoryLimit[] = [
  { category: "vegetables", max: 4 },
  { category: "fruits", max: 3 },
  { category: "honey", max: 1 },
];

function NewPlanForm() {
  const c = appCopy.planForm;
  const router = useRouter();
  const { user } = useAuth();
  const [pending, setPending] = useState(false);
  const [categoryLimits, setCategoryLimits] = useState(defaultCategories);

  function updateCategoryMax(category: ProduceCategory, max: number) {
    setCategoryLimits((prev) =>
      prev.map((item) => (item.category === category ? { ...item, max } : item)),
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setPending(true);

    const fd = new FormData(e.currentTarget);

    try {
      const planId = await createBuildingPlan({
        buildingName: String(fd.get("buildingName")),
        city: String(fd.get("city")),
        address: String(fd.get("address")),
        maxStalls: Number(fd.get("maxStalls")),
        categoryLimits,
        rules: {
          startHour: String(fd.get("startHour")),
          endHour: String(fd.get("endHour")),
          maxParkingSpots: Number(fd.get("maxParkingSpots") || 5),
          noiseLevel: "quiet",
          cleanupRequired: true,
          shabbatAware: true,
        },
        organizerPolicy: String(fd.get("organizerPolicy")) as "any_resident" | "vaad_only",
        createdBy: user.uid,
      });
      router.push(`/dashboard/plans/${planId}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <AppShell title={c.title}>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <input
          name="buildingName"
          required
          placeholder={c.buildingName}
          className="w-full rounded-xl border border-olive-800/15 px-4 py-3"
        />
        <input
          name="city"
          required
          placeholder={c.city}
          className="w-full rounded-xl border border-olive-800/15 px-4 py-3"
        />
        <input
          name="address"
          required
          placeholder={c.address}
          className="w-full rounded-xl border border-olive-800/15 px-4 py-3"
        />
        <input
          name="maxStalls"
          type="number"
          min={1}
          max={30}
          defaultValue={8}
          required
          placeholder={c.maxStalls}
          className="w-full rounded-xl border border-olive-800/15 px-4 py-3"
        />

        <div>
          <p className="mb-2 text-sm font-medium text-olive-800">{c.categories}</p>
          <div className="space-y-2">
            {categoryLimits.map((item) => (
              <div key={item.category} className="flex items-center justify-between gap-4">
                <span className="text-sm text-olive-800">
                  {appCopy.categories[item.category]}
                </span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={item.max}
                  onChange={(e) =>
                    updateCategoryMax(item.category, Number(e.target.value))
                  }
                  className="w-20 rounded-lg border border-olive-800/15 px-2 py-1 text-center"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            name="startHour"
            defaultValue="08:00"
            placeholder={c.startHour}
            className="rounded-xl border border-olive-800/15 px-4 py-3"
          />
          <input
            name="endHour"
            defaultValue="13:00"
            placeholder={c.endHour}
            className="rounded-xl border border-olive-800/15 px-4 py-3"
          />
        </div>

        <input
          name="maxParkingSpots"
          type="number"
          defaultValue={5}
          className="w-full rounded-xl border border-olive-800/15 px-4 py-3"
          placeholder="חניות לאורחים"
        />

        <select
          name="organizerPolicy"
          defaultValue="any_resident"
          className="w-full rounded-xl border border-olive-800/15 px-4 py-3"
        >
          <option value="any_resident">{c.policies.any_resident}</option>
          <option value="vaad_only">{c.policies.vaad_only}</option>
        </select>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-terracotta-600 py-3 font-semibold text-white disabled:opacity-60"
        >
          {c.save}
        </button>
      </form>
    </AppShell>
  );
}

export default function NewPlanPage() {
  return (
    <RequireAuth>
      <NewPlanForm />
    </RequireAuth>
  );
}
