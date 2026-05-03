export default function DashboardStats({ stats }: any) {
  if (!stats) return null;

  return (
    <div className="stats">
      <h3>Dashboard</h3>
      <p>Total: {stats.total_tasks}</p>
      <p>Todo: {stats.by_status.todo}</p>
      <p>In Progress: {stats.by_status.in_progress}</p>
      <p>Done: {stats.by_status.done}</p>
    </div>
  );
}