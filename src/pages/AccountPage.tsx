import { useState, useRef, useEffect } from "react";
import type { MetricCreate } from "../types/Metrics.ts";
import type { DailyLog } from "../types/dailyLogs.ts";
import { createMetric } from "../services/metrics.ts";
import SpecificAdd from "../components/SpecificAdd.tsx";
import LogViewer from "../components/LogViewer.tsx";
import SettingsEdit from "../components/SettingsEdit.tsx";
import fetchLogs from "../hooks/fetchLogs.ts";

type TabType = "add-metric" | "add-log" | "view-logs" | "settings";

function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabType>("add-metric");
  const [formData, setFormData] = useState<MetricCreate>({
    user_id: 1,
    name: "",
    description: "",
    data_type: "text",
    unit: "",
    notes_on: false,
  });
  const [logs, setLogs] = useState<DailyLog[]>([]);

  const isSubmitting = useRef(false);

  // Fetch logs on component mount
  useEffect(() => {
    fetchLogs(setLogs);
  }, []);

  // Listen for log saved events from SpecificAdd component
  useEffect(() => {
    const handleLogSaved = async () => {
      try {
        fetchLogs(setLogs);
      } catch (err) {
        console.error("Failed to refresh logs:", err);
      }
    };

    window.addEventListener("logSaved", handleLogSaved);
    return () => window.removeEventListener("logSaved", handleLogSaved);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "scale_min" || name === "scale_max") {
        return { ...prev, [name]: Number(value) };
      }
      if (name === "notes_on") {
        return { ...prev, notes_on: value === "true" };
      }
      if (name === "data_type") {
        return { ...prev, data_type: value as MetricCreate["data_type"] };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting metric...");
    if (!formData.name.trim()) {
      alert("Name is required");
      isSubmitting.current = false;
      return;
    }

    if (
      formData.data_type === "scale" &&
      formData.scale_min! >= formData.scale_max!
    ) {
      alert("Scale min must be less than scale max");
      isSubmitting.current = false;
      return;
    }
    try {
      await createMetric(formData);
      alert("Metric created successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong creating the metric.");
    } finally {
      isSubmitting.current = false;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "add-metric":
        return (
          <div>
            <h2>Add New Metric</h2>
            <form
              onSubmit={handleSubmit}
              className="w-100"
              style={{ maxWidth: "500px" }}
            >
              <div className="mb-3">
                <label className="form-label">Name:</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description:</label>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Type:</label>
                <select
                  name="data_type"
                  value={formData.data_type}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="decimal">Number</option>
                  <option value="boolean">True/False</option>
                  <option value="text">Text</option>
                  <option value="scale">Scale (ex. 1-5)</option>
                  <option value="clock">Clock In/Out</option>
                </select>
              </div>
              {formData.data_type === "scale" && (
                <div className="mb-3">
                  <label className="form-label">Scale Range</label>
                  <div className="row">
                    <div className="col-6">
                      <input
                        name="scale_min"
                        value={formData.scale_min ?? ""}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Min (e.g., 1)"
                      />
                    </div>
                    <div className="col-6">
                      <input
                        name="scale_max"
                        value={formData.scale_max ?? ""}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Max (e.g., 5)"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Unit</label>
                <input
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., minutes, hours, reps"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Do you want to include a notes section?
                </label>
                <select
                  name="notes_on"
                  value={String(formData.notes_on)}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Save Metric
              </button>
            </form>
            <hr />
            <SpecificAdd />
          </div>
        );
      case "add-log":
        return (
          <div>
            <h2>Add Log</h2>
            <p>Add a new log entry for today.</p>
            {/* Add log form will go here */}
          </div>
        );
      case "view-logs":
        return (
          <div>
            <h2>View Logs</h2>
            <LogViewer logs={logs} />
          </div>
        );
      case "settings":
        return (
          <div>
            <h2>Settings</h2>
            <SettingsEdit />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <h1>Account</h1>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "add-metric" ? "active" : ""}`}
            onClick={() => setActiveTab("add-metric")}
            type="button"
          >
            Add Metric
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "add-log" ? "active" : ""}`}
            onClick={() => setActiveTab("add-log")}
            type="button"
          >
            Add Log
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "view-logs" ? "active" : ""}`}
            onClick={() => setActiveTab("view-logs")}
            type="button"
          >
            View Logs
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
            type="button"
          >
            Settings
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
}

export default AccountPage;
