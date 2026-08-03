import { useEffect, useState } from "react";
import "./App.css";

type HealthResponse = {
  status: string;
  service: string;
};

const apiUrl = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/health`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        return response.json() as Promise<HealthResponse>;
      })
      .then((data) => {
        setHealth(data);
        setError(null);
      })
      .catch((caughtError: unknown) => {
        setHealth(null);
        setError(caughtError instanceof Error ? caughtError.message : "Unknown error");
      });
  }, []);

  return (
    <main className="page">
      <section className="panel">
        <p className="eyebrow">Travel Agent</p>
        <h1>Your full-stack starter is running.</h1>
        <p className="intro">
          React is talking to FastAPI through the same /api path in local
          development and production.
        </p>

        <div className="statusRow">
          <span className={health ? "dot online" : "dot offline"} />
          <div>
            <p className="statusLabel">Backend health</p>
            <p className="statusValue">
              {health ? `${health.service}: ${health.status}` : error ?? "Checking..."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
