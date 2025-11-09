// src/types/metric.ts

// Full Metric type (from backend response)
export interface Metric {
  id: number;
  user_id: number;
  category?: string;
  subcategory?: string;
  name: string;
  description?: string;
  initials?: string; // optional; derived on frontend from name when missing
  parent_id?: number;
  is_required: boolean;
  data_type: "int" | "boolean" | "text" | "scale" | "decimal" | "clock";
  unit?: string;
  scale_min?: number;
  scale_max?: number;
  modifier_label?: string;
  modifier_value?: string;
  notes_on: boolean;
  active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface MetricCreate {
  user_id: number;
  name: string;
  description?: string;
  initials?: string; // optional input; compute from name if omitted
  data_type: "int" | "boolean" | "text" | "scale" | "decimal" | "clock";
  scale_min?: number;
  scale_max?: number;
  unit?: string;
  notes_on: boolean;
}
