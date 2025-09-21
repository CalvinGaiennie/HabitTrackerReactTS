import { useState } from "react";
import type { MetricCreate } from "../types/Metrics.ts";
import { createMetric } from "../services/metrics.ts";


function AccountPage() {
 const [formData, setFormData] = useState({
    name: "",
    description: "",
    data_type: "text",
    scale_min: 1,
    scale_max: 5,
    unit: "",
    notes_on: false,
 })

 const form: MetricCreate = {
    user_id: 1,
    name: "",
    description: "",
    data_type: "text",
    scale_min: 1,
    scale_max: 5,
    unit: "",
    notes_on: false,
  };

  const handleChange =(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  }

  return (
    <div className="container d-flex flex-column align-items-center">
      <h1>Account</h1>
      <h2>Add Metric</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
          />
        </div>
        <div>
          <label>Description:</label>
          <input name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-control"
          />
        </div>
        <div>
          <label>Type:</label>
          <select>
            <option value="int">Number</option>
            <option value="boolean">True/False</option>
            <option value="text">Text</option>
            <option value="scale">Scale (ex. 1-5)</option>
          </select>
        </div>
        { formData.data_type === "scale" && (
          <div>
            <label>Scale</label>
            <input name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
            />
            <input name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        )
      }
        <div>
          <label>Unit</label>
          <input name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="form-control"
          />
        </div>
        <div>
          <label>Do you want to include a notes section?</label>
          <select>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button type="submit">Save Metric</button>
      </form>
    </div>
  )

}

export default AccountPage

export interface Metric {
  id: number;
  user_id: number;
  category?: string;
  subcategory?: string;
  name: string;
  description?: string;
  parent_id?: number;
  is_required: boolean;
  data_type: "int" | "boolean" | "text" | "scale" | "decimal";
  unit?: string;
  scale_min?: number;
  scale_max?: number;
  modifier_label?: string;
  modifier_value?: string;
  notes_on: boolean;
  active: boolean;
  created_at: string;   // ISO date string
  updated_at: string;   // ISO date string
}