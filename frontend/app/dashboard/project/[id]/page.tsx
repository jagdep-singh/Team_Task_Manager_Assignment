"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getTasks,
  updateTaskStatus,
  createTask,
} from "@/lib/services/task";
import { getDashboard, getMembers } from "@/lib/services/project";

export default function ProjectPage() {
  const { id } = useParams();

  const [tasks, setTasks] = useState<any>({});
  const [members, setMembers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    if (id) {
      loadAll();
    }
  }, [id]);

  const loadAll = async () => {
    await Promise.all([loadTasks(), loadMembers(), loadStats()]);
  };

  const loadTasks = async () => {
    const data = await getTasks(id as string);
    setTasks(data);
  };

  const loadMembers = async () => {
    const data = await getMembers(id as string);
    setMembers(data);
  };

  const loadStats = async () => {
    const data = await getDashboard(id as string);
    setStats(data);
  };

  const moveTask = async (taskId: number, newStatus: string) => {
    const res = await updateTaskStatus(id as string, taskId, newStatus);
    console.log("update response:", res);

    await loadAll();
  };

  const handleCreateTask = async () => {
    if (!title.trim()) return;

    await createTask(id as string, {
      title,
      description,
      priority: "medium",
      status: "todo",
      assigned_to: assignedTo ? Number(assignedTo) : null,
    });

    setTitle("");
    setDescription("");
    setAssignedTo("");

    await loadAll();
  };

  const renderColumn = (title: string, key: string) => (
    <div style={{ flex: 1 }}>
      <h2>{title}</h2>

      {(tasks[key] || []).map((t: any) => (
        <div
          key={t.id}
          style={{
            border: "1px solid #444",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>{t.title}</strong>
          </p>
          <p>{t.description}</p>
          <p>Assigned: {t.assigned_to?.name || "None"}</p>

          <div style={{ display: "flex", gap: "5px" }}>
            {key === "todo" && (
              <button onClick={() => moveTask(t.id, "in_progress")}>
                → In Progress
              </button>
            )}

            {key === "in_progress" && (
              <>
                <button onClick={() => moveTask(t.id, "todo")}>
                  ← Todo
                </button>
                <button onClick={() => moveTask(t.id, "done")}>
                  → Done
                </button>
              </>
            )}

            {key === "done" && (
              <button onClick={() => moveTask(t.id, "in_progress")}>
                ← In Progress
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </button>

      
      <div style={{ marginBottom: "20px" }}>
        <h2>Create Task</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <button onClick={handleCreateTask}>Create Task</button>
      </div>

      
      {stats && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Dashboard</h3>
          <p>Total: {stats.total_tasks}</p>
          <p>Todo: {stats.by_status.todo}</p>
          <p>In Progress: {stats.by_status.in_progress}</p>
          <p>Done: {stats.by_status.done}</p>
        </div>
      )}
      {tasks && (
        <div style={{ marginBottom: "20px" }}>
            <h3>Tasks per User</h3>

            {Object.entries(
            [...(tasks.todo || []), ...(tasks.in_progress || []), ...(tasks.done || [])]
                .reduce((acc: any, task: any) => {
                const name = task.assigned_to?.name || "Unassigned";
                acc[name] = (acc[name] || 0) + 1;
                return acc;
                }, {})
            ).map(([name, count]: any) => (
            <p key={name}>
                {name}: {count}
            </p>
            ))}
        </div>
        )}

      
      <div style={{ display: "flex", gap: "20px" }}>
        {renderColumn("Todo", "todo")}
        {renderColumn("In Progress", "in_progress")}
        {renderColumn("Done", "done")}
      </div>
    </div>
  );
}