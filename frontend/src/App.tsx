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
    <div>
      <div style={{ padding: 24, display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>JobTracker</h1>
          <div style={{ fontSize: 14, opacity: 0.7 }}>
            Logged in as {me.email}
          </div>
        </div>

        <button onClick={logout}>Logout</button>
      </div>

      <KanbanBoard />
    </div>
  );
}