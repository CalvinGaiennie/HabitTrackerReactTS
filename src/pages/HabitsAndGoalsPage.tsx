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
import PasswordChangeForm from "../components/PasswordChangeForm.tsx";
import fetchLogs from "../hooks/fetchLogs.ts";
import fetchMetrics from "../hooks/fetchMetrics.ts";
import { useUserId } from "../hooks/useAuth";
import type { ModeType } from "../types/general";
import SubPage from "../components/SubPage.tsx";
import BootstrapModal from "../components/BootstrapModal.tsx";
import MetricForm from "../components/MetricForm.tsx";

type TabType = "goal" | "metric" | "log" | "settings" | "password";
function HabitsAndGoalsPage() {
  const userId = useUserId(); // Get current user ID
  const [activeTab, setActiveTab] = useState<TabType>("goal");
  const [goalMode, setGoalMode] = useState<ModeType>("view");
  const [logMode, setLogMode] = useState<ModeType>("view");
  const [formData, setFormData] = useState<MetricCreate>({
    user_id: userId,
    name: "",
    description: "",
    initials: "",
    data_type: "text",
    unit: "",
    notes_on: false,
    time_type: "day",
  });
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);
  const [showModal, setShowModal] = useState(false)
  const isSubmitting = useRef(false);

  // Fetch logs and metrics on component mount
  useEffect(() => {
    fetchLogs(setLogs, undefined, undefined, undefined, userId);
    fetchMetrics(setMetrics);
  }, [userId]);

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
        setEditingMetric(null);
      } else {
        await createMetric(formData);
      }
      setShowModal(false);
      fetchMetrics(setMetrics);
      setFormData({
        user_id: userId,
        name: "",
        description: "",
        initials: "",
        data_type: "text",
        unit: "",
        notes_on: false,
        time_type: "day",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong with the metric operation.");
    } finally {
      isSubmitting.current = false;
    }
  };

  const handleActiveTab = (tab: TabType) => {
    setActiveTab(tab)
  }

  const handleEditMetric = (metric: Metric) => {
    setEditingMetric(metric);
    setFormData({
      user_id: metric.user_id,
      name: metric.name,
      description: metric.description || "",
      initials: metric.initials || "",
      data_type: metric.data_type,
      unit: metric.unit || "",
      notes_on: metric.notes_on,
      scale_min: metric.scale_min,
      scale_max: metric.scale_max,
      time_type: metric.time_type,
    });
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "goal":
        return (
          <div>
            <SubPage title="Goals" mode={goalMode} setMode={setGoalMode} />
          </div>
        );
      case "metric":
        return (
          <div>
             <div className="container mt-4">
                <div className="d-flex gap-3 mb-3 justify-content-between">
                  <h3>Metrics</h3>
                  <button className="btn btn-primary" onClick={() => {setEditingMetric(null); setShowModal(true)}}>Add Metric</button>
                </div>
                <BootstrapModal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  title={editingMetric ? "Edit Metric" : "Add New Metric"}
                >
                  <MetricForm
                    formData={formData}
                    editingMetric={!!editingMetric}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancelEdit={() => {
                      setEditingMetric(null);
                      setFormData({
                        user_id: userId,
                        name: "",
                        description: "",
                        initials: "",
                        data_type: "text",
                        unit: "",
                        notes_on: false,
                        time_type: "day",
                      });
                      setShowModal(false)
                    }}
                  />
                </BootstrapModal>
                <div className="row">
                  {metrics.sort((a, b) => b.id - a.id).map((metric) => (
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
                              onClick={() => {
                                handleEditMetric(metric);
                                setShowModal(true)
                              }}
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
          </div>
        );
      case "log":
        return (
          <div>
            <SubPage title="Logs" mode={logMode} setMode={setLogMode} />
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
            <SettingsEdit settingsKeys={["homePageLayout"]} />
          </div>
        );
      case "password":
        return (
          <div>
            <PasswordChangeForm />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex gap-3 mb-3 justify-content-between">
        <h1>Habits and Goals</h1>
        <select
          name="activeTab"
          value={activeTab}
          className="form-select form-select-sm"
          style={{
            padding: "0.25rem 0.5rem",
            fontSize: "0.875rem",
            height: "38px",
            width: "auto",
            minWidth: "140px"
          }}
          onChange={(e) => handleActiveTab(e.target.value as TabType)}
        >
          <option value="goal">Goal</option>
          <option value="metric">Metric</option>
          <option value="log">Log</option>
          <option value="settings">Home Page</option>
        </select>
      </div>
      {/* Tab Content */}
      <div className="tab-content mb-5">{renderTabContent()}</div>
    </div>
  );
}

export default HabitsAndGoalsPage;
