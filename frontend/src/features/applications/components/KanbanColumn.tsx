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
        width: "100%",
        height: 180, 
        background: isOver ? "#e9ebf5" : "#f3f4f8",
        borderRadius: 18,
        padding: 12,
        border: isOver ? "2px dashed #9aa3b2" : "1px solid #ececf3",
        display: "flex",
        flexDirection: "column",
        margin: "0.7rem auto",
        maxWidth: 255
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <strong>{title}</strong>
        <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: "rgba(17,24,39,0.08)" }}>
          {items.length}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
          paddingRight: 4,
          flex: 1,
        }}
      >
        {items.map((app) => (
          <ApplicationCard key={app.id} app={app} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}