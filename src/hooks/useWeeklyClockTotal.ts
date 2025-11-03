import { useEffect, useState } from "react";

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
        fetch(`/daily_logs/clock-status-for-week/${metricId}`)
        .then(r => r.json())
        .then(setData)
        .catch( err => {
            console.error("Failed to fetch weekly total:", err);
            setData(null);
        })
        .finally(() => setLoading(false));
    }, [metricId]);

    return { data, loading };
}