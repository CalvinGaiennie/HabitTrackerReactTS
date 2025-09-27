import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BubbleChartProps {
  data: Array<{ x: number; y: number; z: number; name: string }>;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF7300",
  "#8884d8",
  "#82ca9d",
];

function BubbleChartComponent({ data }: BubbleChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" type="number" name="X Value" unit="" />
        <YAxis dataKey="y" type="number" name="Y Value" unit="" />
        <ZAxis dataKey="z" type="number" range={[60, 400]} name="Size" />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          formatter={(_, __, props) => [
            `X: ${props.payload.x}, Y: ${props.payload.y}, Size: ${props.payload.z}`,
            props.payload.name,
          ]}
        />
        <Legend />
        <Scatter name="Bubbles" data={data} fill="#8884d8">
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export default BubbleChartComponent;
