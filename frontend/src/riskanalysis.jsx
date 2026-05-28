import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS1 = ["#ef4444", "#facc15", "#22c55e"];
const COLORS2 = ["#3b82f6", "#a855f7"];

function RiskAnalysis() {
  const [riskData, setRiskData] = useState([]);
  const [typeData, setTypeData] = useState([]);

  useEffect(() => {
    const history =
      JSON.parse(localStorage.getItem("riskHistory")) || [];

    const high = history.filter(
      (item) => item.level === "High Risk"
    ).length;

    const medium = history.filter(
      (item) => item.level === "Medium Risk"
    ).length;

    const low = history.filter(
      (item) => item.level === "Low Risk"
    ).length;

    const code = history.filter(
      (item) => item.type === "Code Risk"
    ).length;

    const project = history.filter(
      (item) => item.type === "Project Risk"
    ).length;

    setRiskData([
      { name: "High Risk", value: high },
      { name: "Medium Risk", value: medium },
      { name: "Low Risk", value: low },
    ]);

    setTypeData([
      { name: "Code Risk", value: code },
      { name: "Project Risk", value: project },
    ]);
  }, []);

  const renderLegend = (data, colors) => (
    <div
      style={{
        marginTop: "15px",
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
      }}
    >
      {data.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "3px",
              backgroundColor:
                colors[index % colors.length],
            }}
          ></div>

          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h1
        style={{
          fontSize: "52px",
          marginBottom: "30px",
        }}
      >
        Risk Analysis
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "14px",
          }}
        >
          <h2>Code Risk Analysis</h2>
          <p>
            Predict bug-prone modules and quality
            issues using AI.
          </p>

          <Link to="/code-risk">
            <button
              style={{
                marginTop: "15px",
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Analyze Code
            </button>
          </Link>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "14px",
          }}
        >
          <h2>Project Risk Analysis</h2>
          <p>
            Predict delays, workload pressure, and
            sprint bottlenecks.
          </p>

          <Link to="/project-risk">
            <button
              style={{
                marginTop: "15px",
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Analyze Project
            </button>
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(400px,1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "14px",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            Risk Level Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <PieChart>
              <Pie
                data={riskData}
                dataKey="value"
                outerRadius={110}
                label
              >
                {riskData.map((item, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS1[
                        index % COLORS1.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {renderLegend(riskData, COLORS1)}
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "14px",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            Analysis Type Split
          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <PieChart>
              <Pie
                data={typeData}
                dataKey="value"
                outerRadius={110}
                label
              >
                {typeData.map((item, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS2[
                        index % COLORS2.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {renderLegend(typeData, COLORS2)}
        </div>
      </div>
    </div>
  );
}

export default RiskAnalysis;