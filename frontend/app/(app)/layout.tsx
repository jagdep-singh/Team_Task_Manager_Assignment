"use client";

import Navbar from "@/components/Navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page">
      <Navbar />
      {children}
    </div>
  );
}