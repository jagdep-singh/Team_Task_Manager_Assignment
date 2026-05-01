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
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <div className="column">
      <div className="column-header">
        <div className="column-header-top">
          <div className="column-title">{title}</div>
          <span className="column-count">{safeTasks.length}</span>
        </div>
        <div className="column-divider" />
      </div>

      <SortableContext
        items={safeTasks.map((t: any) => String(t.id))}
        strategy={verticalListSortingStrategy}
      >
        {/* setNodeRef goes on the tasks container so the whole area is droppable */}
        <div
          ref={setNodeRef}
          className={`column-tasks${isOver ? " column-tasks--over" : ""}`}
        >
          {safeTasks.length === 0 ? (
            <div className="column-empty">Drop here</div>
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