export interface User {
  id: number;
  settings: UserSettings;
}

export interface UserSettings {
  homePageLayout: HomePageSection[];
}

export interface HomePageSection {
  section: string;
  metricIds: number[];
}
