import { getUserSettings } from "../services/users";
import type { UserSettings } from "../types/users";

export default function fetchSettings(
  setSettings: (settings: UserSettings) => void
) {
  const fetchSettings = async () => {
    try {
      const user = await getUserSettings(1);
      setSettings(user.settings);
    } catch (err) {
      console.error(err);
    }
  };
  fetchSettings();
}
