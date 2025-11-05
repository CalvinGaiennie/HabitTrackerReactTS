import { useEffect, useState } from "react";
import request from "../services/api";

export interface WeeklyData {
    weekly_total_minutes: number;
    week_start: string;
    week_end: string;
    days: { date: string; minutes: number }[];
}

export function useWeeklyClockTotal(metricId: number) {
    const [data, setData] = useState<WeeklyData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const result = await request<WeeklyData>(
                    `/daily_logs/clock-status-for-week/${metricId}`
                );
                setData(result);
            } catch (err) {
                console.error("Failed to fetch weekly total:", err);
                setData(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [metricId]);

    return { data, loading };
}