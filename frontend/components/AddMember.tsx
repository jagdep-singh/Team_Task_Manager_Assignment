"use client";

import { useEffect, useState } from "react";
import "./AddMember.css";
import Button from "./Button";

export default function AddMember({
  open,
  setOpen,
  onAdd,
}: any) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setEmail("");
      setError("");
    }
  }, [open]);

  const handleAdd = async () => {
    const result = await onAdd(email.trim());

    if (result?.success) {
      setEmail("");
      setError("");
      setOpen(false);
      return;
    }

    setError(result?.message || "Could not add this member.");
  };

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

        {error && <div className="member-error">{error}</div>}

        <div className="member-actions">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleAdd} disabled={!email.trim()}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}