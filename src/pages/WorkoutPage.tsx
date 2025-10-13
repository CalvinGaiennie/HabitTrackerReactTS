import { useState } from "react";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutList from "../components/WorkoutList";
import WorkoutPageSettings from "../components/WorkoutPageSettings";
function WorkoutPage() {
  const [activeTab, setActiveTab] = useState<"create" | "list" | "settings">("create");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWorkoutCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setTab("list");
  };

  const setTab = (tab: "create" | "list" | "settings") => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mb-4">
        <div className="col-12">
          <h1 className="text-center mb-4">Workouts</h1>

          {/* Tab Navigation */}
          <ul className="nav nav-tabs justify-content-center">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "create" ? "active" : ""}`}
                onClick={() => setTab("create")}
              >
                Create Workout
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "list" ? "active" : ""}`}
                onClick={() => setTab("list")}
              >
                Workout History
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
      {activeTab === "create" && (
        <WorkoutForm onWorkoutCreated={handleWorkoutCreated} />
      )}

      {activeTab === "list" && <WorkoutList key={refreshTrigger} />}

      {activeTab === "settings" && <WorkoutPageSettings/>}
    </div>
  );
}

export default WorkoutPage;
