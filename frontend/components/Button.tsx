"use client";

import "./Button.css";

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
}: any) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}