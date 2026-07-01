export * from "./building-plan";
export * from "./market-event";
export * from "./user";

export interface WaitlistEntry {
  id?: string;
  email: string;
  role: "organizer" | "vendor" | "vaad" | "resident";
  city: string;
  locale: "he" | "ru";
  createdAt: string;
}
