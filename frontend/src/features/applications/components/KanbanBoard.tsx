import { STATUSES } from "../constants";
import { useApplications, useChangeStatus } from "../hooks";
import KanbanColumn from "./KanbanColumn";
import CreateApplicationForm from "./CreateApplicationForm";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { toIntId } from "../utils";
import { useState } from "react";
import ApplicationDrawer from "./ApplicationDrawer";

export default function KanbanBoard() {
  const { data, isLoading, isError } = useApplications();
  const changeMut = useChangeStatus();
  
  const [openId, setOpenId] = useState<number | null>(null);

  if (isLoading) return <div style={{ padding: 24 }}>Loading applications...</div>;
  if (isError) return <div style={{ padding: 24, color: "crimson" }}>Failed to load applications</div>;

  const apps = data ?? [];

  const grouped = Object.fromEntries(
    STATUSES.map((s) => [s, apps.filter((a) => a.status === s)])
  ) as Record<(typeof STATUSES)[number], typeof apps>;

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

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginTop: 0 }}>Applications</h2>

      <CreateApplicationForm />

      <DndContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12 }}>
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
    </div>
  );
}