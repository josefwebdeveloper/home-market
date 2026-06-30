export type ProduceCategory =
  | "vegetables"
  | "fruits"
  | "berries"
  | "greens"
  | "eggs"
  | "honey";

export type VendorType = "farmer" | "home_garden" | "cooperative";

export type PlanStatus = "draft" | "active" | "archived";

export type OrganizerPolicy = "vaad_only" | "any_resident" | "named_curators";

export interface CategoryLimit {
  category: ProduceCategory;
  max: number;
}

export interface PlanRules {
  startHour: string;
  endHour: string;
  maxParkingSpots: number;
  noiseLevel: "quiet" | "family" | "lively";
  cleanupRequired: boolean;
  shabbatAware: boolean;
}

export interface BuildingPlan {
  id: string;
  buildingId: string;
  buildingName: string;
  city: string;
  address: string;
  maxStalls: number;
  categoryLimits: CategoryLimit[];
  rules: PlanRules;
  organizerPolicy: OrganizerPolicy;
  allowedOrganizerIds: string[];
  organizerCannotExceedPlan: boolean;
  recurringPreset: string | null;
  status: PlanStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Building {
  id: string;
  name: string;
  city: string;
  address: string;
  geo: { lat: number; lng: number };
  vaadContactEmail?: string;
}
