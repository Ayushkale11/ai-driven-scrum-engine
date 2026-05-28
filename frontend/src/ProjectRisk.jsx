// ProjectRisk.jsx

import React, { useState } from "react";

function ProjectRisk() {
  const [formData, setFormData] = useState({
    velocity: "",
    pending: "",
    delayed: "",
    team: "",
    daysleft: "",
    scope: "",
    critical: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let risk = 0;

    const velocity = Number(formData.velocity);
    const pending = Number(formData.pending);
    const delayed = Number(formData.delayed);
    const team = Number(formData.team);
    const daysleft = Number(formData.daysleft);
    const scope = Number(formData.scope);
    const critical = Number(formData.critical);

    if (velocity < 20) risk += 20;
    if (pending > 15) risk += 20;
    if (delayed > 5) risk += 20;
    if (team < 4) risk += 10;
    if (daysleft < 7) risk += 15;
    if (scope > 3) risk += 10;
    if (critical > 2) risk += 20;

    risk = Math.min(risk, 100);

    let level = "Low Risk";

    if (risk >= 70) {
      level = "High Risk";
    } else if (risk >= 40) {
      level = "Medium Risk";
    }

    let suggestion = "";

    if (risk >= 70) {
      suggestion =
        "Urgent intervention required. Reduce scope, fix blockers, and rebalance workload.";
    } else if (risk >= 40) {
      suggestion =
        "Monitor sprint closely and resolve delayed tasks quickly.";
    } else {
      suggestion =
        "Project health is stable. Continue regular tracking.";
    }

    setResult({
      score: `${risk}%`,
      level,
      suggestion,
    });

    const history =
      JSON.parse(localStorage.getItem("riskHistory")) || [];

    history.unshift({
      type: "Project Risk",
      score: risk,
      level: level,
      date: new Date().toLocaleString(),
    });

    localStorage.setItem(
      "riskHistory",
      JSON.stringify(history)
    );
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px", fontSize: "42px" }}>
        Project Risk Analysis
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "12px",
          maxWidth: "700px",
        }}
      >
        {[
          ["velocity", "Sprint Velocity"],
          ["pending", "Pending Tasks"],
          ["delayed", "Delayed Tasks"],
          ["team", "Team Size"],
          ["daysleft", "Days Left"],
          ["scope", "Scope Changes"],
          ["critical", "Critical Bugs"],
        ].map(([name, label]) => (
          <div key={name} style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
              }}
            >
              {label}
            </label>

            <input
              type="number"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                fontSize: "15px",
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            background: "#16a34a",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Analyze Project Risk
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: "25px",
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
            maxWidth: "700px",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>
            Prediction Result
          </h3>

          <p>
            <strong>Risk Score:</strong> {result.score}
          </p>

          <p>
            <strong>Status:</strong> {result.level}
          </p>

          <p>
            <strong>Suggestion:</strong> {result.suggestion}
          </p>
        </div>
      )}
    </div>
  );
}

export default ProjectRisk;