import { getDailyLogs } from "../services/dailyLogs.ts";
import type { DailyLog } from "../types/dailyLogs.ts";

export default function fetchLogs(
  setLogs: (logs: DailyLog[]) => void,
  user_id?: number
) {
  const fetchLogs = async () => {
    try {
      const data = await getDailyLogs(undefined, user_id?.toString());
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch daily logs:", err);
    }
  };
  fetchLogs();
}
