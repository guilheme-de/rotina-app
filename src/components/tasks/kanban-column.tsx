"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./task-card";
import { cn } from "@/lib/utils";
import { STATUS_LABEL } from "@/utils/tasks";
import type { Task, TaskStatus } from "@/types/database.types";

export function KanbanColumn({
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDropTask,
}: {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onDropTask: (taskId: string, status: TaskStatus, position: number) => void;
}) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className={cn(
        "flex min-h-[200px] w-full flex-col rounded-xl border border-border bg-surface/60 p-3 transition-colors md:w-80 md:shrink-0",
        isOver && "border-primary/50 bg-primary/[0.04]"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const taskId = e.dataTransfer.getData("text/plain");
        if (taskId) onDropTask(taskId, status, tasks.length);
      }}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{STATUS_LABEL[status]}</h3>
          <span className="rounded-full bg-surface-elevated px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddTask}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task)}
              onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
