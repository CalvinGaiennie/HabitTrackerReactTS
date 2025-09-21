import request from "./api";


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

export interface MetricCreate {
    name: string;
    description?: string;
    data_type: "int" | "boolean" | "text" | "scale" | "decimal";
    unit?: string;
}

export async function getMetrics(): Promise<Metric[]> {
    return request<Metric[]>("/metrics/");
}

export async function createMetric(data: MetricCreate): Promise<Metric> {
    return request<Metric>("/metrics/", {
        method: "POST",
        body: JSON.stringify(data),
    })
}

export async function deactivateMetric(id: number): Promise<{ message: string}> {
    return request<{ message: string}>(`/metrics/${id}`, {
        method: "DELETE",
    });
}