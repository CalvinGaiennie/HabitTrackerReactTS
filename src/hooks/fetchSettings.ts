import { getUserSettings, updateUserSettings } from "../services/users";
import type { UserSettings } from "../types/users";

// Default settings structure
const defaultSettings: UserSettings = {
  enabledPages: ["homePage", "dietPage", "workoutPage", "analyticsPage"],
  homePageLayout: [
    {
      section: "To Log",
      metricIds: [1, 2, 3, 4, 9],
    },
    {
      section: "To Do",
      metricIds: [5, 6, 7, 8, 10, 11, 12, 13, 14, 15],
    },
  ],
};

export default function fetchSettings(
  setSettings: (settings: UserSettings) => void,
  userId: number
) {
  const fetchSettings = async () => {
    try {
      console.log(`Fetching user settings for user ${userId}...`);
      const user = await getUserSettings(userId);
      console.log("User data received:", user);
      console.log("User settings:", user.settings);

      // Check if settings are empty or missing required fields
      if (
        !user.settings ||
        Object.keys(user.settings).length === 0 ||
        !user.settings.homePageLayout
      ) {
        console.log("No settings found, initializing with defaults...");
        try {
          await updateUserSettings(userId, defaultSettings);
          setSettings(defaultSettings);
        } catch (updateErr) {
          console.error("Failed to initialize default settings:", updateErr);
          setSettings(defaultSettings); // Use defaults locally even if save fails
        }
      } else {
        setSettings(user.settings);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      // Fallback to default settings if API fails
      setSettings(defaultSettings);
    }
  };
  fetchSettings();
}
