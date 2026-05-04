"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import Navbar from "@/components/Navbar";
import Column from "@/components/Column";
import Stats from "@/components/Stats";
import CreateTask from "@/components/CreateTask";
import AddMember from "@/components/AddMember";
import Button from "@/components/Button";

import {
  getProjectDashboard,
  getMembers,
  addMember,
} from "@/lib/services/project";

import {
  getTasks,
  createTask,
  moveTask,
} from "@/lib/services/task";

import "./project.css";
import { useRouter } from "next/navigation";



export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();

    const id = Array.isArray(params?.id)
      ? params.id[0]
      : params?.id;

    if (!id) return null; 

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const [tasks, setTasks] = useState<{
    todo: any[];
    in_progress: any[];
    done: any[];
  }>({
    todo: [],
    in_progress: [],
    done: [],
  });

  const [stats, setStats] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [taskData, statData, memberData] = await Promise.all([
        getTasks(id),
        getProjectDashboard(id),
        getMembers(id),
      ]);

      setTasks({
        todo: taskData?.todo || [],
        in_progress: taskData?.in_progress || [],
        done: taskData?.done || [],
      });

      setStats(statData || null);

      const membersArray = Array.isArray(memberData)
        ? memberData
        : memberData?.members || [];

      setMembers(membersArray);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (email: string) => {
    await addMember(id, email);
    loadAll();
  };

  const handlePriorityChange = (taskId: number, newPriority: string) => {
    setTasks((prev: any) => ({
      todo: prev.todo.map((t: any) =>
        t.id === taskId ? { ...t, priority: newPriority } : t
      ),
      in_progress: prev.in_progress.map((t: any) =>
        t.id === taskId ? { ...t, priority: newPriority } : t
      ),
      done: prev.done.map((t: any) =>
        t.id === taskId ? { ...t, priority: newPriority } : t
      ),
    }));
  };

  const handleDragEnd = async ({ active, over }: any) => {
    if (!over) return;

    const taskId = Number(active.id);

    const taskStatusKeys = ["todo", "in_progress", "done"] as const;
    type TaskStatus = (typeof taskStatusKeys)[number];

    let newStatus: TaskStatus | undefined;

    if (taskStatusKeys.includes(over.id as TaskStatus)) {
      newStatus = over.id as TaskStatus;
    } else {
      newStatus = over.data?.current?.sortable?.containerId as TaskStatus | undefined;
    }

    if (!newStatus) return;

    setTasks((prev: any) => {
      let moved: any = null;

      const updated = {
        todo: [...(prev.todo || [])],
        in_progress: [...(prev.in_progress || [])],
        done: [...(prev.done || [])],
      };

      for (const key of taskStatusKeys) {
        updated[key] = updated[key].filter((t: any) => {
          if (t.id === taskId) {
            moved = t;
            return false;
          }
          return true;
        });
      }

      if (moved && newStatus) {
        updated[newStatus].push({
          ...moved,
          status: newStatus,
        });
      }

      return updated;
    });

    const res = await moveTask(id, taskId, newStatus);

      if (res?.error === "NOT_ALLOWED") {
        setErrorMsg("You don’t have permission to move this task");
        loadAll();
        setTimeout(() => setErrorMsg(""), 2500);
        return;
      }

      if (res?.error) {
        setErrorMsg("Something went wrong");
        loadAll();
        return;
      }
  };

  const handleCreate = async () => {
    if (!title.trim()) return;

    await createTask(id, {
      title,
      description,
      priority,
      assigned_to: assignedTo || null,
      due_date: dueDate || null,
    });

    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssignedTo("");
    setDueDate("");
    setOpen(false);

    loadAll();
  };

  return (
    <>
      <div className="project-page">
        <Navbar />
          {errorMsg && (
                  <div className="toast-error">
                    {errorMsg}
                  </div>
          )}

        {/* HEADER */}
        <div className="task-header">
          <div className="task-header-left">
            <button
              className="back-btn"
              onClick={() => router.push("/dashboard")}
            >
              ← Back
            </button>

            <div>
              <h1>Tasks</h1>
              <div className="task-sub">
                {stats?.total_tasks || 0} total · {stats?.by_status?.done || 0} completed
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="ghost" onClick={() => setShowMembers(true)}>
              View Team
            </Button>

            <Button variant="ghost" onClick={() => setMemberOpen(true)}>
              + Add Member
            </Button>

            <Button onClick={() => setOpen(true)}>
              + Create Task
            </Button>
          </div>
        </div>

        {/* STATS */}
        <Stats stats={stats} />

        {/* BOARD */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="kanban">
            <Column
              title="Todo"
              status="todo"
              tasks={tasks.todo}
              onPriorityChange={handlePriorityChange}
            />
            <Column
              title="In Progress"
              status="in_progress"
              tasks={tasks.in_progress}
              onPriorityChange={handlePriorityChange}
            />
            <Column
              title="Done"
              status="done"
              tasks={tasks.done}
              onPriorityChange={handlePriorityChange}
            />
          </div>
        </DndContext>
      </div>

      {/* MODALS */}
      <CreateTask
        open={open}
        setOpen={setOpen}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        priority={priority}
        setPriority={setPriority}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        dueDate={dueDate}
        setDueDate={setDueDate}
        members={members}
        onCreate={handleCreate}
      />

      <AddMember
        open={memberOpen}
        setOpen={setMemberOpen}
        onAdd={handleAddMember}
      />

      {/* TEAM VIEW */}
      {showMembers && (
        <div
          className="team-overlay"
          onClick={() => setShowMembers(false)}
        >
          <div
            className="team-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Team Members</h2>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {members.map((m: any) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>
                      <span className={`role-badge ${m.role}`}>
                        {m.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="team-actions">
              <Button onClick={() => setShowMembers(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}