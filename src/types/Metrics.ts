// src/types/metric.ts

// Full Metric type (from backend response)
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

// Create Metric payload (for POST requests)
export type MetricCreate = Omit<
  Metric,
  "id" | "created_at" | "updated_at"
>;
