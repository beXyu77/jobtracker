import { STATUSES } from "../constants";
import { useApplications, useChangeStatus } from "../hooks";
import KanbanColumn from "./KanbanColumn";
import CreateApplicationForm from "./CreateApplicationForm";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { toIntId } from "../utils";
import { useMemo, useState } from "react";
import ApplicationDrawer from "./ApplicationDrawer";
import KpiBar from "./KpiBar";
import AppliedTrendChart from "./AppliedTrendChart";
import FilterBar, { type SortKey } from "./FilterBar";

export default function KanbanBoard() {
  const { data, isLoading, isError } = useApplications();
  const changeMut = useChangeStatus();
  
  const [openId, setOpenId] = useState<number | null>(null);

  if (isLoading) return <div style={{ padding: 24 }}>Loading applications...</div>;
  if (isError) return <div style={{ padding: 24, color: "crimson" }}>Failed to load applications</div>;

  const apps = data ?? [];

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const appId = toIntId(active.id);
    const toStatus = String(over.id);

    // 找到当前 app 的 status，避免重复请求
    const current = apps.find((a) => a.id === appId);
    if (!current) return;
    if (current.status === toStatus) return;

    // toStatus 必须是我们允许的 status
    if (!STATUSES.includes(toStatus as any)) return;

    await changeMut.mutateAsync({
      appId,
      input: { to_status: toStatus as any, note: "moved via drag-and-drop" },
    });
  };

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("updated_desc");
  const filteredApps = useMemo(() => {
  const query = q.trim().toLowerCase();
  let list = apps;
  // status filter
  if (statusFilter !== "All") {
    list = list.filter((a) => a.status === statusFilter);
  }

  // search
  if (query) {
    list = list.filter((a) => {
      const hay = [
        a.company,
        a.position,
        a.location ?? "",
        a.platform ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }

  // sort
  const toTime = (s?: string | null) => (s ? new Date(s).getTime() : 0);
  const toDate = (s?: string | null) => (s ? new Date(s).getTime() : 0);
  list = [...list].sort((a, b) => {
    if (sort === "updated_desc") return toTime(b.updated_at) - toTime(a.updated_at);
    if (sort === "updated_asc") return toTime(a.updated_at) - toTime(b.updated_at);
    if (sort === "applied_desc") return toDate(b.applied_at ?? null) - toDate(a.applied_at ?? null);
    return toDate(a.applied_at ?? null) - toDate(b.applied_at ?? null);
  });

    return list;
  }, [apps, q, statusFilter, sort]);

  const grouped = Object.fromEntries(
    STATUSES.map((s) => [s, filteredApps.filter((a) => a.status === s)])
  ) as Record<(typeof STATUSES)[number], typeof filteredApps>;

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Applications</h2>
          <div style={{ fontSize: 13, opacity: 0.7 }}>Drag cards to change status</div>
        </div>
      </div>

      <KpiBar /><br /><br />
      <FilterBar
        q={q}
        setQ={setQ}
        status={statusFilter}
        setStatus={setStatusFilter}
        sort={sort}
        setSort={setSort}
        onClear={() => {
          setQ("");
          setStatusFilter("All");
          setSort("updated_desc");
        }}
      />
      <CreateApplicationForm />

      <DndContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 18,
            alignItems: "stretch",
          }}
        >
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              title={status}
              statusId={status}
              items={grouped[status]}
              onOpen={(id) => setOpenId(id)}
            />
          ))}
        </div>
      </DndContext>

      <ApplicationDrawer appId={openId} onClose={() => setOpenId(null)} />
      <br />
      <AppliedTrendChart days={7} />
    </div>
  );
}