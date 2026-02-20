import { useEffect, useState } from "react";
import { useApplicationDetail, useUpdateApplication } from "../hooks";

export default function ApplicationDrawer({
  appId,
  onClose,
}: {
  appId: number | null;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = useApplicationDetail(appId);
  const updateMut = useUpdateApplication();

  const [url, setUrl] = useState("");
  const [location, setLocation] = useState("");
  const [platform, setPlatform] = useState("");
  const [appliedAt, setAppliedAt] = useState(""); // yyyy-mm-dd
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!data) return;
    setUrl(data.url ?? "");
    setLocation(data.location ?? "");
    setPlatform(data.platform ?? "");
    setAppliedAt((data.applied_at ?? "") as string);
    setNotes(data.notes ?? "");
  }, [data?.id]);

  if (!appId) return null;

  const onSave = async () => {
    if (!data) return;

    await updateMut.mutateAsync({
      appId: data.id,
      input: {
        url: url || null,
        location: location || null,
        platform: platform || null,
        applied_at: appliedAt || null,
        notes: notes || null,
      },
    });

    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 460,
          height: "100%",
          background: "white",
          padding: 16,
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Application Detail</h3>
          <button onClick={onClose}>Close</button>
        </div>

        {isLoading && <div style={{ marginTop: 12 }}>Loading...</div>}
        {isError && <div style={{ marginTop: 12, color: "crimson" }}>Failed to load</div>}

        {data && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{data.company}</div>
            <div style={{ opacity: 0.8 }}>{data.position}</div>

            <div style={{ marginTop: 12, fontSize: 14 }}>
              <div><b>Status:</b> {data.status}</div>
              <div style={{ opacity: 0.7, fontSize: 12, marginTop: 4 }}>
                Updated: {new Date(data.updated_at).toLocaleString()}
              </div>
            </div>

            {/* Editable fields */}
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontSize: 13 }}>
                URL
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  style={{ width: "100%", padding: 8, marginTop: 4 }}
                />
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ fontSize: 13, flex: 1 }}>
                  Location
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Chiang Mai"
                    style={{ width: "100%", padding: 8, marginTop: 4 }}
                  />
                </label>

                <label style={{ fontSize: 13, flex: 1 }}>
                  Platform
                  <input
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    placeholder="LinkedIn / JobDB"
                    style={{ width: "100%", padding: 8, marginTop: 4 }}
                  />
                </label>
              </div>

              <label style={{ fontSize: 13 }}>
                Applied At
                <input
                  type="date"
                  value={appliedAt}
                  onChange={(e) => setAppliedAt(e.target.value)}
                  style={{ padding: 8, marginTop: 4 }}
                />
              </label>

              <label style={{ fontSize: 13 }}>
                Notes
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write notes..."
                  rows={5}
                  style={{ width: "100%", padding: 8, marginTop: 4 }}
                />
              </label>

              {updateMut.isError && (
                <div style={{ color: "crimson" }}>Save failed</div>
              )}

              <button
                onClick={onSave}
                disabled={updateMut.isPending}
                style={{ padding: "10px 12px" }}
              >
                {updateMut.isPending ? "Saving..." : "Save"}
              </button>
            </div>

            {/* History */}
            <div style={{ marginTop: 18 }}>
              <b>Status History</b>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                {(data as any).status_logs?.map((log: any) => (
                  <div key={log.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      {log.from_status ? (
                        <span>
                          {log.from_status} → <b>{log.to_status}</b>
                        </span>
                      ) : (
                        <span>
                          Created → <b>{log.to_status}</b>
                        </span>
                      )}
                    </div>
                    {log.note && <div style={{ marginTop: 4, fontSize: 13, opacity: 0.85 }}>{log.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}