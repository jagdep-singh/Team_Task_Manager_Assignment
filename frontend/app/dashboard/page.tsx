"use client";

import { useEffect, useState } from "react";
import { getProjects } from "@/lib/services/project";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  return (
    <div>
      <h1>Projects</h1>

      {projects.length === 0 && <p>No projects found</p>}

      {projects.map((p) => (
        <div
          key={p.id}
          onClick={() => (window.location.href = `/dashboard/project/${p.id}`)}
          style={{
            border: "1px solid #333",
            padding: "10px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
        >
          <h3>{p.project_name}</h3>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}