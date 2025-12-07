import { useState, useEffect, useCallback } from "react";
import type { UserSettings, HomePageSection } from "../types/users";
import type { Metric } from "../types/Metrics";
import fetchSettings from "../hooks/fetchSettings.ts";
import { updateUserSettings } from "../services/users";
import { getActiveMetrics } from "../services/metrics";
import { useUserId } from "../hooks/useAuth";
import type { ChartDefinition } from "../types/chartConfig.ts";

interface SettingsEditProps {
  settingsKeys: (keyof UserSettings)[];
}

function SettingsEdit({ settingsKeys }: SettingsEditProps) {
  const userId = useUserId();
  const [settings, setSettings] = useState<UserSettings>();
  const [editableSettings, setEditableSettings] = useState<UserSettings>();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [newListItem, setNewListItem] = useState<{ [key: string]: string }>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // === FETCH SETTINGS ON MOUNT & AFTER SAVE ===
  const loadSettings = useCallback(() => {
    fetchSettings((fetchedSettings) => {
      const settingsWithDefaults: UserSettings = {
        ...fetchedSettings,
        workoutTypes: fetchedSettings.workoutTypes || [],
        homePageLayout: fetchedSettings.homePageLayout || [],
        enabledPages: fetchedSettings.enabledPages || [],
        homePageAnalytics: fetchedSettings.homePageAnalytics || [],
      };
      setSettings(settingsWithDefaults);
      setEditableSettings(settingsWithDefaults);
    }, userId);
  }, [userId]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // === FETCH METRICS ===
  useEffect(() => {
    if (settingsKeys.includes("homePageLayout")) {
      const fetchMetrics = async () => {
        try {
          const metricsData = await getActiveMetrics();
          setMetrics(metricsData);
        } catch (error) {
          console.error("Failed to fetch metrics:", error);
        }
      };
      fetchMetrics();
    }
  }, [settingsKeys]);

  // === SAVE WITH REFETCH ===
  const handleSave = useCallback(async () => {
    if (!editableSettings) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await updateUserSettings(userId, editableSettings);
      await loadSettings(); // Refetch fresh data

      setIsEditing(false);
      setSaveMessage({
        type: "success",
        text: "Settings saved and reloaded!",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveMessage({
        type: "error",
        text: "Failed to save settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [editableSettings, userId, loadSettings]);

  const handleEdit = () => {
    setIsEditing(true);
    setSaveMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveMessage(null);
    if (settings) {
      setEditableSettings({
        ...settings,
        workoutTypes: settings.workoutTypes || [],
        homePageLayout: settings.homePageLayout || [],
        enabledPages: settings.enabledPages || [],
        homePageAnalytics: settings.homePageAnalytics || [],
      });
    }
  };

  // === SECTION HANDLERS ===
  const updateSectionName = (sectionIndex: number, newName: string) => {
    if (!editableSettings?.homePageLayout) return;
    const updated = [...editableSettings.homePageLayout];
    updated[sectionIndex] = { ...updated[sectionIndex], section: newName };
    setEditableSettings({ ...editableSettings, homePageLayout: updated });
  };

  const updateSectionItemId = (sectionIndex: number, itemIndex: number, newValue: string) => {
    if (!editableSettings?.homePageLayout) return;
    const updated = [...editableSettings.homePageLayout];
    const ids = [...updated[sectionIndex].metricIds];
    ids[itemIndex] = parseInt(newValue) || 0;
    updated[sectionIndex] = { ...updated[sectionIndex], metricIds: ids };
    setEditableSettings({ ...editableSettings, homePageLayout: updated });
  };

  const addSectionItem = (sectionIndex: number) => {
    if (!editableSettings?.homePageLayout) return;
    const updated = [...editableSettings.homePageLayout];
    updated[sectionIndex] = {
      ...updated[sectionIndex],
      metricIds: [...updated[sectionIndex].metricIds, 0],
    };
    setEditableSettings({ ...editableSettings, homePageLayout: updated });
  };

  const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
    if (!editableSettings?.homePageLayout) return;
    const updated = [...editableSettings.homePageLayout];
    updated[sectionIndex] = {
      ...updated[sectionIndex],
      metricIds: updated[sectionIndex].metricIds.filter((_, i) => i !== itemIndex),
    };
    setEditableSettings({ ...editableSettings, homePageLayout: updated });
  };

  const addSection = () => {
    if (!editableSettings) return;
    const newSection: HomePageSection = { section: "New Section", metricIds: [0] };
    setEditableSettings({
      ...editableSettings,
      homePageLayout: [...(editableSettings.homePageLayout || []), newSection],
    });
  };

  const removeSection = (sectionIndex: number) => {
    if (!editableSettings?.homePageLayout) return;
    setEditableSettings({
      ...editableSettings,
      homePageLayout: editableSettings.homePageLayout.filter((_, i) => i !== sectionIndex),
    });
  };

  // === CHART HANDLERS ===
  const updateChartType = (chartIndex: number, newType: string) => {
    if (!editableSettings?.homePageAnalytics) return;
    const updated = [...editableSettings.homePageAnalytics];
    updated[chartIndex] = { ...updated[chartIndex], type: newType as ChartDefinition["type"] };
    setEditableSettings({ ...editableSettings, homePageAnalytics: updated });
  };

  const updateChartMetricId = (chartIndex: number, newMetricId: string) => {
    if (!editableSettings?.homePageAnalytics) return;
    const updated = [...editableSettings.homePageAnalytics];
    updated[chartIndex] = { ...updated[chartIndex], metricId: parseInt(newMetricId) || 0 };
    setEditableSettings({ ...editableSettings, homePageAnalytics: updated });
  };

  const removeChart = (chartIndex: number) => {
    if (!editableSettings?.homePageAnalytics) return;
    setEditableSettings({
      ...editableSettings,
      homePageAnalytics: editableSettings.homePageAnalytics.filter((_, i) => i !== chartIndex),
    });
  };

  const addChart = () => {
    if (!editableSettings) return;
    const newChart: ChartDefinition = { type: "line", metricId: 0 };
    setEditableSettings({
      ...editableSettings,
      homePageAnalytics: [...(editableSettings.homePageAnalytics || []), newChart],
    });
  };

  // === LIST ITEM HANDLERS ===
  const addListItem = (key: keyof UserSettings) => {
    if (!editableSettings || !newListItem[key]) return;
    const value = newListItem[key];
    if (key === "workoutTypes") {
      setEditableSettings({
        ...editableSettings,
        workoutTypes: [...(editableSettings.workoutTypes || []), value],
      });
    } else if (key === "enabledPages") {
      setEditableSettings({
        ...editableSettings,
        enabledPages: [...(editableSettings.enabledPages || []), value],
      });
    }
    setNewListItem((prev) => ({ ...prev, [key]: "" }));
  };

  const removeListItem = (key: keyof UserSettings, index: number) => {
    if (!editableSettings) return;
    if (key === "workoutTypes") {
      setEditableSettings({
        ...editableSettings,
        workoutTypes: (editableSettings.workoutTypes || []).filter((_, i) => i !== index),
      });
    } else if (key === "enabledPages") {
      setEditableSettings({
        ...editableSettings,
        enabledPages: (editableSettings.enabledPages || []).filter((_, i) => i !== index),
      });
    }
  };

  // === UTILS ===
  const getMetricName = (metricId: number): string => {
    const metric = metrics.find((m) => m.id === metricId);
    return metric ? metric.name : `Metric ${metricId}`;
  };

  // === RENDER: Section-based Settings (Layout + Charts) ===
  const renderSectionBasedSettings = () => (
    <div className="row">
      {/* Sections */}
      {editableSettings?.homePageLayout?.map((section, sectionIndex) => (
        <div key={sectionIndex} className="col-12 col-sm-6 col-md-6 col-lg-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                {isEditing ? (
                  <input
                    className="form-control"
                    value={section.section}
                    onChange={(e) => updateSectionName(sectionIndex, e.target.value)}
                    placeholder="Section name"
                  />
                ) : (
                  <h5 className="card-title mb-0">{section.section}</h5>
                )}
                {isEditing && (
                  <button
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => removeSection(sectionIndex)}
                    title="Remove section"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="d-flex flex-column">
                {section.metricIds.map((metricId, metricIndex) => (
                  <div key={metricIndex} className="d-flex mb-1">
                    {isEditing ? (
                      <>
                        <div className="flex-grow-1 me-2">
                          <select
                            name="activeTab"
                            value={metricId}
                            onChange={(e) =>
                              updateSectionItemId(sectionIndex, metricIndex, e.target.value)
                            }
                            className="form-select"
                          >
                            {metrics.map((metric) => (
                              <option key={metric.id} value={metric.id}>{metric.name}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeSectionItem(sectionIndex, metricIndex)}
                          title="Remove metric"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <span className="form-control">
                        {getMetricName(metricId)}
                      </span>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={() => addSectionItem(sectionIndex)}
                  >
                    + Add Metric
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Charts Section - Always visible */}
      <div className="col-12 mt-4">
        <h4>Analytics Charts</h4>

        {editableSettings?.homePageAnalytics && editableSettings.homePageAnalytics.length > 0 ? (
          editableSettings.homePageAnalytics.map((chart, chartIndex) => (
            <div
              key={chartIndex}
              className="card mb-3 p-3 d-flex flex-row align-items-center gap-2"
            >
              {/* Chart Type */}
              <div className="flex-grow-1">
                {isEditing ? (
                  <select
                    className="form-select"
                    value={chart.type}
                    onChange={(e) => updateChartType(chartIndex, e.target.value)}
                  >
                    <option value="" disabled>Select chart type</option>
                    <option value="line">Line Chart</option>
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="bubble">Bubble Chart</option>
                  </select>
                ) : (
                  <span className="form-control-plaintext text-capitalize">
                    {chart.type || "No type"} Chart
                  </span>
                )}
              </div>

              {/* Metric ID */}
              <div className="flex-grow-1">
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Metric ID"
                      value={chart.metricId}
                      onChange={(e) => updateChartMetricId(chartIndex, e.target.value)}
                    />
                    <small className="text-muted">{getMetricName(chart.metricId)}</small>
                  </>
                ) : (
                  <span className="form-control-plaintext">
                    {getMetricName(chart.metricId)}
                  </span>
                )}
              </div>

              {/* Remove Button */}
              {isEditing && (
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeChart(chartIndex)}
                  title="Remove chart"
                >
                  ×
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-muted">No charts configured</p>
        )}
      </div>

      {/* Add Buttons - Only in edit mode */}
      {isEditing && (
        <div className="col-12 mt-4 d-flex gap-2">
          <button className="btn btn-outline-success" onClick={addSection}>
            + Add New Section
          </button>
          <button className="btn btn-outline-success" onClick={addChart}>
            + Add New Chart
          </button>
        </div>
      )}
    </div>
  );

  // === RENDER: List-based Settings ===
  const renderListBasedSettings = (key: keyof UserSettings) => {
    const items =
      key === "workoutTypes"
        ? editableSettings?.workoutTypes || []
        : editableSettings?.enabledPages || [];

    return (
      <div className="mt-5">
        <h3>{key === "workoutTypes" ? "Workout Types" : "Enabled Pages"}</h3>
        <div className="card">
          <div className="card-body">
            {items.length > 0 ? (
              <div className="mb-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    {isEditing ? (
                      <>
                        <span className="form-control-plaintext">{item}</span>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeListItem(key, index)}
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <span className="form-control-plaintext">{item}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">
                No {key === "workoutTypes" ? "workout types" : "enabled pages"} defined
              </p>
            )}
            {isEditing && (
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Add new ${key === "workoutTypes" ? "workout type" : "page"}`}
                  value={newListItem[key] || ""}
                  onChange={(e) =>
                    setNewListItem((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  onKeyPress={(e) => e.key === "Enter" && addListItem(key)}
                />
                <button className="btn btn-primary" onClick={() => addListItem(key)}>
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // === MAIN RENDER ===
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Settings</h2>
        <div>
          {!isEditing ? (
            <button className="btn btn-primary" onClick={handleEdit}>
              Edit Settings
            </button>
          ) : (
            <div className="btn-group">
              <button
                className="btn btn-success"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {saveMessage && (
        <div
          className={`alert alert-${saveMessage.type === "success" ? "success" : "danger"} mb-3`}
        >
          {saveMessage.text}
        </div>
      )}

      <div className="card p-4">
        {settingsKeys.map((key) =>
          key === "homePageLayout" ? (
            <div key={key}>{renderSectionBasedSettings()}</div>
          ) : (
            <div key={key}>{renderListBasedSettings(key)}</div>
          )
        )}
      </div>
    </div>
  );
}

export default SettingsEdit;