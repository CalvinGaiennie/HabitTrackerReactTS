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

  useEffect(() => {
    fetchSettings((fetchedSettings) => {
      setSettings(fetchedSettings);
      setEditableSettings(fetchedSettings);
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
    setEditableSettings(settings);
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
    </div>
  );
}

export default SettingsEdit;
