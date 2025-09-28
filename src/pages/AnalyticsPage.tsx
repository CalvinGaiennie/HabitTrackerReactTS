import { useEffect, useState } from "react";
import PieChartComponent from "../components/PieChartComponent";
import LineChartComponent from "../components/LineChartComponent";
import BarChartComponent from "../components/BarChartComponent";
import BubbleChartComponent from "../components/BubbleChartComponent";
import type { Metric } from "../types/Metrics";
import fetchMetrics from "../hooks/fetchMetrics";
import type { DataItem } from "../types/chartData";
import { useAuth } from "../context";
import fetchChartData from "../hooks/fetchChartData.ts";

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

function AnalyticsPage() {
  const [selectedChart, setSelectedChart] = useState<ChartType>("pie");
  const [selectedData, setSelectedData] = useState<number>(0);
  const [metrics, setMetrics] = useState<Metric[]>();
  const [data, setData] = useState<DataItem[]>();
  const { authState } = useAuth();

  const handleChartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChart(e.target.value as ChartType);
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedData(Number(e.target.value));
  };

  const renderChart = () => {
    switch (selectedChart) {
      case "pie":
        return <PieChartComponent data={data ? data : []} COLORS={COLORS} />;
      case "line":
        return <LineChartComponent data={data ? data : []} />;
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

  useEffect(() => {
    if (1) {
      fetchChartData(setData, 1 as number, selectedData);
    }
  }, [selectedData, 1]);

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
  });

  return (
    <div className="container">
      <h1 className="text-center mb-4">Analytics Page</h1>

      {/* Debug info - remove this in production */}
      <div className="mb-3">
        <small className="text-muted">
          Debug: Data: {data?.length || 0} items
          {1 && ` | User ID: ${1}`}
        </small>
      </div>

      {/* Data Selector */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
