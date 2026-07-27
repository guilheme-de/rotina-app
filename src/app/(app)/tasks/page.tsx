"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageSpinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { KanbanColumn } from "@/components/tasks/kanban-column";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskFilters } from "@/components/tasks/task-filters";
import { useConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTasks } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import { STATUS_ORDER } from "@/utils/tasks";
import type { Task, TaskPriority, TaskStatus } from "@/types/database.types";

export default function TasksPage() {
  const { user } = useAuth();
  const { tasks, loading, addTask, editTask, removeTask, moveTask } = useTasks();
  const { confirm, dialog } = useConfirmDialog();

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<TaskPriority | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesPriority = priority === "all" || t.priority === priority;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, search, priority]);

  function columnTasks(status: TaskStatus) {
    return filtered.filter((t) => t.status === status).sort((a, b) => a.position - b.position);
  }

  function openCreate(status: TaskStatus) {
    setEditingTask(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  async function handleSubmit(values: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string | null;
    tags: string[];
  }) {
    if (editingTask) {
      await editTask(editingTask.id, values);
    } else {
      await addTask({ ...values, created_by: user?.id });
    }
  }

  if (loading) return <PageSpinner />;

  return (
    <div>
      <PageHeader
        title="Tarefas"
        description="Organize o fluxo de trabalho em Kanban"
        action={
          <Button onClick={() => openCreate("todo")}>
            <Plus className="h-4 w-4" /> Nova tarefa
          </Button>
        }
      />

      <TaskFilters search={search} onSearchChange={setSearch} priority={priority} onPriorityChange={setPriority} />

      <div className="flex flex-col gap-4 md:flex-row md:overflow-x-auto md:pb-2">
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={columnTasks(status)}
            onAddTask={() => openCreate(status)}
            onEditTask={openEdit}
            onDeleteTask={(task) =>
              confirm({
                title: "Excluir tarefa?",
                description: `"${task.title}" será removida permanentemente.`,
                onConfirm: () => removeTask(task.id),
              })
            }
            onDropTask={moveTask}
          />
        ))}
      </div>

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
        onSubmit={handleSubmit}
      />
      {dialog}
    </div>
  );
}
