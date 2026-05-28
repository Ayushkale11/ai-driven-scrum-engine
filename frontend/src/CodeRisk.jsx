// CodeRisk.jsx

import React, { useState } from "react";

function CodeRisk() {
  const [formData, setFormData] = useState({
    loc: "",
    complexity: "",
    developers: "",
    bugs: "",
    commits: "",
    coverage: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict-code-risk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loc: Number(formData.loc),
            complexity: Number(formData.complexity),
            developers: Number(formData.developers),
            bugs: Number(formData.bugs),
            commits: Number(formData.commits),
            coverage: Number(formData.coverage),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API failed");
      }

      const data = await response.json();

      const risk = Math.round(
        data.analysis.risk_probability * 100
      );

      let level = "Low Risk";

      if (risk >= 70) level = "High Risk";
      else if (risk >= 40) level = "Medium Risk";

      let suggestion = "";

      if (risk >= 70) {
        suggestion =
          "Increase testing, refactor complex modules, and review recent commits.";
      } else if (risk >= 40) {
        suggestion =
          "Monitor risky modules and improve code quality checks.";
      } else {
        suggestion =
          "Code risk is acceptable. Continue regular monitoring.";
      }

      setResult({
        score: `${risk}%`,
        level,
        suggestion,
      });

      const history =
        JSON.parse(localStorage.getItem("riskHistory")) || [];

      history.unshift({
        type: "Code Risk",
        score: risk,
        level: level,
        date: new Date().toLocaleString(),
      });

      localStorage.setItem(
        "riskHistory",
        JSON.stringify(history)
      );
    } catch (error) {
      setResult({
        score: "Error",
        level: "Backend Not Connected",
        suggestion:
          "Check if FastAPI server is running properly.",
      });
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px", fontSize: "42px" }}>
        Code Risk Analysis
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
          ["loc", "Lines of Code"],
          ["complexity", "Complexity Score"],
          ["developers", "Number of Developers"],
          ["bugs", "Past Bugs"],
          ["commits", "Recent Commits"],
          ["coverage", "Test Coverage %"],
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
            background: "#2563eb",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Analyze Risk
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

export default CodeRisk;