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
import type {
  BuildingPlan,
  CategoryLimit,
  OrganizerPolicy,
  PlanRules,
  PlanStatus,
} from "@/types/building-plan";
import { getFirebaseDb } from "@/lib/firebase/client";
import { COLLECTIONS } from "./paths";

function toIso(value: Timestamp | string | undefined): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
}

function mapPlan(id: string, data: Record<string, unknown>): BuildingPlan {
  return {
    id,
    buildingId: (data.buildingId as string) ?? id,
    buildingName: data.buildingName as string,
    city: data.city as string,
    address: data.address as string,
    maxStalls: data.maxStalls as number,
    categoryLimits: data.categoryLimits as CategoryLimit[],
    rules: data.rules as PlanRules,
    organizerPolicy: data.organizerPolicy as OrganizerPolicy,
    allowedOrganizerIds: (data.allowedOrganizerIds as string[]) ?? [],
    organizerCannotExceedPlan: (data.organizerCannotExceedPlan as boolean) ?? true,
    recurringPreset: (data.recurringPreset as string | null) ?? null,
    status: data.status as PlanStatus,
    createdBy: data.createdBy as string,
    createdAt: toIso(data.createdAt as Timestamp | string),
    updatedAt: toIso(data.updatedAt as Timestamp | string),
  };
}

export interface CreatePlanInput {
  buildingName: string;
  city: string;
  address: string;
  maxStalls: number;
  categoryLimits: CategoryLimit[];
  rules: PlanRules;
  organizerPolicy: OrganizerPolicy;
  createdBy: string;
}

export async function createBuildingPlan(input: CreatePlanInput): Promise<string> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase not configured");

  const ref = await addDoc(collection(db, COLLECTIONS.buildingPlans), {
    buildingName: input.buildingName,
    city: input.city,
    address: input.address,
    maxStalls: input.maxStalls,
    categoryLimits: input.categoryLimits,
    rules: input.rules,
    organizerPolicy: input.organizerPolicy,
    allowedOrganizerIds: [],
    organizerCannotExceedPlan: true,
    recurringPreset: null,
    status: "active",
    createdBy: input.createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(ref, { buildingId: ref.id });
  return ref.id;
}

export async function getBuildingPlan(planId: string): Promise<BuildingPlan | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  const snap = await getDoc(doc(db, COLLECTIONS.buildingPlans, planId));
  if (!snap.exists()) return null;
  return mapPlan(snap.id, snap.data() as Record<string, unknown>);
}

export async function listBuildingPlansByUser(uid: string): Promise<BuildingPlan[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  const q = query(
    collection(db, COLLECTIONS.buildingPlans),
    where("createdBy", "==", uid),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapPlan(d.id, d.data() as Record<string, unknown>));
}

export async function listActiveBuildingPlans(): Promise<BuildingPlan[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  const q = query(
    collection(db, COLLECTIONS.buildingPlans),
    where("status", "==", "active"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapPlan(d.id, d.data() as Record<string, unknown>));
}
