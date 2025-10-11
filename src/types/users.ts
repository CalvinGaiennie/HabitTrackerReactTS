export interface User {
  id: number;
  settings: UserSettings;
}

export interface UserCreate {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name:string
  settings: UserSettings;
}

export interface UserSettings {
  enabledPages: string[];
  homePageLayout: HomePageSection[];
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
