import React, { useEffect, useState } from "react";

function Sprints() {
  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
    velocity: "",
    progress: "",
  });

  const [sprints, setSprints] = useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("sprints")) || [];

    setSprints(saved);
  }, []);

  const saveToStorage = (updated) => {
    setSprints(updated);

    localStorage.setItem(
      "sprints",
      JSON.stringify(updated)
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();

    const newSprint = {
      id: Date.now(),
      name: formData.name,
      start: formData.start,
      end: formData.end,
      velocity: Number(formData.velocity),
      progress: Number(formData.progress),
      createdAt: new Date().toLocaleString(),
    };

    const updated = [newSprint, ...sprints];

    saveToStorage(updated);

    setFormData({
      name: "",
      start: "",
      end: "",
      velocity: "",
      progress: "",
    });
  };

  const deleteSprint = (id) => {
    const updated = sprints.filter(
      (item) => item.id !== id
    );

    saveToStorage(updated);
  };

  const markComplete = (id) => {
    const updated = sprints.map((item) =>
      item.id === id
        ? { ...item, progress: 100 }
        : item
    );

    saveToStorage(updated);
  };

  const getStatus = (progress) => {
    if (progress >= 100) return "Completed";
    if (progress > 0) return "Ongoing";
    return "Planned";
  };

  const total = sprints.length;

  const active = sprints.filter(
    (item) =>
      item.progress > 0 && item.progress < 100
  ).length;

  const completed = sprints.filter(
    (item) => item.progress >= 100
  ).length;

  const avgVelocity =
    total > 0
      ? Math.round(
          sprints.reduce(
            (sum, item) =>
              sum + item.velocity,
            0
          ) / total
        )
      : 0;

  return (
    <div>
      <h1
        style={{
          fontSize: "52px",
          marginBottom: "25px",
        }}
      >
        Sprint Management
      </h1>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        {[
          ["Total Sprints", total],
          ["Active Sprints", active],
          ["Completed", completed],
          ["Avg Velocity", `${avgVelocity} pts`],
        ].map(([title, value], index) => (
          <div
            key={index}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h3>{title}</h3>
            <p
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={handleCreate}
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ marginBottom: "18px" }}>
          Create Sprint
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "15px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Sprint Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="start"
            value={formData.start}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="end"
            value={formData.end}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="velocity"
            placeholder="Velocity"
            value={formData.velocity}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="progress"
            placeholder="Progress %"
            value={formData.progress}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: "18px",
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          + Create Sprint
        </button>
      </form>

      {/* Table */}
      <div
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ marginBottom: "18px" }}>
          Sprint List
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th align="left">Name</th>
              <th align="left">Status</th>
              <th align="left">Velocity</th>
              <th align="left">Progress</th>
              <th align="left">Dates</th>
              <th align="left">Action</th>
            </tr>
          </thead>

          <tbody>
            {sprints.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  {getStatus(item.progress)}
                </td>
                <td>
                  {item.velocity} pts
                </td>
                <td>
                  {item.progress}%
                </td>
                <td>
                  {item.start} to {item.end}
                </td>

                <td>
                  {item.progress < 100 && (
                    <button
                      onClick={() =>
                        markComplete(item.id)
                      }
                      style={{
                        background: "#16a34a",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                    >
                      Complete
                    </button>
                  )}

                  <button
                    onClick={() =>
                      deleteSprint(item.id)
                    }
                    style={{
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {sprints.length === 0 && (
              <tr>
                <td colSpan="6">
                  No sprints created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sprints;