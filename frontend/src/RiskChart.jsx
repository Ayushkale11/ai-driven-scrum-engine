import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { sprint: "Sprint 1", risk: 40 },
  { sprint: "Sprint 2", risk: 55 },
  { sprint: "Sprint 3", risk: 70 },
  { sprint: "Sprint 4", risk: 78 },
];

function RiskChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
        <XAxis dataKey="sprint" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="risk"
          stroke="#ef4444"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default RiskChart;