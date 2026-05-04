"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";
import "./Column.css";

export default function Column({
  title,
  status,
  tasks,
  onPriorityChange,
}: any) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <div className="column" ref={setNodeRef}>
      <div className="column-header">
        <div className="column-header-top">
            <div className="column-title">{title}</div>
            <span className="column-count">{tasks.length}</span>
        </div>

        <div className="column-divider" />
        </div>

      <SortableContext
        items={safeTasks.map((t: any) => String(t.id))}
        strategy={verticalListSortingStrategy}
      >
        <div className="column-tasks">
          {safeTasks.length === 0 ? (
            <div className="column-empty">No tasks</div>
          ) : (
            safeTasks.map((t: any) => (
              <TaskCard
                key={t.id}
                task={t}
                onPriorityChange={onPriorityChange}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}