import request from "./api";
import type { DailyLog } from "../types/dailyLogs.ts";

export async function saveDailyLog(log: Omit<DailyLog, "id" | "created_at">) {
    return request<DailyLog>("/daily_logs/", {
        method: "POST",
        body: JSON.stringify(log),
    });
}

export async function getDailyLogs(user_id?: string, start_date?: string, end_date?: string, log_date?: string): Promise<DailyLog[]> {
    let url = "/daily_logs";
    const params = new URLSearchParams();
    if (start_date) params.append("start_date", start_date);
    if (end_date) params.append("end_date", end_date);
    if (log_date) params.append("log_date", log_date);
    if (user_id) params.append("user_id", user_id);
    if (params.toString()) url += `?${params.toString()}`;
    return request<DailyLog[]>(url);
}