import { getActiveMetrics } from "../services/metrics";
import type { Metric } from "../types/Metrics";

export default function fetchMetrics(setMetrics: (metrics: Metric[]) => void) {
  const fetchMetrics = async () => {
    try {
      const metrics = await getActiveMetrics();
      setMetrics(metrics);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  };
  fetchMetrics();
}
