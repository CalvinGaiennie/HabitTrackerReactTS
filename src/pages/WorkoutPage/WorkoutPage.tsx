import { useState } from "react";
import WorkoutForm from "../../components/WorkoutForm";
import WorkoutList from "../../components/WorkoutList";
import SettingsEdit from "../../components/SettingsEdit";
import ExercisePage from "./SubPages/ExercisePage";

function WorkoutPage() {
  const [activeTab, setActiveTab] = useState<"create" | "workout-list" | "exercises" | "settings">("create");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWorkoutCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setTab("workout-list");
  };

  const setTab = (tab: "create" | "workout-list"| "exercises"| "settings") => {
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
                className={`nav-link ${activeTab === "workout-list" ? "active" : ""}`}
                onClick={() => setTab("workout-list")}
              >
                Workout History
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "exercises" ? "active" : ""}`}
                onClick={() => setTab("exercises")}
              >
                Exercises
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

      {activeTab === "workout-list" && <WorkoutList key={refreshTrigger} />}

      {activeTab === "exercises" && <ExercisePage />
      }
      {activeTab === "settings" && <SettingsEdit settingsKeys={["workoutTypes"]}/>}
    </div>
  );
}

export default WorkoutPage;
