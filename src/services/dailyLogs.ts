import request from "./api";

export interface DailyLog {
    id: number;
    user_id: number;
    metric_id: number;
    log_date: Date;
    value_int: number;
    value_boolean: boolean;
    value_text: string;
    value_decimal: string;
    note: string;
    created_at: string;   
}

export async function saveDailyLog(log: Omit<DailyLog, "id" | "created_at">) {
    return request<DailyLog>("/daily_logs", {
        method: "POST",
        body: JSON.stringify(log),
    });
}

export async function getDailyLogs(log_date: string ) {
    return request(`/daily_logs?log_date=${encodeURIComponent(log_date)}`);
}