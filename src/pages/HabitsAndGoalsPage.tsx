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
  const [activeTab, setActiveTab] = useState<TabType>("metric");
  const [goalMode, setGoalMode] = useState<ModeType>("view");
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
  const [showMetricModal, setShowMetricModal] = useState(false)
  const [showLogModal, setShowLogModal] = useState(false)
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
      setShowMetricModal(false);
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
                  <button className="btn btn-primary" onClick={() => {setEditingMetric(null); setShowMetricModal(true)}}>Add Metric</button>
                </div>
                <BootstrapModal
                  show={showMetricModal}
                  onHide={() => setShowMetricModal(false)}
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
                      setShowMetricModal(false)
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
                                setShowMetricModal(true)
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
              <div>
                <div className="d-flex gap-3 mb-3 justify-content-between">
                  <h3>Logs</h3>
                  <button className="btn btn-primary" onClick={() => {setShowLogModal(true)}}>Add Log</button>
                </div>
                <BootstrapModal
                  show={showLogModal}
                  onHide={() => setShowLogModal(false)}
                  title="Add New Log"
                >
                  <SpecificAdd/>
                </BootstrapModal>
                <div className="row">
                  {/* Group logs by date - newest first */}
                  {Object.entries(
                    logs.reduce((groups, log) => {
                      const date = new Date(log.log_date).toDateString();
                      if (!groups[date]) groups[date] = [];
                      groups[date].push(log);
                      return groups;
                    }, {} as Record<string, DailyLog[]>)
                  )
                    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                    .map(([date, dayLogs]) => (
                      <div key={date} className="mb-5">
                        <h5 className="fw-bold border-bottom pb-2 mb-3">
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'long', month: 'long', day: 'numeric' 
                          })}
                        </h5>
                        <div className="row">
                          {dayLogs.map((log) => (
                            <div key={log.id} className="col-md-6 col-lg-4 mb-3">
                              <div className="card">
                                <div className="card-body">
                                  <h5 className="card-title">{log.metric.name}</h5>
                                  <p className="card-text">
                                    Date: {new Date(log.log_date).toLocaleDateString()}
                                  </p>
                                  <p className="card-text">
                                    Value: {log.value_text || log.value_int || log.value_decimal || (log.value_boolean ? "Yes" : "No")}
                                  </p>
                                  {log.note && (
                                    <p className="card-text">
                                      <small className="text-muted">Note: {log.note}</small>
                                    </p>
                                  )}
                                  <div className="btn-group" role="group">
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditLog()}>
                                      Edit
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteLog(log.id)}>
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
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
      <div className="row justify-content-center mb-4">
    <div className="col-12">
      <h1 className="text-center mb-4">Habits and Goals</h1>

      <ul className="nav nav-tabs justify-content-center">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "metric" ? "active" : ""}`}
            onClick={() => setActiveTab("metric")}
          >
            Metrics
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "log" ? "active" : ""}`}
            onClick={() => setActiveTab("log")}
          >
            Logs
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "goal" ? "active" : ""}`}
            onClick={() => setActiveTab("goal")}
          >
            Goals
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </li>
      </ul>
    </div>
  </div>
      {/* Tab Content */}
      <div className="tab-content mb-5">{renderTabContent()}</div>
    </div>
  );
}

export default HabitsAndGoalsPage;
