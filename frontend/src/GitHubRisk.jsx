import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#ef4444", "#facc15", "#22c55e", "#3b82f6"];

function GitHubRisk() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/scan-github-repo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );

      const data = await res.json();

      // Transform contributor data (top 5)
      let contributors = [];
      if (data.top_contributors) {
        contributors = data.top_contributors.map((c) => ({
          name: c.login,
          commits: c.contributions,
        }));
      }

      // Risk factor breakdown (simple derived logic)
      const riskFactors = [
        { name: "Issues", value: data.open_issues || 0 },
        { name: "Low Contributors", value: data.contributors < 3 ? 10 : 2 },
        { name: "Low Stars", value: data.stars < 5 ? 8 : 2 },
        { name: "Low Forks", value: data.forks < 2 ? 6 : 2 },
      ];

      setResult({
        ...data,
        contributorsChart: contributors,
        riskFactors,
      });
    } catch {
      setResult({ error: "Failed to fetch data" });
    }

    setLoading(false);
  };

  return (
    <div>
      <h1 style={{ fontSize: "48px", marginBottom: "25px" }}>
        GitHub Risk Analysis
      </h1>

      {/* INPUT */}
      <div
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="https://github.com/user/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            style={{
              width: "60%",
              padding: "10px",
              borderRadius: "8px",
              marginRight: "10px",
              border: "none",
            }}
          />

          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "white",
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>
      </div>

      {/* RESULTS */}
      {result && !result.error && (
        <>
          {/* STATS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
              marginBottom: "25px",
            }}
          >
            {[
              ["Open Issues", result.open_issues],
              ["Contributors", result.contributors],
              ["Stars", result.stars],
              ["Forks", result.forks],
            ].map(([title, value], i) => (
              <div
                key={i}
                style={{
                  background: "#1e293b",
                  padding: "20px",
                  borderRadius: "12px",
                }}
              >
                <h3>{title}</h3>
                <p style={{ fontSize: "26px", fontWeight: "bold" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* CHARTS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
              gap: "20px",
            }}
          >
            {/* Risk Factors Pie */}
            <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px" }}>
              <h3>Risk Factors</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={result.riskFactors} dataKey="value" outerRadius={90}>
                    {result.riskFactors.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Contributor Chart */}
            <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px" }}>
              <h3>Top Contributors</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={result.contributorsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="commits" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Health Score */}
            <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px" }}>
              <h3>Repo Health Score</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Healthy", value: 100 - result.risk_score },
                      { name: "Risk", value: result.risk_score },
                    ]}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={90}
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <p style={{ textAlign: "center", marginTop: "10px" }}>
                Health: {100 - result.risk_score}%
              </p>
            </div>
          </div>
        </>
      )}

      {/* ERROR */}
      {result && result.error && (
        <div style={{ background: "#dc2626", padding: "15px", borderRadius: "8px" }}>
          {result.error}
        </div>
      )}
    </div>
  );
}

export default GitHubRisk;