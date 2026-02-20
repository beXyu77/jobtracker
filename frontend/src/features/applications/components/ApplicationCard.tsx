import { STATUSES } from "../constants";
import type { Application } from "../types";
import { useChangeStatus, useDeleteApplication } from "../hooks";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function ApplicationCard({
  app,
  onOpen,
}: {
  app: Application;
  onOpen: (id: number) => void;
}) {
  const changeMut = useChangeStatus();
  const delMut = useDeleteApplication();

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(app.id),
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  };

  const onChangeStatus = async (to_status: string) => {
    await changeMut.mutateAsync({
      appId: app.id,
      input: { to_status: to_status as any, note: "changed from card select" },
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        height: 140,
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ececf3",
        borderRadius: 16,
        padding: 14,
        background: "white",
        boxShadow: isDragging
          ? "0 10px 24px rgba(16,24,40,0.18)"
          : "0 6px 16px rgba(16,24,40,0.06)",
      }}
    >
      {/* drag handle 区域（你也可以整个卡片拖，这里我用标题区域拖更不误触） */}
      <div
        {...listeners}
        {...attributes}
        style={{ fontWeight: 700, display: "flex", justifyContent: "space-between", gap: 8 }}
        title="Drag me"
      >
        <span style={{ fontWeight: 900, letterSpacing: -0.2, display: "flex", justifyContent: "space-between" }}>{app.company}</span>
        <span style={{ opacity: 0.5, fontSize: 12 }}>#{app.id}</span>
      </div>

      <div
      style={{ fontSize: 14, opacity: 0.85, cursor: "pointer" }}
      onClick={() => onOpen(app.id)}
      title="Open detail"
      >
        {app.position}
      </div>


      {(app.location || app.platform) && (
        <div style={{ fontSize: 12, marginTop: 6, opacity: 0.7 }}>
          {[app.location, app.platform].filter(Boolean).join(" • ")}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: "auto" }}>
        <select
          value={app.status}
          onChange={(e) => onChangeStatus(e.target.value)}
          disabled={changeMut.isPending}
          style={{ padding: 6, flex: 1 }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          onClick={() => delMut.mutate(app.id)}
          disabled={delMut.isPending}
          style={{ padding: "6px 10px" }}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}