import { getDailyLogs } from "../services/dailyLogs";
import { getActiveMetrics } from "../services/metrics";
import type { DataItem } from "../types/chartData";

export default function fetchBooleanAnalytics(
  setData: (data: DataItem[]) => void,
  user_id?: number,
  selectedMetricId?: number,
  setStats?: (stats: {
    totalDays: number;
    yesDays: number;
    noDays: number;
    percentage: number;
  }) => void,
  startDate?: Date,
  endDate?: Date
) {
  const fetchBooleanAnalytics = async () => {
    try {
      // Get all metrics to find the selected metric's creation date
      const metrics = await getActiveMetrics();
      const selectedMetric = metrics.find(
        (metric) => metric.id === selectedMetricId
      );

      if (!selectedMetric) {
        console.log("Selected metric not found");
        setData([]);
        return;
      }

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

      // Get daily logs with date filtering
      const dailyLogs = await getDailyLogs(
        user_id?.toString(),
        startDateStr,
        endDateStr
      );
      console.log("Raw API data:", dailyLogs);
      console.log("Selected metric ID:", selectedMetricId);

      // Filter logs for the selected metric
      const metricLogs = dailyLogs.filter(
        (log) => log.metric_id === selectedMetricId
      );

      // Calculate total days in the date range
      const start = startDate || new Date();
      const end = endDate || new Date();
      const totalDays =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1; // +1 to include both start and end dates

      console.log(
        `Date range: ${start.toDateString()} to ${end.toDateString()}`
      );
      console.log(`Total days in range: ${totalDays}`);

      // Count "Yes" days (value_boolean = true)
      const yesDays = metricLogs.filter(
        (log) => log.value_boolean === true
      ).length;

      // Calculate "No" days (total days - yes days)
      const noDays = totalDays - yesDays;

      console.log(`Yes days: ${yesDays}`);
      console.log(`No days: ${noDays}`);

      // Calculate percentage
      const percentage =
        totalDays > 0 ? Math.round((yesDays / totalDays) * 100) : 0;

      // Set statistics if callback provided
      if (setStats) {
        setStats({
          totalDays: totalDays,
          yesDays: yesDays,
          noDays: noDays,
          percentage: percentage,
        });
      }

      // Create data items for the chart
      const dataItems: DataItem[] = [
        {
          name: "Yes",
          value: yesDays,
          createdAt: "",
          metricId: selectedMetricId || 0,
        },
        {
          name: "No",
          value: noDays,
          createdAt: "",
          metricId: selectedMetricId || 0,
        },
      ];

      console.log("Boolean analytics data items:", dataItems);
      setData(dataItems);
    } catch (error) {
      console.error("Failed to fetch boolean analytics:", error);
      setData([]);
    }
  };

  fetchBooleanAnalytics();
}
