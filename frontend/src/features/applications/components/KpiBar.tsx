import { useKpi } from "../hooks";

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

export default function KpiBar() {
  const { data, isLoading, isError } = useKpi();

  if (isLoading) return <div style={{ marginBottom: 16 }}>Loading KPI...</div>;
  if (isError || !data) return <div style={{ marginBottom: 16, color: "crimson" }}>Failed to load KPI</div>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
      <Card title="Total" value={String(data.total)} hint="All applications" />
      <Card title="Active" value={String(data.active)} hint="Not rejected/withdrawn" />
      <Card title="Interview" value={String(data.interviewing)} hint={`Rate: ${pct(data.interview_rate)}`} />
      <Card title="Offer" value={String(data.offer)} hint={`Rate: ${pct(data.offer_rate)}`} />
      <Card title="Rejected" value={String(data.rejected)} hint="Closed" />
      <Card title="Withdrawn" value={String(data.withdrawn)} hint="Closed" />
    </div>
  );
}

function Card({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div style={{ background: "white", border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{value}</div>
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{hint}</div>
    </div>
  );
}