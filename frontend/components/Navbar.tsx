"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import "./Navbar.css";

export default function Navbar({ projectName }: any = {}) {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  return (
    <div className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <h1>{projectName || "Dashboard"}</h1>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <div className="avatar-wrapper">
          <img
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
              username
            )}`}
            className="avatar-img"
          />
          <span className="avatar-name">{username}</span>
        </div>

        <Button
          variant="logout"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout →
        </Button>
      </div>
    </div>
  );
}