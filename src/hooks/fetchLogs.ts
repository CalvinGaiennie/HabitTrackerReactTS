import { getDailyLogs } from "../services/dailyLogs.ts";
import type { DailyLog } from "../types/dailyLogs.ts";

export default function fetchLogs(
  setLogs: (logs: DailyLog[]) => void, startDate?: string, endDate?: string, logDate?: string,
  user_id?: number
) {
  const fetchLogs = async () => {
    try {
      const data = await getDailyLogs(user_id?.toString(), startDate, endDate, logDate);
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch daily logs:", err);
    }
  };
  fetchLogs();
}
