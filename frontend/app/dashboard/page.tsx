"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, useCallback } from "react";
import { request } from "@/lib/api";
import Link from "next/link";

interface Project {
  id: number;
  project_name: string;
  description: string;
  created_by: {
    id: number;
    name: string;
  };
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    const res = await request("/project/");
    setProjects(res);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-7xl mx-auto">
        {loading && <div className="mb-4 text-blue-500 text-subtext">Loading...</div>}
        <h1 className="text-4xl font-bold text-main mb-8">Projects</h1>

        {/* create project */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-main mb-4">Create New Project</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input flex-1"
            />
            <input
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="input flex-1"
            />
            <button
              onClick={createProject}
              className="btn-primary whitespace-nowrap"
            >
              Create
            </button>
          </div>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-subtext text-lg">No projects yet</p>
            <p className="text-muted-foreground text-subtext mt-2">Create your first project to get started</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link key={p.id} href={`/dashboard/project/${p.id}`}>
              <div className="card p-6 cursor-pointer group">
                <h2 className="text-xl font-semibold text-main mb-3 group-hover:text-gray-800 transition-colors">
                  {p.project_name}
                </h2>
                <p className="text-muted-foreground text-subtext mb-4 line-clamp-2">
                  {p.description}
                </p>
                <p className="text-sm text-muted-foreground text-subtext">
                  Created by: {p.created_by.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}