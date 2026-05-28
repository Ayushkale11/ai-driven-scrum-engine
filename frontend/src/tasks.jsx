import React, { useEffect, useState } from "react";

function Tasks() {
  const [formData, setFormData] = useState({
    title: "",
    assignee: "",
    priority: "Medium",
    sprint: "",
  });

  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);

  useEffect(() => {
    const savedTasks =
      JSON.parse(localStorage.getItem("tasks")) || [];

    const savedSprints =
      JSON.parse(localStorage.getItem("sprints")) || [];

    setTasks(savedTasks);
    setSprints(savedSprints);
  }, []);

  const saveTasks = (updated) => {
    setTasks(updated);

    localStorage.setItem(
      "tasks",
      JSON.stringify(updated)
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addTask = (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      title: formData.title,
      assignee: formData.assignee,
      priority: formData.priority,
      sprint: formData.sprint,
      status: "To Do",
      createdAt: new Date().toLocaleString(),
    };

    const updated = [newTask, ...tasks];

    saveTasks(updated);

    setFormData({
      title: "",
      assignee: "",
      priority: "Medium",
      sprint: "",
    });
  };

  const updateStatus = (id, newStatus) => {
    const updated = tasks.map((task) =>
      task.id === id
        ? { ...task, status: newStatus }
        : task
    );

    saveTasks(updated);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter(
      (task) => task.id !== id
    );

    saveTasks(updated);
  };

  const getTasks = (status) =>
    tasks.filter((task) => task.status === status);

  const todo = getTasks("To Do").length;
  const progress = getTasks("In Progress").length;
  const done = getTasks("Done").length;
  const total = tasks.length;

  const cardStyle = {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
  };

  const columnStyle = {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    minHeight: "400px",
  };

  const taskBox = {
    background: "#334155",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "12px",
  };

  return (
    <div>
      <h1
        style={{
          fontSize: "52px",
          marginBottom: "25px",
        }}
      >
        Task Management
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
          ["Total Tasks", total],
          ["To Do", todo],
          ["In Progress", progress],
          ["Done", done],
        ].map(([title, value], index) => (
          <div key={index} style={cardStyle}>
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

      {/* Add Task */}
      <form
        onSubmit={addTask}
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ marginBottom: "18px" }}>
          Add Task
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
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="assignee"
            placeholder="Assignee"
            value={formData.assignee}
            onChange={handleChange}
            required
          />

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select
            name="sprint"
            value={formData.sprint}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Sprint
            </option>

            {sprints.map((item) => (
              <option
                key={item.id}
                value={item.name}
              >
                {item.name}
              </option>
            ))}
          </select>
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
          + Add Task
        </button>
      </form>

      {/* Kanban */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        {[
          "To Do",
          "In Progress",
          "Done",
        ].map((status) => (
          <div key={status} style={columnStyle}>
            <h2
              style={{
                marginBottom: "18px",
              }}
            >
              {status}
            </h2>

            {getTasks(status).map((task) => (
              <div
                key={task.id}
                style={taskBox}
              >
                <h3>{task.title}</h3>

                <p>
                  <strong>Owner:</strong>{" "}
                  {task.assignee}
                </p>

                <p>
                  <strong>Priority:</strong>{" "}
                  {task.priority}
                </p>

                <p>
                  <strong>Sprint:</strong>{" "}
                  {task.sprint}
                </p>

                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {status !== "To Do" && (
                    <button
                      onClick={() =>
                        updateStatus(
                          task.id,
                          "To Do"
                        )
                      }
                    >
                      To Do
                    </button>
                  )}

                  {status !==
                    "In Progress" && (
                    <button
                      onClick={() =>
                        updateStatus(
                          task.id,
                          "In Progress"
                        )
                      }
                    >
                      Progress
                    </button>
                  )}

                  {status !== "Done" && (
                    <button
                      onClick={() =>
                        updateStatus(
                          task.id,
                          "Done"
                        )
                      }
                    >
                      Done
                    </button>
                  )}

                  <button
                    onClick={() =>
                      deleteTask(task.id)
                    }
                    style={{
                      background:
                        "#dc2626",
                      color: "white",
                      border: "none",
                      padding:
                        "6px 10px",
                      borderRadius:
                        "6px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {getTasks(status).length ===
              0 && (
              <p>
                No tasks in this
                column.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;