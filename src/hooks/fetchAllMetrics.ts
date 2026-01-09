import { getAllMetrics } from "../services/metrics";
import type { Metric } from "../types/Metrics";

export default function fetchAllMetrics(setMetrics: (metrics: Metric[]) => void) {
  const fetchMetrics = async () => {
    try {
      const metrics = await getAllMetrics();
      setMetrics(metrics);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  };
  fetchMetrics();
}
