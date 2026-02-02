import { useEffect, useState } from "react";
import { api } from "./lib/api";

export default function App() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    api.get("/health")
      .then((res) => setOk(res.data.ok))
      .catch(() => setOk(false));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>JobTracker</h1>
      <p>Backend health: {ok === null ? "loading..." : ok ? "OK" : "FAILED"}</p>
    </div>
  );
}