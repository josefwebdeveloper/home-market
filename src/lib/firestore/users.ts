import type { UserRole, UserProfile } from "@/types/user";
import { COLLECTIONS } from "./paths";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

function toIso(value: Timestamp | string | undefined): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  const snap = await getDoc(doc(db, COLLECTIONS.users, uid));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    uid,
    email: data.email as string,
    displayName: (data.displayName as string) ?? "",
    role: data.role as UserRole,
    city: data.city as string | undefined,
    createdAt: toIso(data.createdAt as Timestamp | string),
  };
}

export async function createUserProfile(
  uid: string,
  data: { email: string; displayName: string; role: UserRole; city?: string },
): Promise<UserProfile> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase not configured");

  const profile = {
    email: data.email,
    displayName: data.displayName,
    role: data.role,
    city: data.city ?? "",
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, COLLECTIONS.users, uid), profile);

  return {
    uid,
    email: data.email,
    displayName: data.displayName,
    role: data.role,
    city: data.city,
    createdAt: new Date().toISOString(),
  };
}
