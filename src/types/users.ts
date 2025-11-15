// types/users.ts
import type { ChartDefinition } from "./chartConfig";

/**
 * Base User Interface
 */
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  settings?: UserSettings;  // ← Optional in base, required in WithSettings
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  is_verified?: boolean;
}

/**
 * Tier Type
 */
export type Tier = "free" | "monthly" | "annual";

/**
 * User with full settings + tier (used by /me and update)
 */
export interface UserWithSettings extends Omit<User, "settings"> {
  settings: UserSettings;  // ← REQUIRED and full
  tier: Tier;
}

/**
 * User Creation
 */
export interface UserCreate {
  username: string;
  password: string;
  email: string;
  first_name?: string;
  last_name?: string;
  settings?: Partial<UserSettings>;
}

/**
 * Login Credentials
 */
export interface UserLogin {
  email: string;
  password: string;
}

/**
 * Login Response
 */
export interface UserResponse {
  user: User;
  access_token: string;
}

/**
 * Full User Settings
 */
export interface UserSettings {
  enabledPages?: string[];
  homePageLayout?: HomePageSection[];
  homePageAnalytics?: ChartDefinition[];
  workoutTypes?: string[];
}

/**
 * Home Page Section
 */
export interface HomePageSection {
  section: string;
  metricIds: number[];
}

/**
 * Legacy: Enabled Pages (if still used elsewhere)
 */
export interface EnabledPages {
  homePage: boolean;
  dietPage: boolean;
  workoutPage: boolean;
  financePage: boolean;
  analyticsPage: boolean;
}

/**
 * Optional: Keep old UserWithTier for backward compatibility
 * (Remove if no longer used)
 */
export interface UserWithTier extends User {
  tier: Tier;
}