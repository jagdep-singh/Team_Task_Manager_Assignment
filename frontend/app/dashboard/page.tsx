"use client";

import { useEffect, useState } from "react";
import { request } from "@/lib/api";
import Link from "next/link";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    const res = await request("/project/");
    setProjects(res);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async () => {
    if (!name) return;
    setLoading(true);
    await request("/project/", "POST", {
      project_name: name,
      description: desc,
    });
    setName("");
    setDesc("");
    fetchProjects();
    setLoading(false);
  };

  return (
    <div className="p-4">
      {loading && <div className="mb-4 text-blue-500">Loading...</div>}
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      {/* create project */}
      <div className="mb-8 p-4 border border-gray-300 rounded bg-white">
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
        <div className="flex gap-4">
          <input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-2 flex-1"
          />
          <input
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border border-gray-300 p-2 flex-1"
          />
          <button
            onClick={createProject}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </div>

      {projects.length === 0 && <p className="text-gray-500">No projects yet</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Link key={p.id} href={`/dashboard/project/${p.id}`}>
            <div className="border border-gray-300 p-4 rounded bg-white hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">{p.project_name}</h2>
              <p className="text-gray-600">{p.description}</p>
              <p className="text-sm text-gray-500 mt-2">Created by: {p.created_by.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}