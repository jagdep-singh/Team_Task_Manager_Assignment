"use client";

import "./ProjectCard.css";

export default function ProjectCard({ project }: any) {
  const creator = project.created_by?.name || "Unknown";

  return (
    <div
      className="project-card"
      onClick={() =>
        (window.location.href = `/dashboard/project/${project.id}`)
      }
    >
      {/* TOP */}
      <div className="card-top">
        <h3>{project.project_name}</h3>
      </div>

      {/* DESCRIPTION */}
      <p className="project-desc">
        {project.description || "No description"}
      </p>

      {/* META */}
      <div className="card-meta">
        <div className="creator">
          <img
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${creator}`}
            className="creator-avatar-img"
          />
          <span>{creator}</span>
        </div>
      </div>
    </div>
  );
}