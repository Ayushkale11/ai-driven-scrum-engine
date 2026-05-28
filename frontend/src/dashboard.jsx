import "./dashboard.css";
import React, { useEffect, useState } from "react";
import { calculateProjectRisk } from "./riskEngine";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [autoRisk, setAutoRisk] = useState({
    score: 0,
    level: "Low Risk",
  });

  useEffect(() => {
    const history =
      JSON.parse(localStorage.getItem("riskHistory")) || [];

    setHistory(history);

    const tasks =
      JSON.parse(localStorage.getItem("tasks")) || [];

    const sprints =
      JSON.parse(localStorage.getItem("sprints")) || [];

    const result = calculateProjectRisk(tasks, sprints);

    setAutoRisk(result);
  }, []);

  const totalAnalyses = history.length;

  const highRiskCount = history.filter(
    (item) => item.level === "High Risk"
  ).length;

  const avgRisk =
    totalAnalyses > 0
      ? Math.round(
          history.reduce(
            (sum, item) => sum + Number(item.score),
            0
          ) / totalAnalyses
        )
      : 0;

  const lastType =
    totalAnalyses > 0 ? history[0].type : "No Data";

  const chartData = history
    .slice(0, 6)
    .reverse()
    .map((item, index) => ({
      name: `${index + 1}`,
      risk: item.score,
    }));

  const typeData = [
    {
      type: "Code Risk",
      count: history.filter(
        (item) => item.type === "Code Risk"
      ).length,
    },
    {
      type: "Project Risk",
      count: history.filter(
        (item) => item.type === "Project Risk"
      ).length,
    },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        AI Agile Risk Dashboard
      </h1>

      {/* Cards */}
      <div className="cards">
        <div className="card card-red">
          <h2>Total Analyses</h2>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {totalAnalyses}
          </p>
        </div>

        <div className="card card-yellow">
          <h2>High Risk Alerts</h2>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {highRiskCount}
          </p>
        </div>

        <div className="card card-green">
          <h2>Average Risk</h2>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {avgRisk}%
          </p>
        </div>

        <div className="card card-blue">
          <h2>Last Analysis</h2>
          <p style={{ fontSize: "22px", fontWeight: "bold" }}>
            {lastType}
          </p>
        </div>

        {/* NEW AUTO RISK CARD */}
        <div className="card card-red">
          <h2>Auto Project Risk</h2>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {autoRisk.score}%
          </p>
          <p>{autoRisk.level}</p>
        </div>
      </div>

      {/* ALERT */}
      {autoRisk.level === "High Risk" && (
        <div
          style={{
            background: "#dc2626",
            padding: "12px",
            borderRadius: "8px",
            marginTop: "20px",
            color: "white",
          }}
        >
          ⚠ High Project Risk Detected!
        </div>
      )}

      {/* Chart 1 */}
      <div className="chart-box">
        <h2>Recent Risk Trend</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="risk"
              stroke="#ef4444"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2 */}
      <div className="chart-box">
        <h2>Analysis Type Distribution</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={typeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="chart-box">
        <h2>Recent Activity</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">Type</th>
              <th align="left">Score</th>
              <th align="left">Status</th>
              <th align="left">Date</th>
            </tr>
          </thead>

          <tbody>
            {history.slice(0, 5).map((item, index) => (
              <tr key={index}>
                <td>{item.type}</td>
                <td>{item.score}%</td>
                <td>{item.level}</td>
                <td>{item.date}</td>
              </tr>
            ))}

            {history.length === 0 && (
              <tr>
                <td colSpan="4">No analysis history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;