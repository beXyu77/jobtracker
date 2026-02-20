import { useEffect, useState } from "react";
import LoginPage from "./features/auth/LoginPage";
import { getMe } from "./features/auth/authApi";
import KanbanBoard from "./features/applications/components/KanbanBoard";

type Me = { id: number; email: string };

export default function App() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    setLoading(true);
    try {
      const data = await getMe();
      setMe(data);
    } catch {
      setMe(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    setMe(null);
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  if (!me) return <LoginPage onSuccess={loadMe} />;

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 5, background: "#000000", backdropFilter: "blur(10px)", borderBottom: "1px solid #e8e8ee" }}>
        <div style={{ padding: 18, maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: -0.3, color:"#ffffff" }}>Job Tracker</h1>
            <div style={{ fontSize: 13, opacity: 0.7, color:"#ffffff" }}>Logged in as {me.email}</div>
          </div>
          <button
            onClick={logout}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </div>

      <KanbanBoard />
    </div>
  );
}