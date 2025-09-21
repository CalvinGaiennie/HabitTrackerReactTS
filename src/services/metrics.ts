import request from "./api";
import type { Metric, MetricCreate} from "../types/Metrics.ts"

export async function getActiveMetrics(): Promise<Metric[]> {
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