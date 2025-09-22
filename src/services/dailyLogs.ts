import request from "./api";

import type { DailyLog } from "../types/dailyLogs.ts"


export async function saveDailyLog(log: Omit<DailyLog, "id" | "created_at">) {
    return request<DailyLog>("/daily_logs", {
        method: "POST",
        body: JSON.stringify(log),
    });
}

export async function getDailyLogs(log_date: string ): Promise<DailyLog[]> {
    const res = await fetch(`/api/daily_logs?log_date=${log_date}`);
    if (!res.ok) throw new Error("Failed to fetch logs");
    return (await res.json()) as DailyLog[];
}