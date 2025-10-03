import { useState, useRef, useEffect } from "react";
import type { MetricCreate } from "../types/Metrics.ts";
import type { DailyLog } from "../types/dailyLogs.ts";
import { createMetric } from "../services/metrics.ts";
import SpecificAdd from "../components/SpecificAdd.tsx";
import LogViewer from "../components/LogViewer.tsx";
import SettingsEdit from "../components/SettingsEdit.tsx";
import fetchLogs from "../hooks/fetchLogs.ts";

function AccountPage() {
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

  return (
    <div className="container d-flex flex-column align-items-center">
      <h1>Account</h1>
      <h2>Add Metric</h2>
      <form
        onSubmit={handleSubmit}
        className="w-100"
        style={{ maxWidth: "500px" }}
      >
        <div>
          <label>Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label>Type:</label>
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
          <div>
            <label>Scale</label>
            <input
              name="scale_min"
              value={formData.scale_min ?? ""}
              onChange={handleChange}
              className="form-control"
            />
            <input
              name="scale_max"
              value={formData.scale_max ?? ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        )}
        <div>
          <label>Unit</label>
          <input
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label>Do you want to include a notes section?</label>
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
        <button type="submit">Save Metric</button>
      </form>
      {/* have a list here that allows you to delete and or update Metrics*/}
      <SpecificAdd />
      <LogViewer logs={logs} />
      <SettingsEdit />
    </div>
  );
}

export default AccountPage;
