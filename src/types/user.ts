export type UserRole = "vaad" | "organizer" | "vendor";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  city?: string;
  createdAt: string;
}
