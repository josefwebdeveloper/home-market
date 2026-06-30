import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { WaitlistEntry } from "@/types";
import { getFirebaseDb } from "@/lib/firebase/client";
import { COLLECTIONS } from "./paths";

export async function joinWaitlist(
  entry: Omit<WaitlistEntry, "id" | "createdAt">,
): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "error" }> {
  const db = getFirebaseDb();
  if (!db) return { ok: false, reason: "not_configured" };

  try {
    await addDoc(collection(db, COLLECTIONS.waitlist), {
      ...entry,
      createdAt: serverTimestamp(),
    });
    return { ok: true };
  } catch {
    return { ok: false, reason: "error" };
  }
}
