export interface MetricMini {
    id: number;
    name: string;
}

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
    metric: MetricMini;
}