import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import type { BuildingPlan } from "@/types/building-plan";
import type { MarketEvent, MarketSlot, MarketStatus } from "@/types/market-event";
import { generateSlotsFromPlan } from "@/lib/markets/generate-slots";
import { getFirebaseDb } from "@/lib/firebase/client";
import { COLLECTIONS } from "./paths";

function toIso(value: Timestamp | string | undefined): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
}

function mapMarket(id: string, data: Record<string, unknown>): MarketEvent {
  return {
    id,
    planId: data.planId as string,
    buildingId: data.buildingId as string,
    title: data.title as string,
    date: data.date as string,
    status: data.status as MarketStatus,
    slots: data.slots as MarketSlot[],
    featuredProduce: (data.featuredProduce as string[]) ?? [],
    organizerId: data.organizerId as string,
    createdAt: toIso(data.createdAt as Timestamp | string),
    buildingName: data.buildingName as string | undefined,
    city: data.city as string | undefined,
    address: data.address as string | undefined,
    startHour: data.startHour as string | undefined,
    endHour: data.endHour as string | undefined,
  } as MarketEvent & {
    buildingName?: string;
    city?: string;
    address?: string;
    startHour?: string;
    endHour?: string;
  };
}

export type MarketEventWithMeta = MarketEvent & {
  buildingName?: string;
  city?: string;
  address?: string;
  startHour?: string;
  endHour?: string;
};

export interface CreateMarketInput {
  plan: BuildingPlan;
  title: string;
  date: string;
  organizerId: string;
}

export async function createMarketEvent(input: CreateMarketInput): Promise<string> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase not configured");

  const slots = generateSlotsFromPlan(
    input.plan.maxStalls,
    input.plan.categoryLimits,
  );

  const ref = await addDoc(collection(db, COLLECTIONS.marketEvents), {
    planId: input.plan.id,
    buildingId: input.plan.buildingId,
    title: input.title,
    date: input.date,
    status: "draft",
    slots,
    featuredProduce: [],
    organizerId: input.organizerId,
    buildingName: input.plan.buildingName,
    city: input.plan.city,
    address: input.plan.address,
    startHour: input.plan.rules.startHour,
    endHour: input.plan.rules.endHour,
    createdAt: serverTimestamp(),
  });

  return ref.id;
}

export async function publishMarketEvent(marketId: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase not configured");

  await updateDoc(doc(db, COLLECTIONS.marketEvents, marketId), {
    status: "published",
  });
}

export async function getMarketEvent(marketId: string): Promise<MarketEventWithMeta | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  const snap = await getDoc(doc(db, COLLECTIONS.marketEvents, marketId));
  if (!snap.exists()) return null;
  return mapMarket(snap.id, snap.data() as Record<string, unknown>);
}

export async function listMarketsByOrganizer(uid: string): Promise<MarketEventWithMeta[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  const q = query(
    collection(db, COLLECTIONS.marketEvents),
    where("organizerId", "==", uid),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapMarket(d.id, d.data() as Record<string, unknown>));
}

export async function listPublishedMarkets(): Promise<MarketEventWithMeta[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  const q = query(
    collection(db, COLLECTIONS.marketEvents),
    where("status", "==", "published"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapMarket(d.id, d.data() as Record<string, unknown>));
}
