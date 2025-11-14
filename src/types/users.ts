import type { BooleanStats, ChartConfig } from "./chartConfig"; 
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  settings: UserSettings;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  is_verified?: boolean;
}

export type Tier = "free" | "monthly" | "annual";

export interface UserWithTier extends User {
  tier: Tier;
}

export interface UserCreate {
  username: string;
  password: string;
  email: string;
  first_name?: string;
  last_name?: string;
  settings?: UserSettings;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  user: User;
  access_token: string;
}

export interface UserSettings {
  enabledPages?: string[];
  homePageLayout?: HomePageSection[];
  homePageAnalytics?: ChartDefinition[];
  workoutTypes?: string[];
}

export interface HomePageSection {
  section: string;
  metricIds: number[];
}

export interface EnabledPages {
  homePage: boolean;
  dietPage: boolean;
  workoutPage: boolean;
  financePage: boolean;
  analyticsPage: boolean;
}

export interface ChartDefinition {
  chartConfig: ChartConfig;
  booleanStats: BooleanStats;
}