import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function LineChartComponent({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const maxValue = Math.max(...data.map((item) => item.value));
  const minValue = Math.min(...data.map((item) => item.value));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          domain={[minValue * 0.9, maxValue * 1.1]}
          tickFormatter={(value) => Math.round(value).toString()}
          tickCount={5}
        />
        {/* implement better tick distribution later. ex a tick for every int when max - min is <= 12 2s on the even numbers when max - min is <= 24 5s on the numbers when max - min is <= 48 */}
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;
