// src/components/charts/ChartRenderer.tsx
import PieChartComponent from "./PieChartComponent";
import LineChartComponent from "./LineChartComponent";
import BarChartComponent from "./BarChartComponent";
import BubbleChartComponent from "./BubbleChartComponent";
import type { ChartConfig } from "../types/chartConfig";

type ChartRendererProps = {
  config: ChartConfig;
  booleanStats?: {
    totalDays: number;
    yesDays: number;
    noDays: number;
    percentage: number;
  } | null;
};

export default function ChartRenderer({ config, booleanStats }: ChartRendererProps) {
  return (
    <>
      <div style={{ width: "100%", height: "400px" }}>
        {config.type === "pie" && (
          <PieChartComponent data={config.data} COLORS={config.COLORS} />
        )}
        {config.type === "line" && (
          <LineChartComponent data={config.data} metric={config.metric} />
        )}
        {config.type === "bar" && <BarChartComponent data={config.data} />}
        {config.type === "bubble" && (
          <BubbleChartComponent data={config.data} />
        )}
      </div>

      {/* Boolean Stats */}
      {booleanStats && (
        <div className="mt-4">
          <h5>Boolean Metric Statistics</h5>
          <div className="row text-center">
            <div className="col-3">
              <div className="p-2">
                <div className="fw-bold text-primary">Total Days</div>
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
                <div className="fw-bold text-danger">No/Null Days</div>
                <div>{booleanStats.noDays}</div>
              </div>
            </div>
            <div className="col-3">
              <div className="p-2">
                <div className="fw-bold text-info">Success Rate</div>
                <div>{booleanStats.percentage}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}