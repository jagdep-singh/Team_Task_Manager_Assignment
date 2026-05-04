"use client";

import { useState } from "react";
import "./AddMember.css";
import Button from "./Button";

export default function AddMember({
  open,
  setOpen,
  onAdd,
}: any) {
  const [email, setEmail] = useState("");

  if (!open) return null;

  return (
    <div className="member-overlay" onClick={() => setOpen(false)}>
      <div
        className="member-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Add Team Member</h2>

        <input
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="member-actions">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            onClick={() => {
              onAdd(email);
              setEmail("");
              setOpen(false);
            }}
            disabled={!email}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}