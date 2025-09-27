import {
  PieChart,
  ResponsiveContainer,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

function PieChartComponent({
  data,
  COLORS,
}: {
  data: { name: string; value: number }[];
  COLORS: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartComponent;
