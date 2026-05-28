import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>AI Agile</h2>

      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/sprints">Sprints</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/riskanalysis">Risk Analysis</Link>
        <Link to="/code-risk">Code Risk</Link>
        <Link to="/project-risk">Project Risk</Link>
        <Link to="/github-risk">GitHub Risk</Link>
      </nav>
    </div>
  );
}

export default Sidebar;