"use client";

import { useEffect, useState } from "react";
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

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
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
      className="border border-gray-300 p-4 mb-2 bg-white rounded cursor-move hover:shadow-md transition-shadow"
    >
      <p className="font-semibold">{task.title}</p>
      <p className="text-sm text-gray-600">{task.description}</p>
      <small className="text-xs text-gray-500">
        Priority: {task.priority} | Assigned: {task.assigned_to?.name || "None"}
      </small>
    </div>
  );
}

function DroppableColumn({ id, title, tasks }: { id: string; title: string; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 h-96 border border-gray-300 rounded p-4 bg-gray-50 overflow-y-auto ${
        isOver ? 'bg-blue-50 border-blue-300' : ''
      }`}
    >
      <h2 className="font-bold mb-4 sticky top-0 bg-gray-50 pb-2">{title}</h2>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <SortableTask key={task.id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}

export default function ProjectPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<{ [key: string]: Task[] } | null>(null);
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

  const fetchTasks = async () => {
    try {
      const res = await request(`/project/${id}/tasks`);
      setTasks(typeof res === 'object' && res !== null ? res : { todo: [], in_progress: [], done: [] });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks({ todo: [], in_progress: [], done: [] });
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await request(`/project/${id}/members`);
      setMembers(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, [id]);

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
      alert("Failed to create task");
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
        alert(res.message || "Failed to add member");
      }
    } catch (error) {
      console.error("Failed to add member:", error);
      alert("Failed to add member");
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
        alert("Failed to remove member");
      }
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member");
    }
    setLoading(false);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('Drag end:', { active: active.id, over: over?.id });
    if (!over) return;

    const taskId = active.id as number;
    const newStatus = over.id as string;

    // Find current status
    let currentStatus = "";
    let taskToMove: Task | null = null;
    for (const status in tasks) {
      const task = tasks[status].find(t => t.id === taskId);
      if (task) {
        currentStatus = status;
        taskToMove = task;
        break;
      }
    }
    console.log('Status change:', { taskId, currentStatus, newStatus });

    if (currentStatus === newStatus || !taskToMove) return;

    // Optimistic update: immediately move the task
    const updatedTasks = { ...tasks };
    updatedTasks[currentStatus] = updatedTasks[currentStatus].filter(t => t.id !== taskId);
    updatedTasks[newStatus] = [...updatedTasks[newStatus], { ...taskToMove, status: newStatus }];
    setTasks(updatedTasks);

    try {
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

  if (!tasks) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      {loading && <div className="mb-4 text-blue-500">Loading...</div>}
      {error && <div className="mb-4 text-red-500 bg-red-100 p-2 rounded">{error}</div>}

      <div className="mb-4">
        <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
          ← Back to Projects
        </Link>
      </div>

      {/* Members */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Project Members</h1>
        <div className="mb-4">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 mr-2"
          />
          <button onClick={addMember} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Member
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member.id} className="border border-gray-300 p-4 rounded bg-white">
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-gray-600">{member.email}</p>
              <p className="text-xs text-gray-500">Role: {member.role}</p>
              <button
                onClick={() => removeMember(member.id)}
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>
        <div className="mb-4">
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 p-2 mr-2"
          />
          <input
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border border-gray-300 p-2 mr-2"
          />
          <button onClick={createTask} className="bg-green-500 text-white px-4 py-2 rounded">
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban */}
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={(event) => {
          const taskId = event.active.id as number;
          for (const status in tasks) {
            const task = tasks[status].find(t => t.id === taskId);
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
        <div className="flex gap-4 h-96">
          {["todo", "in_progress", "done"].map((col) => (
            <DroppableColumn
              key={col}
              id={col}
              title={col.replace("_", " ").toUpperCase()}
              tasks={tasks[col] || []}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="border border-gray-300 p-4 bg-white rounded shadow-lg rotate-3">
              <p className="font-semibold">{activeTask.title}</p>
              <p className="text-sm text-gray-600">{activeTask.description}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}