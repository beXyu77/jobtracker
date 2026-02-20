import { useState } from "react";
import { STATUSES } from "../constants";
import { useCreateApplication } from "../hooks";

export default function CreateApplicationForm() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("Applied");

  const createMut = useCreateApplication();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;

    await createMut.mutateAsync({
      company: company.trim(),
      position: position.trim(),
      status,
    });

    setCompany("");
    setPosition("");
    setStatus("Applied");
  };

  return (
    <div style={{ background: "white", border: "1px solid #ececf3", borderRadius: 16, padding: 12, marginBottom: 16 }}>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
          style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
        />
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Position"
          style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value as any)} style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button type="submit" disabled={createMut.isPending} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #111827", background: "#111827", color: "white" }}>
          {createMut.isPending ? "Creating..." : "Add"}
        </button>

        {createMut.isError && (
          <span style={{ color: "crimson" }}>Create failed</span>
        )}
      </form>
    </div>
  );
}