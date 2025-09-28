import { getDailyLogs } from "../services/dailyLogs";
import type { DataItem } from "../types/chartData";

export default function fetchChartData(
  setData: (data: DataItem[]) => void,
  user_id?: number,
  selectedData?: number
) {
  const fetchChartData = async () => {
    try {
      const data = await getDailyLogs(undefined, user_id?.toString());
      console.log("Raw API data:", data);
      console.log("Selected metric ID:", selectedData);

      // Filter by selected metric
      const filteredData = data
        .map((log) => ({
          name: new Date(log.created_at).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
          }),
          value: log.value_int
            ? log.value_int
            : log.value_boolean
            ? log.value_boolean
              ? 1
              : 0
            : log.value_text
            ? log.value_text
            : log.value_decimal
            ? parseFloat(log.value_decimal)
            : 0,
          metricId: log.metric_id,
          createdAt: log.created_at,
        }))
        .filter((item) => item.metricId === selectedData);

      // Group by value and count occurrences
      const valueCounts = filteredData.reduce((acc, item) => {
        const key = item.value.toString();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dataItems: DataItem[] = Object.entries(valueCounts).map(
        ([value, count]) => ({
          name: value === "1" ? "Yes" : "No",
          value: count,
        })
      );

      console.log("Filtered data items:", dataItems);
      setData(dataItems);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
      setData([]);
    }
  };
  fetchChartData();
}
