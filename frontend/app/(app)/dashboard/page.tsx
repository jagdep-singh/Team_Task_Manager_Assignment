"use client";

import "./Dashboard.css";

import ProjectCard from "@/components/ProjectCard";
import Button from "@/components/Button";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects, createProject } from "@/lib/services/project";

export default function DashboardPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  


  const loadProjects = async () => {
    console.log("TOKEN:", localStorage.getItem("token"));
    console.log("API:", process.env.NEXT_PUBLIC_API_URL);
    try {
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/signin");
        return;
      }

      loadProjects();
    }, []);

  const handleCreateProject = async () => {
    if (!name.trim()) return;

    await createProject({
      project_name: name,
      description,
    });

    setName("");
    setDescription("");
    setOpen(false);

    loadProjects();
  };

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Projects</h1>

        <Button onClick={() => setOpen(true)}>
          + Create Project
        </Button>
      </div>

      <div className="project-grid">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {open && (
        <div
          className="modal-overlay"
          onClick={() => setOpen(false)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Create Project</h2>

            <input
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="modal-actions">
              <Button onClick={handleCreateProject}>
                Create
              </Button>

              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}