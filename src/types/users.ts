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
