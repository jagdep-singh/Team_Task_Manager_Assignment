"use client";

import Button from "./Button";
import "./CreateTask.css";

export default function CreateTask({
  open,
  setOpen,
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  assignedTo,
  setAssignedTo,
  dueDate,
  setDueDate,
  members,
  onCreate,
}: any) {
  if (!open) return null;

  return (
    <div className="create-overlay" onClick={() => setOpen(false)}>
      <div
        className="create-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Create Task</h2>

        {/* INPUTS */}
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* ROW */}
        <div className="create-row">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Unassigned</option>
            {members.map((m: any) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* 🔥 FIX: ACTION BUTTONS */}
        <div className="create-actions">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={onCreate} disabled={!title.trim()}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}