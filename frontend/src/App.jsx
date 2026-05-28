import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GitHubRisk from "./GitHubRisk";
import "./App.css";

import Dashboard from "./dashboard";
import RiskAnalysis from "./riskanalysis";
import CodeRisk from "./CodeRisk";
import ProjectRisk from "./ProjectRisk";
import Tasks from "./tasks";
import Sprints from "./sprints";
import Sidebar from "./sidebar";

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />

        <div className="main">
          <h1 className="title">AI Risk Detection Platform</h1>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/riskanalysis" element={<RiskAnalysis />} />
            <Route path="/code-risk" element={<CodeRisk />} />
            <Route path="/project-risk" element={<ProjectRisk />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/sprints" element={<Sprints />} />
            <Route path="/github-risk" element={<GitHubRisk />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;