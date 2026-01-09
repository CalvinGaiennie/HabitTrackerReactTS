import { useEffect, useState, useMemo } from "react";
import type { Metric } from "../types/Metrics";
import fetchMetrics from "../hooks/fetchMetrics";
import type { DataItem } from "../types/chartData";
import fetchChartData from "../hooks/fetchChartData.ts";
import fetchBooleanAnalytics from "../hooks/fetchBooleanAnalytics.ts";
import Calendar from "../components/Calendar.tsx";
import DatePicker from "../components/DatePicker.tsx";
import CommitTracker from "../components/CommitTracker.tsx";
import SettingsEdit from "../components/SettingsEdit.tsx";
import ChartRenderer from "../components/ChartRenderer.tsx";
import type { BooleanStats, ChartConfig } from "../types/chartConfig";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

type ChartType = "pie" | "line" | "radar" | "bar" | "bubble";
type AnalyticsTab = "charts" | "calendar" | "commit-tracker" | "settings";

// Data for bubble chart (x, y, z coordinates)
const bubbleData = [
  { x: 100, y: 200, z: 200, name: "Group A" },
  { x: 120, y: 100, z: 260, name: "Group B" },
  { x: 170, y: 300, z: 400, name: "Group C" },
  { x: 140, y: 250, z: 280, name: "Group D" },
  { x: 150, y: 400, z: 500, name: "Group E" },
  { x: 110, y: 280, z: 200, name: "Group F" },
];

function AnalyticsPage() {
  const [selectedChart, setSelectedChart] = useState<ChartType>("pie");
  const [selectedData, setSelectedData] = useState<number>(0);
  const [metrics, setMetrics] = useState<Metric[]>();
  const [data, setData] = useState<DataItem[]>();
  const today = new Date();
  const septemberFirst2025 = new Date(2025, 8, 1);
  const [startDate, setStartDate] = useState(septemberFirst2025);
  const [endDate, setEndDate] = useState(today);
  const [booleanStats, setBooleanStats] = useState< BooleanStats | null>(null);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("charts");

  const handleDataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedData(Number(e.target.value));
  };

  const getChartTitle = () => {
    const selectedMetric = metrics?.find((m) => m.id === selectedData);
    const metricName = selectedMetric?.name || "";
    
    switch (selectedChart) {
      case "pie":
        return metricName ? `${metricName} - Pie Chart` : "Pie Chart";
      case "line":
        return metricName ? `${metricName} - Line Chart` : "Line Chart";
      case "bar":
        return metricName ? `${metricName} - Bar Chart` : "Bar Chart";
      case "bubble":
        return metricName ? `${metricName} - Bubble Chart` : "Bubble Chart";
      default:
        return metricName ? `${metricName} - Pie Chart` : "Pie Chart";
    }
  };

  // Fetch metrics on component mount
  useEffect(() => {
    fetchMetrics(setMetrics);
  }, []);

  // Auto-select first metric when metrics are loaded
  useEffect(() => {
    if (metrics && metrics.length > 0 && selectedData === 0) {
      setSelectedData(metrics[0].id);
    }
  }, [metrics, selectedData]);

  useEffect(() => {
    if (selectedData === 0) {
      setData([]);
      return;
    }

    const selectedMetric = metrics?.find((metric) => metric.id === selectedData);

    if (selectedMetric?.data_type === "boolean") {
      fetchBooleanAnalytics(
        setData,
        1 as number,
        selectedData,
        setBooleanStats,
        startDate,
        endDate
      );
    } else {
      setBooleanStats(null);
      fetchChartData(setData, 1 as number, selectedData, startDate, endDate);
    }
  }, [selectedData, startDate, endDate, metrics]);

  useEffect(() => {
    const dataTypeofSelectedData = metrics?.find(
      (metric) => metric.id === selectedData
    )?.data_type;

    switch (dataTypeofSelectedData) {
      case "int":
        setSelectedChart("bar");
        break;
      case "boolean":
        setSelectedChart("pie");
        break;
      case "text":
        setSelectedChart("pie");
        break;
      case "decimal":
        setSelectedChart("line");
        break;
    }
  }, [metrics, selectedData]);

  useEffect(() => {
    if (!metrics || selectedData == 0) return;

    const selectedMetric = metrics.find(m => m.id === selectedData);
    if (!selectedMetric?.created_at) return;

    const metricCreatedDate = new Date(selectedMetric.created_at);
    metricCreatedDate.setHours(0, 0, 0, 0);

    if (metricCreatedDate < startDate) {
      // Always set start date to the metric's creation date (or later if user manually chose later)
      const newStartDate = new Date(Math.max(metricCreatedDate.getTime(), startDate.getTime()));
      setStartDate(newStartDate);
    }
  }, [selectedData, metrics]);

  // Build ChartConfig
  const chartConfig = useMemo((): ChartConfig => {
    const selectedMetric = metrics?.find((m) => m.id === selectedData);

    switch (selectedChart) {
      case "pie":
        return {
          type: "pie",
          data: data || [],
          COLORS,
        };  
      case "line":
        return {
          type: "line",
          data: data || [],
          metric:
            selectedMetric?.name && selectedMetric?.unit
              ? { name: selectedMetric.name, unit: selectedMetric.unit }
              : undefined,
        };
      case "bar":
        return {
          type: "bar",
          data: data || [],
        };
      case "bubble":
        return {
          type: "bubble",
          data: bubbleData,
        };
      default:
        return {
          type: "pie",
          data: data || [],
          COLORS,
        };
    }
  }, [selectedChart, data, metrics, selectedData]);

  return (
    <div className="container mb-5" style={{ maxWidth: "700px" }}>
      <h1 className="text-center mb-4">Analytics</h1>

      {/* Tab Navigation */}
      <div className="row justify-content-center mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs nav-justified">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "charts" ? "active" : ""}`}
                onClick={() => setActiveTab("charts")}
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
              >
                Charts
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "calendar" ? "active" : ""
                }`}
                onClick={() => setActiveTab("calendar")}
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
              >
                Calendar
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "commit-tracker" ? "active" : ""
                }`}
                onClick={() => setActiveTab("commit-tracker")}
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
              >
                Commit Tracker
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "settings" ? "active" : ""
                }`}
                onClick={() => setActiveTab("settings")}
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
              >
                Settings
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "charts" && (
        <>
          {/* Data Selector */}
          <div className="row justify-content-center mb-4">
            <div className="col-12">
              <div className="card shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
                <div className="card-body p-4">
                  <div className="d-flex gap-3 pb-3 flex-wrap">
                    <DatePicker
                      title="Start Date"
                      setTargetDate={setStartDate}
                      targetDate={startDate}
                    />
                    <DatePicker
                      title="End Date"
                      setTargetDate={setEndDate}
                      targetDate={endDate}
                    />
                  </div>
                  <div>
                    <label htmlFor="chart-select" className="form-label fw-semibold mb-2">
                      Select Data:
                    </label>
                    <select
                      id="data-select"
                      className="form-select"
                      value={selectedData}
                      onChange={handleDataChange}
                      style={{ borderRadius: "8px" }}
                    >
                      <option value={0}>Select a metric...</option>
                      {metrics?.map((metric) => (
                        <option key={metric.id} value={metric.id}>
                          {metric.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Boolean Stats Card - Prominent display like Swift version */}
          {booleanStats && (
            <div className="row justify-content-center mb-4">
              <div className="col-12">
                <div className="card shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
                  <div className="card-body p-4">
                    <h5 className="mb-3 text-center fw-semibold">Boolean Metric Statistics</h5>
                    <div className="row g-3 text-center">
                      <div className="col-6 col-md-3">
                        <div className="p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                          <div className="fw-bold text-primary" style={{ fontSize: "1.75rem" }}>{booleanStats.totalDays}</div>
                          <div className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>Total Days</div>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="p-3 rounded" style={{ backgroundColor: "#d1e7dd" }}>
                          <div className="fw-bold text-success" style={{ fontSize: "1.75rem" }}>{booleanStats.yesDays}</div>
                          <div className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>Yes Days</div>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="p-3 rounded" style={{ backgroundColor: "#f8d7da" }}>
                          <div className="fw-bold text-danger" style={{ fontSize: "1.75rem" }}>{booleanStats.noDays}</div>
                          <div className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>No/Null Days</div>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="p-3 rounded" style={{ backgroundColor: "#cff4fc" }}>
                          <div className="fw-bold text-info" style={{ fontSize: "1.75rem" }}>{booleanStats.percentage}%</div>
                          <div className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>Success Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Selected Chart */}
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="card shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
                <div className="card-body p-4">
                  <h5 className="text-center mb-3 fw-semibold">{getChartTitle()}</h5>
                  <ChartRenderer
                    config={chartConfig}
                    booleanStats={null}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "calendar" && (
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
              <div className="card-body p-4">
                <h5 className="text-center mb-3 fw-semibold">Boolean Calendar View</h5>
                <Calendar metrics={metrics || []} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "commit-tracker" && (
        <div className="row justify-content-center">
          <CommitTracker />
        </div>
      )}

      {activeTab === "settings" && (
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
              <div className="card-body p-4">
                <h5 className="text-center mb-3 fw-semibold">Settings</h5>
                <SettingsEdit settingsKeys={["enabledPages"]} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;