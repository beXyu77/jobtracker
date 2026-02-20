export const ui = {
  page: {
    background: "#faeef1",
    minHeight: "100vh",
  },
  container: {
    padding: 12,
    maxWidth: 1200,
    margin: "0 auto",
  },
  topbar: {
    position: "sticky" as const,
    top: 0,
    zIndex: 5,
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #e8e8ee",
  },
  title: { margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: -0.3 },
  muted: { fontSize: 13, opacity: 0.7 },

  btn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #8da5d4",
    background: "white",
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #111827",
    background: "#111827",
    color: "white",
    cursor: "pointer",
  },

  input: {
    padding: 10,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "white",
    outline: "none",
  },

  card: {
    background: "white",
    border: "1px solid #b2ddb7",
    borderRadius: 16,
    boxShadow: "0 6px 16px rgba(16,24,40,0.06)",
  },

  kanbanWrap: {
    display: "flex",
    gap: 12,
    overflowX: "auto" as const,
    paddingBottom: 12,
  },
  column: {
    minWidth: 280,
    borderRadius: 18,
    padding: 12,
    border: "1px solid #ececf3",
    background: "#f3f4f8",
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  badge: {
    fontSize: 12,
    padding: "2px 8px",
    borderRadius: 999,
    background: "rgba(17,24,39,0.08)",
  },
};