import { useState, useRef, useEffect } from "react";
import type { MetricCreate, Metric } from "../types/Metrics.ts";
import type { DailyLog } from "../types/dailyLogs.ts";
import {
  createMetric,
  updateMetric,
  deleteMetric,
} from "../services/metrics.ts";
import { deleteDailyLog } from "../services/dailyLogs.ts";
import SpecificAdd from "../components/SpecificAdd.tsx";
import LogViewer from "../components/LogViewer.tsx";
import SettingsEdit from "../components/SettingsEdit.tsx";
import fetchLogs from "../hooks/fetchLogs.ts";
import fetchMetrics from "../hooks/fetchMetrics.ts";

type TabType = "metric" | "log" | "settings";
type ModeType = "add" | "edit" | "view";

function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabType>("metric");
  const [metricMode, setMetricMode] = useState<ModeType>("add");
  const [logMode, setLogMode] = useState<ModeType>("add");
  const [formData, setFormData] = useState<MetricCreate>({
    user_id: 1,
    name: "",
    description: "",
    data_type: "text",
    unit: "",
    notes_on: false,
  });
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaveMessage, setSettingsSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isSubmitting = useRef(false);

  // Fetch logs and metrics on component mount
  useEffect(() => {
    fetchLogs(setLogs);
    fetchMetrics(setMetrics);
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
      if (editingMetric) {
        await updateMetric(editingMetric.id, formData);
        alert("Metric updated successfully!");
        setEditingMetric(null);
      } else {
        await createMetric(formData);
        alert("Metric created successfully!");
      }
      fetchMetrics(setMetrics);
      setFormData({
        user_id: 1,
        name: "",
        description: "",
        data_type: "text",
        unit: "",
        notes_on: false,
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong with the metric operation.");
    } finally {
      isSubmitting.current = false;
    }
  };

  const handleEditMetric = (metric: Metric) => {
    setEditingMetric(metric);
    setFormData({
      user_id: metric.user_id,
      name: metric.name,
      description: metric.description || "",
      data_type: metric.data_type,
      unit: metric.unit || "",
      notes_on: metric.notes_on,
      scale_min: metric.scale_min,
      scale_max: metric.scale_max,
    });
    setMetricMode("add"); // Switch to add mode to show the form
  };

  const handleDeleteMetric = async (metricId: number) => {
    if (confirm("Are you sure you want to delete this metric?")) {
      try {
        await deleteMetric(metricId);
        alert("Metric deleted successfully!");
        fetchMetrics(setMetrics);
      } catch (err) {
        console.error(err);
        alert("Something went wrong deleting the metric.");
      }
    }
  };

  const handleEditLog = () => {
    // For now, just show a message that edit functionality is coming
    alert("Log editing functionality will be implemented in a future update.");
  };

  const handleDeleteLog = async (logId: number) => {
    if (confirm("Are you sure you want to delete this log entry?")) {
      try {
        await deleteDailyLog(logId);
        alert("Log entry deleted successfully!");
        fetchLogs(setLogs);
      } catch (err) {
        console.error(err);
        alert("Something went wrong deleting the log entry.");
      }
    }
  };

  const handleEditSettings = () => {
    setIsEditingSettings(true);
    setSettingsSaveMessage(null);
  };

  const handleCancelSettings = () => {
    setIsEditingSettings(false);
    setSettingsSaveMessage(null);
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsSaveMessage(null);

    try {
      // Call the save function from SettingsEdit component
      if ((window as any).settingsSaveRef) {
        await (window as any).settingsSaveRef();
      }
      setIsEditingSettings(false);
      setSettingsSaveMessage({
        type: "success",
        text: "Settings saved successfully!",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSettingsSaveMessage({
        type: "error",
        text: "Failed to save settings. Please try again.",
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "metric":
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Metric</h2>
              <select
                value={metricMode}
                onChange={(e) => setMetricMode(e.target.value as ModeType)}
                className="form-select"
                style={{ width: "auto" }}
              >
                <option value="add">Add</option>
                <option value="edit">Edit</option>
                <option value="view">View</option>
              </select>
            </div>

            {metricMode === "add" && (
              <div>
                <h3>Add New Metric</h3>
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
                    {editingMetric ? "Update Metric" : "Save Metric"}
                  </button>
                  {editingMetric && (
                    <button
                      type="button"
                      className="btn btn-secondary ms-2"
                      onClick={() => {
                        setEditingMetric(null);
                        setFormData({
                          user_id: 1,
                          name: "",
                          description: "",
                          data_type: "text",
                          unit: "",
                          notes_on: false,
                        });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>
            )}

            {metricMode === "edit" && (
              <div>
                <h3>Edit Metric</h3>
                <div className="row">
                  {metrics.map((metric) => (
                    <div key={metric.id} className="col-md-6 col-lg-4 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">{metric.name}</h5>
                          <p className="card-text">{metric.description}</p>
                          <p className="card-text">
                            <small className="text-muted">
                              Type: {metric.data_type} | Unit:{" "}
                              {metric.unit || "N/A"}
                            </small>
                          </p>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditMetric(metric)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteMetric(metric.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {metricMode === "view" && (
              <div>
                <h3>View Metrics</h3>
                <div className="row">
                  {metrics.map((metric) => (
                    <div key={metric.id} className="col-md-6 col-lg-4 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">{metric.name}</h5>
                          <p className="card-text">{metric.description}</p>
                          <p className="card-text">
                            <small className="text-muted">
                              Type: {metric.data_type} | Unit:{" "}
                              {metric.unit || "N/A"}
                            </small>
                          </p>
                          {metric.data_type === "scale" && (
                            <p className="card-text">
                              <small className="text-muted">
                                Scale: {metric.scale_min} - {metric.scale_max}
                              </small>
                            </p>
                          )}
                          <p className="card-text">
                            <small className="text-muted">
                              Notes: {metric.notes_on ? "Enabled" : "Disabled"}
                            </small>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "log":
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Log</h2>
              <select
                value={logMode}
                onChange={(e) => setLogMode(e.target.value as ModeType)}
                className="form-select"
                style={{ width: "auto" }}
              >
                <option value="add">Add</option>
                <option value="edit">Edit</option>
                <option value="view">View</option>
              </select>
            </div>

            {logMode === "add" && (
              <div>
                <h3>Add Log</h3>
                <p>Add a new log entry for today.</p>
                <SpecificAdd />
              </div>
            )}

            {logMode === "edit" && (
              <div>
                <h3>Edit Log</h3>
                <div className="row">
                  {logs.map((log) => (
                    <div key={log.id} className="col-md-6 col-lg-4 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">{log.metric.name}</h5>
                          <p className="card-text">
                            Date: {new Date(log.log_date).toLocaleDateString()}
                          </p>
                          <p className="card-text">
                            Value:{" "}
                            {log.value_text ||
                              log.value_int ||
                              log.value_decimal ||
                              (log.value_boolean ? "Yes" : "No")}
                          </p>
                          {log.note && (
                            <p className="card-text">
                              <small className="text-muted">
                                Note: {log.note}
                              </small>
                            </p>
                          )}
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditLog()}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteLog(log.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {logMode === "view" && (
              <div>
                <h3>View Logs</h3>
                <LogViewer logs={logs} />
              </div>
            )}
          </div>
        );
      case "settings":
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Settings</h2>
              <div>
                {!isEditingSettings ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleEditSettings}
                  >
                    Edit Settings
                  </button>
                ) : (
                  <div className="btn-group">
                    <button
                      className="btn btn-success"
                      onClick={handleSaveSettings}
                      disabled={isSavingSettings}
                    >
                      {isSavingSettings ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancelSettings}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            <SettingsEdit
              isEditing={isEditingSettings}
              onSave={handleSaveSettings}
              saveMessage={settingsSaveMessage}
            />
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
            className={`nav-link ${activeTab === "metric" ? "active" : ""}`}
            onClick={() => setActiveTab("metric")}
            type="button"
          >
            Metric
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "log" ? "active" : ""}`}
            onClick={() => setActiveTab("log")}
            type="button"
          >
            Log
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
