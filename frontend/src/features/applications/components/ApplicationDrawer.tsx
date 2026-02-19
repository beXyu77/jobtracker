import { useApplicationDetail } from "../hooks";

export default function ApplicationDrawer({
  appId,
  onClose,
}: {
  appId: number | null;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = useApplicationDetail(appId);

  if (!appId) return null;

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
          width: 420,
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
              {data.location && <div><b>Location:</b> {data.location}</div>}
              {data.platform && <div><b>Platform:</b> {data.platform}</div>}
              {data.applied_at && <div><b>Applied At:</b> {data.applied_at}</div>}
              {data.url && (
                <div>
                  <b>URL:</b>{" "}
                  <a href={data.url} target="_blank" rel="noreferrer">
                    {data.url}
                  </a>
                </div>
              )}
            </div>

            {data.notes && (
              <div style={{ marginTop: 12 }}>
                <b>Notes</b>
                <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{data.notes}</div>
              </div>
            )}

            <div style={{ marginTop: 16 }}>
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