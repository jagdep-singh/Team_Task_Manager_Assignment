"use client";

import "./Stats.css";

export default function Stats({ stats }: any) {
  if (!stats || !stats.by_status) return null;

  const perUser: { name: string; count: number }[] = stats.tasks_per_user || [];

  return (
    <div className="stats">
      {/* Row 1 — status counts */}
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

      <div className="stat stat--overdue">
        <span>Overdue</span>
        <h2>{stats.overdue_tasks || 0}</h2>
      </div>

      {/* Row 2 — tasks per user */}
      {perUser.length > 0 && (
        <div className="stat stat--wide">
          <span>Tasks per Member</span>
          <div className="stat-per-user">
            {perUser.map((u) => (
              <div key={u.name} className="stat-user-row">
                <span className="stat-user-name">{u.name}</span>
                <span className="stat-user-count">{u.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}