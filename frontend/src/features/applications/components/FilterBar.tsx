import { STATUSES } from "../constants";

export type SortKey = "updated_desc" | "updated_asc" | "applied_desc" | "applied_asc";

export default function FilterBar({
  q,
  setQ,
  status,
  setStatus,
  sort,
  setSort,
  onClear,
}: {
  q: string;
  setQ: (v: string) => void;
  status: string; // "All" or one status
  setStatus: (v: string) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  onClear: () => void;
}) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ececf3",
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search company / position / location..."
        style={{
          padding: 10,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          minWidth: 320,
          flex: 1,
        }}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
      >
        <option value="All">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as SortKey)}
        style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" }}
      >
        <option value="updated_desc">Updated: new → old</option>
        <option value="updated_asc">Updated: old → new</option>
        <option value="applied_desc">Applied: new → old</option>
        <option value="applied_asc">Applied: old → new</option>
      </select>

      <button
        onClick={onClear}
        style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "white" }}
      >
        Clear
      </button>
    </div>
  );
}