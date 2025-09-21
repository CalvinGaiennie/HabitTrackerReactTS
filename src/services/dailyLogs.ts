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

export async function GetDailyLogs(): Promise<DailyLog[]> {
    return request<DailyLog[]>("/daily_logs");
}

export async function createDailyLog(data: DailyLog): Promise<DailyLog> 
{
    return request<DailyLog>("/daily_logs", {
        method: "POST",
        body: JSON.stringify(data)
    }) 
}

export async function deactivateDailyLog(id: number): Promise<{ message: string}> {
    return request<{ message: string}>(`/daily_logs/${id}`, {
        method: "DELETE",
    });
}