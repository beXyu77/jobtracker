import { useAppliedDaily } from "../hooks";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AppliedTrendChart({ days = 30 }: { days?: number }) {
  const { data, isLoading, isError } = useAppliedDaily(days);

  if (isLoading) {
    return <div style={{ marginBottom: 16 }}>Loading trend...</div>;
  }
  if (isError || !data) {
    return <div style={{ marginBottom: 16, color: "crimson" }}>Failed to load trend</div>;
  }

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #eee",
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>
        Applied trend (last {days} days)
      </div>

      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => String(d).slice(5)} // MM-DD
              minTickGap={18}
            />
            <YAxis allowDecimals={false} />
            <Tooltip
              labelFormatter={(label) => `Date: ${label}`}
              formatter={(value) => [`${value}`, "Applied"]}
            />
            <Line type="monotone" dataKey="count" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}