import { useState, useEffect } from "react";
import type { UserSettings } from "../types/users";
import fetchSettings from "../hooks/fetchSettings.ts";

function SettingsEdit() {
  const [settings, setSettings] = useState<UserSettings>();

  useEffect(() => {
    fetchSettings(setSettings);
  }, []);

  return (
    <div>
      <h1>Settings</h1>
      <p>
        {settings?.homePageLayout.map((section) => section.section).join(", ")}
      </p>
    </div>
  );
}

export default SettingsEdit;
