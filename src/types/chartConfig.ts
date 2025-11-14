// src/types/chartConfig.ts
import type { DataItem } from "./chartData";

export type BooleanStats = {
  totalDays: number;
  yesDays: number;
  noDays: number;
  percentage: number;
}
export type BubbleDataPoint = {
  x: number;
  y: number;
  z: number;
  name: string;
};

export type PieChartConfig = {
  type: "pie";
  data: DataItem[];
  COLORS: string[];
};

export type LineChartConfig = {
  type: "line";
  data: DataItem[];
  metric?: { name: string; unit: string };
};

export type BarChartConfig = {
  type: "bar";
  data: DataItem[];
};

export type BubbleChartConfig = {
  type: "bubble";
  data: BubbleDataPoint[];
};

export type ChartConfig =
  | PieChartConfig
  | LineChartConfig
  | BarChartConfig
  | BubbleChartConfig;