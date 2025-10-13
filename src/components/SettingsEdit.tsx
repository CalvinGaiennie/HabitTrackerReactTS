import { useState, useEffect, useCallback } from "react";
import type { UserSettings, HomePageSection } from "../types/users";
import type { Metric } from "../types/Metrics";
import fetchSettings from "../hooks/fetchSettings.ts";
import { updateUserSettings } from "../services/users";
import { getActiveMetrics } from "../services/metrics";

interface SettingsEditProps {
  settingsKeys: (keyof UserSettings)[]; // Array of settings keys to edit
}

function SettingsEdit({ settingsKeys }: SettingsEditProps) {
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

  useEffect(() => {
    fetchSettings((fetchedSettings) => {
      setSettings(fetchedSettings);
      const settingsWithDefaults: UserSettings = {
        ...fetchedSettings,
        workoutTypes: fetchedSettings.workoutTypes || [],
        homePageLayout: fetchedSettings.homePageLayout || [],
        enabledPages: fetchedSettings.enabledPages || [],
      };
      setEditableSettings(settingsWithDefaults);
    });
  }, []);

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

  const handleSave = useCallback(async () => {
    if (!editableSettings) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await updateUserSettings(1, editableSettings);
      setSettings(editableSettings);
      setIsEditing(false);
      setSaveMessage({
        type: "success",
        text: "Settings saved successfully!",
      });
      setTimeout(() => setSaveMessage(null), 3000); // Clear message after 3s
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveMessage({
        type: "error",
        text: "Failed to save settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [editableSettings]);

  const handleEdit = () => {
    setIsEditing(true);
    setSaveMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveMessage(null);
    // Reset editableSettings to original settings
    if (settings) {
      setEditableSettings({
        ...settings,
        workoutTypes: settings.workoutTypes || [],
        homePageLayout: settings.homePageLayout || [],
        enabledPages: settings.enabledPages || [],
      });
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

  const updateSectionItemId = (
    sectionIndex: number,
    itemIndex: number,
    newValue: string
  ) => {
    if (!editableSettings) return;

    const updatedLayout = [...editableSettings.homePageLayout];
    const updatedItemIds = [...updatedLayout[sectionIndex].metricIds];
    updatedItemIds[itemIndex] = parseInt(newValue) || 0;
    updatedLayout[sectionIndex] = {
      ...updatedLayout[sectionIndex],
      metricIds: updatedItemIds,
    };
    setEditableSettings({
      ...editableSettings,
      homePageLayout: updatedLayout,
    });
  };

  const addSectionItem = (sectionIndex: number) => {
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

  const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
    if (!editableSettings) return;

    const updatedLayout = [...editableSettings.homePageLayout];
    const updatedItemIds = updatedLayout[sectionIndex].metricIds.filter(
      (_, index) => index !== itemIndex
    );
    updatedLayout[sectionIndex] = {
      ...updatedLayout[sectionIndex],
      metricIds: updatedItemIds,
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

  const addListItem = (key: keyof UserSettings) => {
    if (!editableSettings || !newListItem[key]) return;

    if (key === "workoutTypes") {
      setEditableSettings({
        ...editableSettings,
        workoutTypes: [...(editableSettings.workoutTypes || []), newListItem[key]],
      });
    } else if (key === "enabledPages") {
      setEditableSettings({
        ...editableSettings,
        enabledPages: [...(editableSettings.enabledPages || []), newListItem[key]],
      });
    }
    setNewListItem((prev) => ({ ...prev, [key]: "" }));
  };

  const removeListItem = (key: keyof UserSettings, index: number) => {
    if (!editableSettings) return;

    if (key === "workoutTypes") {
      const updatedItems = (editableSettings.workoutTypes || []).filter(
        (_, i) => i !== index
      );
      setEditableSettings({
        ...editableSettings,
        workoutTypes: updatedItems,
      });
    } else if (key === "enabledPages") {
      const updatedItems = (editableSettings.enabledPages || []).filter(
        (_, i) => i !== index
      );
      setEditableSettings({
        ...editableSettings,
        enabledPages: updatedItems,
      });
    }
  };

  const getMetricName = (metricId: number): string => {
    const metric = metrics.find((m) => m.id === metricId);
    return metric ? metric.name : `Metric ${metricId}`;
  };

  const renderSectionBasedSettings = () => (
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
                              updateSectionItemId(
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
                            removeSectionItem(sectionIndex, metricIndex)
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
      {isEditing && (
        <div className="mt-3">
          <button className="btn btn-outline-success" onClick={addSection}>
            + Add New Section
          </button>
        </div>
      )}
    </div>
  );

  const renderListBasedSettings = (key: keyof UserSettings) => {
    const items = key === "workoutTypes"
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
              <p className="text-muted">No {key === "workoutTypes" ? "workout types" : "enabled pages"} defined</p>
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