"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, useCallback } from "react";
import { request } from "@/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  DragEndEvent,
  rectIntersection,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskStatus = "todo" | "in_progress" | "done";

type TasksByStatus = Record<TaskStatus, Task[]>;

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: string;
  assigned_to: { id: number; name: string } | null;
  created_by: { id: number; name: string };
}

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
}

function SortableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card p-4 mb-3 cursor-move group"
    >
      <p className="font-semibold text-main mb-2">{task.title}</p>
      <p className="text-sm text-muted-foreground text-subtext mb-3 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground text-subtext">
        <span className="capitalize">Priority: {task.priority}</span>
        <span>Assigned: {task.assigned_to?.name || "None"}</span>
      </div>
    </div>
  );
}

function DroppableColumn({ id, title, tasks }: { id: string; title: string; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-96 card p-4 overflow-y-auto transition-colors ${
        isOver ? 'bg-blue-50 border-blue-300 shadow-clean-lg' : ''
      }`}
    >
      <h2 className="font-bold text-main mb-4 sticky top-0 bg-surface pb-2 text-lg">{title}</h2>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <SortableTask key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-subtext">
            No tasks yet
          </div>
        )}
      </SortableContext>
    </div>
  );
}

export default function ProjectPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<TasksByStatus | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const fetchTasks = useCallback(async () => {
    try {
      const res = await request(`/project/${id}/tasks`);
      setTasks(typeof res === 'object' && res !== null ? res : { todo: [], in_progress: [], done: [] });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks({ todo: [], in_progress: [], done: [] });
    }
  }, [id]);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await request(`/project/${id}/members`);
      setMembers(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      setMembers([]);
    }
  }, [id]);

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, [fetchTasks, fetchMembers]);

  const createTask = async () => {
    if (!title) return;
    setLoading(true);
    try {
      const res = await request(`/project/${id}/tasks`, "POST", {
        title,
        description: desc,
        priority: "medium",
        status: "todo",
        assigned_to: null,
      });
      if (res.id) {
        setTitle("");
        setDesc("");
        fetchTasks();
      } else {
        setError(res.message || "Failed to create task");
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      setError("Failed to create task");
      setTimeout(() => setError(""), 5000);
    }
    setLoading(false);
  };

  const addMember = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await request(`/project/${id}/members`, "POST", { email });
      if (res.user_id) {
        setEmail("");
        fetchMembers();
      } else {
        setError(res.message || "Failed to add member");
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Failed to add member:", error);
      setError("Failed to add member");
      setTimeout(() => setError(""), 5000);
    }
    setLoading(false);
  };

  const removeMember = async (userId: number) => {
    setLoading(true);
    try {
      const res = await request(`/project/${id}/members/${userId}`, "DELETE");
      if (res.message) {
        fetchMembers();
      } else {
        setError("Failed to remove member");
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Failed to remove member:", error);
      setError("Failed to remove member");
      setTimeout(() => setError(""), 5000);
    }
    setLoading(false);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('Drag end:', { active: active.id, over: over?.id });
    if (!over || !tasks) return;

    const taskId = active.id as number;
    const newStatus = over.id as string as TaskStatus;
    const validStatuses: TaskStatus[] = ["todo", "in_progress", "done"];

    if (!validStatuses.includes(newStatus)) {
      console.warn(`Ignored invalid status: ${newStatus}`);
      return;
    }

    // Find current status
    let currentStatus: TaskStatus | null = null;
    let taskToMove: Task | null = null;

    for (const status of validStatuses) {
      const task = tasks[status].find((t) => t.id === taskId);
      if (task) {
        currentStatus = status;
        taskToMove = task;
        break;
      }
    }

    console.log('Status change:', { taskId, currentStatus, newStatus });

    if (!currentStatus || currentStatus === newStatus || !taskToMove) return;

    if (currentStatus === "done") {
      setError("Cannot move tasks out of 'Done' status");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const updatedTasks: TasksByStatus = {
      todo: [...tasks.todo],
      in_progress: [...tasks.in_progress],
      done: [...tasks.done],
    };

    updatedTasks[currentStatus] = updatedTasks[currentStatus].filter((t) => t.id !== taskId);
    updatedTasks[newStatus] = [
      ...updatedTasks[newStatus],
      { ...taskToMove, status: newStatus },
    ];

    setTasks(updatedTasks);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await request(`/project/${id}/tasks/${taskId}`, "PATCH", { status: newStatus });
      if (!res.id) {
        // Revert on failure
        setTasks(tasks);
        setError(res.message || "Failed to update task");
        setTimeout(() => setError(""), 5000); // Clear after 5 seconds
      }
    } catch (error) {
      // Revert on error
      setTasks(tasks);
      console.error("Failed to update task:", error);
      setError("Failed to update task");
      setTimeout(() => setError(""), 5000);
    }
  };

  if (!tasks) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
        <p className="text-muted-foreground text-subtext">Loading project...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-7xl mx-auto">
        {loading && <div className="mb-4 text-blue-500 text-subtext">Loading...</div>}
        {error && <div className="mb-4 text-red-500 bg-red-50 border border-red-200 p-3 rounded-lg text-subtext">{error}</div>}

        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 text-subtext font-medium flex items-center gap-2">
            ← Back to Projects
          </Link>
        </div>

        {/* Members */}
        <div className="card p-6 mb-8">
          <h1 className="text-3xl font-bold text-main mb-6">Project Members</h1>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                placeholder="Enter member email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input flex-1"
              />
              <button onClick={addMember} className="btn-primary whitespace-nowrap">
                Add Member
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <div key={member.id} className="card p-4">
                <p className="font-semibold text-main mb-1">{member.name}</p>
                <p className="text-sm text-muted-foreground text-subtext mb-2">{member.email}</p>
                <p className="text-xs text-muted-foreground text-subtext capitalize mb-3">Role: {member.role}</p>
                <button
                  onClick={() => removeMember(member.id)}
                  className="btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                >
                  Remove
                </button>
              </div>
            ))}
            {members.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground text-subtext">
                No members added yet
              </div>
            )}
          </div>
        </div>

        {/* Tasks */}
        <div className="card p-6 mb-8">
          <h1 className="text-3xl font-bold text-main mb-6">Tasks</h1>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input flex-1"
              />
              <input
                placeholder="Task description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="input flex-1"
              />
              <button onClick={createTask} className="btn-primary whitespace-nowrap">
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="card p-6">
          <h1 className="text-3xl font-bold text-main mb-6">Kanban Board</h1>
          <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={(event) => {
              if (!tasks) return;
              const taskId = event.active.id as number;
              const validStatuses: TaskStatus[] = ["todo", "in_progress", "done"];
              for (const status of validStatuses) {
                const task = tasks[status].find((t) => t.id === taskId);
                if (task) {
                  setActiveTask(task);
                  break;
                }
              }
            }}
            onDragEnd={(event) => {
              setActiveTask(null);
              handleDragEnd(event);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-96">
              {(["todo", "in_progress", "done"] as TaskStatus[]).map((col) => (
                <DroppableColumn
                  key={col}
                  id={col}
                  title={col.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  tasks={tasks[col] || []}
                />
              ))}
            </div>
            <DragOverlay>
              {activeTask ? (
                <div className="card p-4 shadow-clean-xl rotate-3 bg-surface">
                  <p className="font-semibold text-main">{activeTask.title}</p>
                  <p className="text-sm text-muted-foreground text-subtext mt-1">{activeTask.description}</p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}