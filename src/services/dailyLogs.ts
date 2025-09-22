import request from "./api";

import type { DailyLog } from "../types/dailyLogs.ts"


export async function saveDailyLog(log: Omit<DailyLog, "id" | "created_at">) {
    return request<DailyLog>("/daily_logs/", {
        method: "POST",
        body: JSON.stringify(log),
    });
}

export async function getDailyLogs(log_date?: string): Promise<DailyLog[]> {
  const url = log_date
    ? `/daily_logs?log_date=${log_date}`
    : `/daily_logs`;
  return request<DailyLog[]>(url);
}
