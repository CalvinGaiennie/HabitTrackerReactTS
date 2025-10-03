export interface MetricMini {
  id: number;
  name: string;
}

export interface ClockEvent {
  type: "clock_in" | "clock_out";
  timestamp: string;
}

export interface ClockSession {
  clock_in: string;
  clock_out: string;
  duration_minutes: number;
}

export interface ClockData {
  current_state: "clocked_in" | "clocked_out";
  sessions: ClockSession[];
  total_duration_minutes: number;
  last_updated: string;
}

export interface DailyLog {
  id: number;
  user_id: number;
  metric_id: number;
  log_date: string;
  value_int: number;
  value_boolean: boolean;
  value_text: string;
  value_decimal: string;
  note: string;
  created_at: string;
  metric: MetricMini;
}
