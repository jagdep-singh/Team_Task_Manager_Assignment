"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./TaskCard.css";

const order = ["low", "medium", "high"];

export default function TaskCard({
  task,
  onPriorityChange,
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(task.id),
  });

  const style = {
    // Translate only (no scale) — prevents jitter during drag
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : undefined,
    position: isDragging ? ("relative" as const) : undefined,
  };

  const handlePriorityCycle = () => {
    const currentIndex = order.indexOf(task.priority);
    const next = order[(currentIndex + 1) % order.length];
    onPriorityChange(task.id, next);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card${isDragging ? " task-card--dragging" : ""}`}
    >
      {/* DRAG HANDLE */}
      <div className="drag-handle" {...attributes} {...listeners}>
        ⋮⋮
      </div>

      {/* CONTENT */}
      <div className="task-content">
        <div className="task-top">
          <h4 className="task-title">{task.title}</h4>

          <span
            className={`priority clickable ${task.priority}`}
            onClick={handlePriorityCycle}
          >
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}

        <div className="task-meta">
          <span>{task.assigned_to?.name || "Unassigned"}</span>
          <span>{task.created_by?.name}</span>
        </div>

        {task.due_date && (
          <div className="task-due">
            Due {new Date(task.due_date).toDateString()}
          </div>
        )}
      </div>
    </div>
  );
}