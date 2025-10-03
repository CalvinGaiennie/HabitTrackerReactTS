import { getDailyLogs } from "../services/dailyLogs";
import type { DataItem } from "../types/chartData";

export default function fetchChartData(
  setData: (data: DataItem[]) => void,
  user_id?: number,
  selectedData?: number,
  startDate?: Date,
  endDate?: Date
) {
  const fetchChartData = async () => {
    try {
      // Format dates for API using local timezone
      const startDateStr = startDate
        ? `${startDate.getFullYear()}-${String(
            startDate.getMonth() + 1
          ).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`
        : undefined;

      // Add one day to end date to make it inclusive
      const endDatePlusOne = endDate ? new Date(endDate) : undefined;
      if (endDatePlusOne) {
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      }

      const endDateStr = endDatePlusOne
        ? `${endDatePlusOne.getFullYear()}-${String(
            endDatePlusOne.getMonth() + 1
          ).padStart(2, "0")}-${String(endDatePlusOne.getDate()).padStart(
            2,
            "0"
          )}`
        : undefined;

      const data = await getDailyLogs(
        user_id?.toString(),
        startDateStr,
        endDateStr
      );
      console.log("Raw API data:", data);
      console.log("Selected metric ID:", selectedData);

      // Filter by selected metric
      const filteredData = data
        .map((log) => ({
          name: new Date(log.log_date).toLocaleDateString("en-US", {
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
          createdAt: log.log_date,
        }))
        .filter((item) => item.metricId === selectedData);

      // Check if this is boolean data (only 0s and 1s)
      const uniqueValues = [...new Set(filteredData.map((item) => item.value))];
      const isBooleanData = uniqueValues.every((val) => val === 0 || val === 1);

      let dataItems: DataItem[];

      if (isBooleanData) {
        // For boolean data, aggregate into counts
        const valueCounts = filteredData.reduce((acc, item) => {
          const key = item.value.toString();
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        dataItems = Object.entries(valueCounts).map(([value, count]) => ({
          name: value === "1" ? "Yes" : "No",
          value: count as number | string as number,
          createdAt: new Date().toISOString(),
          metricId: 0,
        }));
      } else {
        // For non-boolean data, keep individual data points and sort by date
        dataItems = filteredData
          .map((item) => ({
            name: item.name,
            value: item.value as number | string as number,
            createdAt:
              typeof item.createdAt === "string"
                ? item.createdAt
                : (item.createdAt as Date).toISOString(),
            metricId: item.metricId,
          }))
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
      }

      console.log("Filtered data items:", dataItems);
      setData(dataItems);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
      setData([]);
    }
  };
  fetchChartData();
}
