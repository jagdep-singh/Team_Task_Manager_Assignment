"use client";

import "./Stats.css";
export default function Stats({ stats }: any) {
  if (!stats || !stats.by_status) return null;

  return (
    <div className="stats">
      <div className="stat">
        <span>Total</span>
        <h2>{stats.total_tasks || 0}</h2>
      </div>

      <div className="stat">
        <span>Todo</span>
        <h2>{stats.by_status?.todo || 0}</h2>
      </div>

      <div className="stat">
        <span>In Progress</span>
        <h2>{stats.by_status?.in_progress || 0}</h2>
      </div>

      <div className="stat">
        <span>Done</span>
        <h2>{stats.by_status?.done || 0}</h2>
      </div>
    </div>
  );
}