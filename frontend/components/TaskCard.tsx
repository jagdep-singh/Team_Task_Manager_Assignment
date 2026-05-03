export default function TaskCard({ task, onMove }: any) {
  return (
    <div className="task-card">
      <p><strong>{task.title}</strong></p>
      <p>{task.description}</p>
      <p>Assigned: {task.assigned_to?.name || "None"}</p>

      <div className="task-actions">
        {task.status === "todo" && (
          <button onClick={() => onMove(task.id, "in_progress")}>
            → In Progress
          </button>
        )}

        {task.status === "in_progress" && (
          <>
            <button onClick={() => onMove(task.id, "todo")}>← Todo</button>
            <button onClick={() => onMove(task.id, "done")}>→ Done</button>
          </>
        )}

        {task.status === "done" && (
          <button onClick={() => onMove(task.id, "in_progress")}>
            ← In Progress
          </button>
        )}
      </div>
    </div>
  );
}