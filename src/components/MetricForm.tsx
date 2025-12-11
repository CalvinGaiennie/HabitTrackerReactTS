// components/MetricForm.tsx
import type { MetricCreate } from "../types/Metrics";

interface MetricFormProps {
  formData: MetricCreate;
  editingMetric: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancelEdit?: () => void;
}

function MetricForm({
  formData,
  editingMetric,
  onChange,
  onSubmit,
  onCancelEdit,
}: MetricFormProps) {
  return (
    <div>
      <h3>{editingMetric ? "Edit Metric" : "Add New Metric"}</h3>
      <form onSubmit={onSubmit} className="w-100" style={{ maxWidth: "500px" }}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description:</label>
          <input
            name="description"
            value={formData.description}
            onChange={onChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Initials:</label>
          <input
            name="initials"
            value={formData.initials}
            onChange={onChange}
            className="form-control"
            maxLength={2}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type:</label>
          <select
            name="data_type"
            value={formData.data_type}
            onChange={onChange}
            className="form-select"
          >
            <option value="decimal">Number</option>
            <option value="boolean">True/False</option>
            <option value="text">Text</option>
            <option value="scale">Scale (ex. 1-5)</option>
            <option value="clock">Clock In/Out</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Time Type:</label>
          <select
            name="time_type"
            value={formData.time_type}
            onChange={onChange}
            className="form-select"
          >
            <option value="day">Day (Homepage resets it every midnight)</option>
            <option value="week">Week (Homepage resets it at midnight between sunday and monday.)</option>
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
                  onChange={onChange}
                  className="form-control"
                  placeholder="Min (e.g., 1)"
                  type="number"
                />
              </div>
              <div className="col-6">
                <input
                  name="scale_max"
                  value={formData.scale_max ?? ""}
                  onChange={onChange}
                  className="form-control"
                  placeholder="Max (e.g., 5)"
                  type="number"
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
            onChange={onChange}
            className="form-control"
            placeholder="e.g., minutes, hours, reps"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Do you want to include a notes section?</label>
          <select
            name="notes_on"
            value={String(formData.notes_on)}
            onChange={onChange}
            className="form-select"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          {editingMetric ? "Update Metric" : "Save Metric"}
        </button>

        {editingMetric && onCancelEdit && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
export default MetricForm