import { useState, useEffect } from "react";
import type { UserSettings } from "../types/users";
import fetchSettings from "../hooks/fetchSettings.ts";

function SettingsEdit() {
  const [settings, setSettings] = useState<UserSettings>();

  useEffect(() => {
    fetchSettings(setSettings);
  }, []);

  return (
    <div className="card p-4 m-5 ">
      <h1>Settings</h1>
      <div className="row">
        {settings?.homePageLayout?.map((section, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-6 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{section.section}</h5>
                <div className="d-flex flex-column">
                  {section.metricIds.map((metricId, metricIndex) => (
                    <input
                      key={metricIndex}
                      className="mb-1 form-control"
                      value={metricId}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SettingsEdit;
