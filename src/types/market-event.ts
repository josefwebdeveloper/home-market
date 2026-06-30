import type { ProduceCategory, VendorType } from "./building-plan";

export type MarketStatus = "draft" | "published" | "live" | "completed" | "cancelled";

export type SlotStatus = "open" | "pending" | "booked" | "waitlist";

export interface MarketSlot {
  id: string;
  category: ProduceCategory;
  status: SlotStatus;
  vendorId?: string;
  priceIls: number;
}

export interface ExpectedProduct {
  name: string;
  unit: string;
  approxQty?: string;
}

export interface VendorApplication {
  id: string;
  marketId: string;
  slotId: string;
  vendorId: string;
  vendorType: VendorType;
  expectedProducts: ExpectedProduct[];
  status: "pending" | "approved" | "rejected" | "waitlist";
  createdAt: string;
}

export interface MarketEvent {
  id: string;
  planId: string;
  buildingId: string;
  title: string;
  date: string;
  status: MarketStatus;
  slots: MarketSlot[];
  featuredProduce: string[];
  organizerId: string;
  createdAt: string;
}
