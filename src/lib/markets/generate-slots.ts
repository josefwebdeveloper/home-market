import type { CategoryLimit, ProduceCategory } from "@/types/building-plan";
import type { MarketSlot } from "@/types/market-event";

function slotId(index: number): string {
  return `slot-${index + 1}`;
}

export function generateSlotsFromPlan(
  maxStalls: number,
  categoryLimits: CategoryLimit[],
): MarketSlot[] {
  const slots: MarketSlot[] = [];
  let index = 0;

  for (const { category, max } of categoryLimits) {
    const count = Math.min(max, maxStalls - slots.length);
    for (let i = 0; i < count; i++) {
      slots.push({
        id: slotId(index++),
        category,
        status: "open",
        priceIls: 0,
      });
    }
    if (slots.length >= maxStalls) break;
  }

  while (slots.length < maxStalls) {
    const fallback: ProduceCategory = "vegetables";
    slots.push({
      id: slotId(index++),
      category: fallback,
      status: "open",
      priceIls: 0,
    });
  }

  return slots.slice(0, maxStalls);
}
