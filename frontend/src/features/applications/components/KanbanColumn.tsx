import type { Application } from "../types";
import ApplicationCard from "./ApplicationCard";
import { useDroppable } from "@dnd-kit/core";

export default function KanbanColumn({
  title,
  statusId,
  items,
  onOpen,
}: {
  title: string;
  statusId: string;
  items: Application[];
  onOpen: (id: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: statusId });

  return (
    <div
      ref={setNodeRef}
      style={{
        minWidth: 260,
        background: isOver ? "#ececec" : "#f7f7f7",
        borderRadius: 12,
        padding: 12,
        border: isOver ? "2px dashed #bbb" : "1px solid transparent",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <strong>{title}</strong>
        <span style={{ opacity: 0.7 }}>{items.length}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 40 }}>
        {items.map((app) => (
          <ApplicationCard key={app.id} app={app} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}