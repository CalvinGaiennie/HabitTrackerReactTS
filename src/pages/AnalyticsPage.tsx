import { useEffect, useState } from "react";
import PieChartComponent from "../components/PieChartComponent";
import LineChartComponent from "../components/LineChartComponent";
import BarChartComponent from "../components/BarChartComponent";
import BubbleChartComponent from "../components/BubbleChartComponent";
import type { Metric } from "../types/Metrics";
import fetchMetrics from "../hooks/fetchMetrics";
import type { DataItem } from "../types/chartData";
// import { useAuth } from "../context"; // Commented out as not currently used
import fetchChartData from "../hooks/fetchChartData.ts";
import fetchBooleanAnalytics from "../hooks/fetchBooleanAnalytics.ts";
import Calendar from "../components/Calendar.tsx";
import DatePicker from "../components/DatePicker.tsx";

// Data for bubble chart (x, y, z coordinates)
const bubbleData = [
  { x: 100, y: 200, z: 200, name: "Group A" },
  { x: 120, y: 100, z: 260, name: "Group B" },
  { x: 170, y: 300, z: 400, name: "Group C" },
  { x: 140, y: 250, z: 280, name: "Group D" },
  { x: 150, y: 400, z: 500, name: "Group E" },
  { x: 110, y: 280, z: 200, name: "Group F" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

type ChartType = "pie" | "line" | "radar" | "bar" | "bubble";
type AnalyticsTab = "charts" | "calendar";

function AnalyticsPage() {
  const [selectedChart, setSelectedChart] = useState<ChartType>("pie");
  const [selectedData, setSelectedData] = useState<number>(0);
  const [metrics, setMetrics] = useState<Metric[]>();
  const [data, setData] = useState<DataItem[]>();
  // const { authState } = useAuth(); // Commented out as not currently used
  // Set default dates: September 1st, 2025 to current date
  const today = new Date();
  const septemberFirst2025 = new Date(2025, 8, 1); // Month is 0-indexed, so 8 = September

  const [startDate, setStartDate] = useState(septemberFirst2025);
  const [endDate, setEndDate] = useState(today);
  const [booleanStats, setBooleanStats] = useState<{
    totalDays: number;
    yesDays: number;
    noDays: number;
    percentage: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("charts");

  const handleDataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedData(Number(e.target.value));
  };

  const renderChart = () => {
    switch (selectedChart) {
      case "pie":
        return <PieChartComponent data={data ? data : []} COLORS={COLORS} />;
      case "line":
        const selectedMetric = metrics?.find(
          (metric) => metric.id === selectedData
        );
        return (
          <LineChartComponent
            data={data ? data : []}
            metric={
              selectedMetric
                ? { name: selectedMetric.name, unit: selectedMetric.unit }
                : undefined
            }
          />
        );
      case "bar":
        return <BarChartComponent data={data ? data : []} />;
      case "bubble":
        return <BubbleChartComponent data={bubbleData} />;
      default:
        return <PieChartComponent data={data ? data : []} COLORS={COLORS} />;
    }
  };

  const getChartTitle = () => {
    switch (selectedChart) {
      case "pie":
        return "Pie Chart";
      case "line":
        return "Line Chart";
      case "bar":
        return "Bar Chart";
      case "bubble":
        return "Bubble Chart";
      default:
        return "Pie Chart";
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

    // Get the selected metric to determine its data type
    const selectedMetric = metrics?.find(
      (metric) => metric.id === selectedData
    );

    if (selectedMetric?.data_type === "boolean") {
      // Use specialized boolean analytics for boolean metrics
      fetchBooleanAnalytics(
        setData,
        1 as number,
        selectedData,
        setBooleanStats,
        startDate,
        endDate
      );
    } else {
      // Use regular chart data for other metric types
      setBooleanStats(null); // Clear boolean stats for non-boolean metrics
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

  return (
    <div className="container mb-5">
      <h1 className="text-center mb-4">Analytics Page</h1>

      {/* Tab Navigation */}
      <div className="row justify-content-center mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs justify-content-center">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "charts" ? "active" : ""}`}
                onClick={() => setActiveTab("charts")}
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
              >
                Calendar
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
              <div className="card">
                <div className="card-body">
                  <div className="d-flex gap-4 pb-4">
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
                    <label htmlFor="chart-select" className="form-label">
                      <strong>Select Data:</strong>
                    </label>
                    <select
                      id="data-select"
                      className="form-select"
                      value={selectedData}
                      onChange={handleDataChange}
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
          {/* Selected Chart */}
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-center mb-0">{getChartTitle()}</h3>
                </div>
                <div className="card-body">
                  <div style={{ width: "100%", height: "400px" }}>
                    {renderChart()}
                  </div>
                  {/* Boolean Statistics */}
                  {booleanStats && (
                    <div className="mt-4">
                      <h5>Boolean Metric Statistics</h5>
                      <div className="row text-center">
                        <div className="col-3">
                          <div className="p-2">
                            <div className="fw-bold text-primary">
                              Total Days
                            </div>
                            <div>{booleanStats.totalDays}</div>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="p-2">
                            <div className="fw-bold text-success">Yes Days</div>
                            <div>{booleanStats.yesDays}</div>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="p-2">
                            <div className="fw-bold text-danger">
                              No/Null Days
                            </div>
                            <div>{booleanStats.noDays}</div>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="p-2">
                            <div className="fw-bold text-info">
                              Success Rate
                            </div>
                            <div>{booleanStats.percentage}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "calendar" && (
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="text-center mb-0"> Boolean Calendar View</h3>
              </div>
              <div className="card-body">
                <Calendar metrics={metrics || []} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;
