import {useState} from "react";

function DietPage() {
    const [activeTab, setActiveTab] = useState<"today" | "days" | "foods" | "settings">("");


  const setTab = (tab: "today" | "days"| "foods"| "settings") => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mb-4">
        <div className="col-12">
          <h1 className="text-center mb-4">Diet</h1>

          {/* Tab Navigation */}
          <ul className="nav nav-tabs justify-content-center">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "today" ? "active" : ""}`}
                onClick={() => setTab("today")}
              >
                Today
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "workout-list" ? "active" : ""}`}
                onClick={() => setTab("days")}
              >
                Previous Days
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "foods" ? "active" : ""}`}
                onClick={() => setTab("foods")}
              >
                Foods
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setTab("settings")}
              >
                Settings
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "today" && (
        <div></div>
      )}

      {activeTab === "workout-list" && <div></div>}

      {activeTab === "settings" && 
      <div></div>
      // <SettingsEdit settingsKeys={["workoutTypes"]}/>
      }
    </div>
  );
}

export default DietPage