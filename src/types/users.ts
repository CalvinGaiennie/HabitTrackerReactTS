export interface User {
  id: number;
  settings: UserSettings;
}

export interface UserSettings {
  enabledPages: string[];
  homePageLayout: HomePageSection[];
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
