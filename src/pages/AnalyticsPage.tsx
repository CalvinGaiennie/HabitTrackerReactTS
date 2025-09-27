import { useState } from "react";
import PieChartComponent from "../components/PieChartComponent";
import LineChartComponent from "../components/LineChartComponent";
import RadarChartComponent from "../components/RadarChartComponent";
import BarChartComponent from "../components/BarChartComponent";
import BubbleChartComponent from "../components/BubbleChartComponent";

// Data for pie, line, radar, and bar charts
const chartData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 200 },
];

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

  const handleChartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChart(e.target.value as ChartType);
  };

  const renderChart = () => {
    switch (selectedChart) {
      case "pie":
        return <PieChartComponent data={chartData} COLORS={COLORS} />;
      case "line":
        return <LineChartComponent data={chartData} />;
      case "radar":
        return <RadarChartComponent data={chartData} />;
      case "bar":
        return <BarChartComponent data={chartData} />;
      case "bubble":
        return <BubbleChartComponent data={bubbleData} />;
      default:
        return <PieChartComponent data={chartData} COLORS={COLORS} />;
    }
  };

  const getChartTitle = () => {
    switch (selectedChart) {
      case "pie":
        return "Pie Chart";
      case "line":
        return "Line Chart";
      case "radar":
        return "Radar Chart";
      case "bar":
        return "Bar Chart";
      case "bubble":
        return "Bubble Chart";
      default:
        return "Pie Chart";
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4">Analytics Page</h1>

      {/* Chart Type Selector */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <label htmlFor="chart-select" className="form-label">
                <strong>Select Chart Type:</strong>
              </label>
              <select
                id="chart-select"
                className="form-select"
                value={selectedChart}
                onChange={handleChartChange}
              >
                <option value="pie">Pie Chart</option>
                <option value="line">Line Chart</option>
                <option value="radar">Radar Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="bubble">Bubble Chart</option>
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
