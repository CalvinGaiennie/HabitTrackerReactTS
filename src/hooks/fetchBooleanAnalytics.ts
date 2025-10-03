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
  }) => void
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

      // Get all daily logs
      const dailyLogs = await getDailyLogs(user_id?.toString());
      console.log("Raw API data:", dailyLogs);
      console.log("Selected metric ID:", selectedMetricId);

      // Filter logs for the selected metric
      const metricLogs = dailyLogs.filter(
        (log) => log.metric_id === selectedMetricId
      );

      // Calculate days since metric creation
      const metricCreatedAt = new Date(selectedMetric.created_at);
      const today = new Date();
      const daysSinceCreation = Math.ceil(
        (today.getTime() - metricCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      console.log(`Metric created: ${metricCreatedAt.toDateString()}`);
      console.log(`Days since creation: ${daysSinceCreation}`);

      // Count "Yes" days (value_boolean = true)
      const yesDays = metricLogs.filter(
        (log) => log.value_boolean === true
      ).length;

      // Calculate "No" days (total days - yes days)
      const noDays = daysSinceCreation - yesDays;

      console.log(`Yes days: ${yesDays}`);
      console.log(`No days: ${noDays}`);

      // Calculate percentage
      const percentage =
        daysSinceCreation > 0
          ? Math.round((yesDays / daysSinceCreation) * 100)
          : 0;

      // Set statistics if callback provided
      if (setStats) {
        setStats({
          totalDays: daysSinceCreation,
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
