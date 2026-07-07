export type Language = "he" | "en";

export type ProjectType = "rv" | "marine" | "roof" | "camping" | "balcony" | "awning" | "pergolakit";

export interface PredefinedSurface {
  id: ProjectType;
  nameHe: string;
  nameEn: string;
  defaultWidth: number; // in meters
  defaultLength: number; // in meters
  maxWidth: number;
  maxLength: number;
  icon: string;
  bgGradient: string;
  descriptionHe: string;
  descriptionEn: string;
}

export interface SolarPanelSpec {
  id: string;
  nameHe: string;
  nameEn: string;
  power: number; // in Watts
  width: number; // in meters
  length: number; // in meters
  weight: number; // in kg
  efficiency: number; // in %
  priceEstimate: number; // in NIS / USD
}

export interface Appliance {
  id: string;
  nameHe: string;
  nameEn: string;
  power: number; // in Watts
  defaultHours: number; // hours per day
  icon: string;
  category: "kitchen" | "electronics" | "comfort" | "other";
}

export interface SavedApplianceUsage {
  applianceId: string;
  quantity: number;
  hoursPerDay: number;
}

export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}
