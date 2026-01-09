import request from "./api";
import type { Metric, MetricCreate } from "../types/Metrics.ts";

export async function getActiveMetrics(): Promise<Metric[]> {
  return request<Metric[]>("/metrics/");
}

export async function getAllMetrics(): Promise<Metric[]> {
  return request<Metric[]>("/metrics/all");
}

export async function createMetric(data: MetricCreate): Promise<Metric> {
  return request<Metric>("/metrics/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMetricActive(
  metricId: number,
  active: boolean
): Promise<Metric> {
  return request<Metric>(`/metrics/${metricId}/activate?active=${active}`, {
    method: "PATCH",
  });
}

export async function updateMetric(
  metricId: number,
  data: Partial<MetricCreate>
): Promise<Metric> {
  return request<Metric>(`/metrics/${metricId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMetric(metricId: number): Promise<void> {
  return request<void>(`/metrics/${metricId}`, {
    method: "DELETE",
  });
}
