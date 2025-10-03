import request from "./api";
import type { ClockData } from "../types/dailyLogs";

export async function clockIn(metricId: number): Promise<ClockData> {
  return request<ClockData>(`/daily_logs/clock-in?metric_id=${metricId}`, {
    method: "POST",
  });
}

export async function clockOut(metricId: number): Promise<ClockData> {
  return request<ClockData>(`/daily_logs/clock-out?metric_id=${metricId}`, {
    method: "POST",
  });
}

export async function getClockStatus(
  metricId: number,
  date?: string
): Promise<ClockData | null> {
  const dateParam = date ? `?date=${date}` : "";
  return request<ClockData | null>(
    `/daily_logs/clock-status/${metricId}${dateParam}`
  );
}
