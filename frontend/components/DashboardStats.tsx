import "./Dashboard.css";

export default function DashboardStats({ stats }: any) {
  if (!stats || !stats.by_status) return null;

  return (
    <div className="stats">
      <h3>Dashboard</h3>

      <p>Total: {stats.total_tasks || 0}</p>
      <p>Todo: {stats.by_status?.todo || 0}</p>
      <p>In Progress: {stats.by_status?.in_progress || 0}</p>
      <p>Done: {stats.by_status?.done || 0}</p>
    </div>
  );
}