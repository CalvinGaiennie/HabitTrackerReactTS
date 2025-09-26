import request from "./api";
import type { DailyLog } from "../types/dailyLogs.ts";

export async function saveDailyLog(log: Omit<DailyLog, "id" | "created_at">) {
    return request<DailyLog>("/daily_logs/", {
        method: "POST",
        body: JSON.stringify(log),
    });
}

export async function getDailyLogs(log_date?: string, user_id?: string): Promise<DailyLog[]> {
    let url = "/daily_logs";
    const params = new URLSearchParams();
    if (log_date) params.append("log_date", log_date);
    if (user_id) params.append("user_id", user_id);
    if (params.toString()) url += `?${params.toString()}`;
    return request<DailyLog[]>(url);
}