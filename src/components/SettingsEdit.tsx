import { useState, useEffect } from "react";
import type { UserSettings, HomePageSection } from "../types/users";
import type { Metric } from "../types/Metrics";
import fetchSettings from "../hooks/fetchSettings.ts";
import { updateUserSettings } from "../services/users";
import { getActiveMetrics } from "../services/metrics";

function SettingsEdit() {
  const [settings, setSettings] = useState<UserSettings>();
  const [editableSettings, setEditableSettings] = useState<UserSettings>();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [newWorkoutType, setNewWorkoutType] = useState("");

  useEffect(() => {
    fetchSettings((fetchedSettings) => {
      setSettings(fetchedSettings);
      // Ensure workoutTypes exists as an empty array if not present
      const settingsWithDefaults = {
        ...fetchedSettings,
        workoutTypes: fetchedSettings.workoutTypes || [],
      };
      setEditableSettings(settingsWithDefaults);
    });
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metricsData = await getActiveMetrics();
        setMetrics(metricsData);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      }
    };
    fetchMetrics();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setSaveMessage(null);
  };

  const handleCancel = () => {
    // Ensure workoutTypes exists when canceling
    const settingsWithDefaults = {
      ...settings,
      enabledPages: settings?.enabledPages || [],
      homePageLayout: settings?.homePageLayout || [],
      workoutTypes: settings?.workoutTypes || [],
    };
    setEditableSettings(settingsWithDefaults);
    setIsEditing(false);
    setSaveMessage(null);
  };

  const handleSave = async () => {
    if (!editableSettings) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await updateUserSettings(1, editableSettings);
      setSettings(editableSettings);
      setIsEditing(false);
      setSaveMessage({ type: "success", text: "Settings saved successfully!" });
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveMessage({
        type: "error",
        text: "Failed to save settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSectionName = (sectionIndex: number, newName: string) => {
    if (!editableSettings) return;

    const updatedLayout = [...editableSettings.homePageLayout];
    updatedLayout[sectionIndex] = {
      ...updatedLayout[sectionIndex],
      section: newName,
    };
    setEditableSettings({
      ...editableSettings,
      homePageLayout: updatedLayout,
    });
  };

  const updateMetricId = (
    sectionIndex: number,
    metricIndex: number,
    newValue: string
  ) => {
    if (!editableSettings) return;

    const updatedLayout = [...editableSettings.homePageLayout];
    const updatedMetricIds = [...updatedLayout[sectionIndex].metricIds];
    updatedMetricIds[metricIndex] = parseInt(newValue) || 0;
    updatedLayout[sectionIndex] = {
      ...updatedLayout[sectionIndex],
      metricIds: updatedMetricIds,
    };
    setEditableSettings({
      ...editableSettings,
      homePageLayout: updatedLayout,
    });
  };

  const addMetric = (sectionIndex: number) => {
    if (!editableSettings) return;

    const updatedLayout = [...editableSettings.homePageLayout];
    updatedLayout[sectionIndex] = {
      ...updatedLayout[sectionIndex],
      metricIds: [...updatedLayout[sectionIndex].metricIds, 0],
    };
    setEditableSettings({
      ...editableSettings,
      homePageLayout: updatedLayout,
    });
  };

  const removeMetric = (sectionIndex: number, metricIndex: number) => {
    if (!editableSettings) return;

    const updatedLayout = [...editableSettings.homePageLayout];
    const updatedMetricIds = updatedLayout[sectionIndex].metricIds.filter(
      (_, index) => index !== metricIndex
    );
    updatedLayout[sectionIndex] = {
      ...updatedLayout[sectionIndex],
      metricIds: updatedMetricIds,
    };
    setEditableSettings({
      ...editableSettings,
      homePageLayout: updatedLayout,
    });
  };

  const addSection = () => {
    if (!editableSettings) return;

    const newSection: HomePageSection = {
      section: "New Section",
      metricIds: [0],
    };
    setEditableSettings({
      ...editableSettings,
      homePageLayout: [...editableSettings.homePageLayout, newSection],
    });
  };

  const removeSection = (sectionIndex: number) => {
    if (!editableSettings) return;

    const updatedLayout = editableSettings.homePageLayout.filter(
      (_, index) => index !== sectionIndex
    );
    setEditableSettings({
      ...editableSettings,
      homePageLayout: updatedLayout,
    });
  };

  const getMetricName = (metricId: number): string => {
    const metric = metrics.find((m) => m.id === metricId);
    return metric ? metric.name : `Metric ${metricId}`;
  };

  const addWorkoutType = () => {
    if (!newWorkoutType.trim()) return;

    setEditableSettings((prev) => ({
      ...prev!,
      workoutTypes: [...(prev?.workoutTypes || []), newWorkoutType.trim()],
    }));
    setNewWorkoutType("");
  };

  const removeWorkoutType = (index: number) => {
    setEditableSettings((prev) => ({
      ...prev!,
      workoutTypes: prev?.workoutTypes?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <div className="card p-4 m-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Settings</h1>
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
          className={`alert alert-${
            saveMessage.type === "success" ? "success" : "danger"
          } mb-3`}
        >
          {saveMessage.text}
        </div>
      )}

      <div className="row">
        {editableSettings?.homePageLayout?.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="col-12 col-sm-6 col-md-6 col-lg-6 mb-3"
          >
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {isEditing ? (
                    <input
                      className="form-control"
                      value={section.section}
                      onChange={(e) =>
                        updateSectionName(sectionIndex, e.target.value)
                      }
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
                            <input
                              className="form-control"
                              type="number"
                              value={metricId}
                              onChange={(e) =>
                                updateMetricId(
                                  sectionIndex,
                                  metricIndex,
                                  e.target.value
                                )
                              }
                              placeholder="Metric ID"
                            />
                            <small className="text-muted">
                              {getMetricName(metricId)}
                            </small>
                          </div>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() =>
                              removeMetric(sectionIndex, metricIndex)
                            }
                            title="Remove metric"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <span className="form-control-plaintext">
                          {metricId} - {getMetricName(metricId)}
                        </span>
                      )}
                    </div>
                  ))}

                  {isEditing && (
                    <button
                      className="btn btn-outline-primary btn-sm mt-2"
                      onClick={() => addMetric(sectionIndex)}
                    >
                      + Add Metric
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="mt-3">
          <button className="btn btn-outline-success" onClick={addSection}>
            + Add New Section
          </button>
        </div>
      )}

      {/* Workout Types Section */}
      <div className="mt-5">
        <h3>Workout Types</h3>
        <div className="card">
          <div className="card-body">
            {editableSettings?.workoutTypes &&
            editableSettings.workoutTypes.length > 0 ? (
              <div className="mb-3">
                {editableSettings.workoutTypes.map((type, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    {isEditing ? (
                      <>
                        <span className="form-control-plaintext">{type}</span>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeWorkoutType(index)}
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <span className="form-control-plaintext">{type}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No workout types defined</p>
            )}

            {isEditing && (
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add new workout type"
                  value={newWorkoutType}
                  onChange={(e) => setNewWorkoutType(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addWorkoutType()}
                />
                <button className="btn btn-primary" onClick={addWorkoutType}>
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsEdit;
