export function calculateProjectRisk(tasks, sprints) {
  let risk = 0;

  const totalTasks = tasks.length;
  const todo = tasks.filter(t => t.status === "To Do").length;
  const progress = tasks.filter(t => t.status === "In Progress").length;
  const done = tasks.filter(t => t.status === "Done").length;

  const highPriority = tasks.filter(t => t.priority === "High").length;

  const activeSprint = sprints.find(
    s => s.progress < 100
  );

  // Task-based risk
  if (totalTasks > 0) {
    if (todo / totalTasks > 0.5) risk += 25;
    if (highPriority > 5) risk += 20;
    if (done / totalTasks < 0.3) risk += 20;
  }

  // Sprint-based risk
  if (activeSprint) {
    if (activeSprint.progress < 40) risk += 25;

    const today = new Date();
    const end = new Date(activeSprint.end);

    const daysLeft =
      (end - today) / (1000 * 60 * 60 * 24);

    if (daysLeft < 5) risk += 20;
  }

  risk = Math.min(risk, 100);

  let level = "Low Risk";

  if (risk >= 70) level = "High Risk";
  else if (risk >= 40) level = "Medium Risk";

  return {
    score: risk,
    level,
  };
}