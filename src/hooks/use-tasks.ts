"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { useRealtimeList } from "@/hooks/use-realtime-list";
import * as tasksService from "@/services/tasks.service";
import type { Task, TaskStatus } from "@/types/database.types";

export function useTasks() {
  const { data, setData, loading, error } = useRealtimeList<Task>("tasks", {
    orderBy: "position",
  });

  const grouped = useMemo(() => {
    const columns: Record<TaskStatus, Task[]> = { todo: [], doing: [], done: [] };
    for (const task of data) columns[task.status].push(task);
    return columns;
  }, [data]);

  async function addTask(input: Parameters<typeof tasksService.createTask>[0]) {
    try {
      const created = await tasksService.createTask(input);
      setData((prev) => [...prev, created]);
      toast.success("Tarefa criada");
      return created;
    } catch (err) {
      toast.error("Não foi possível criar a tarefa");
      throw err;
    }
  }

  async function editTask(id: string, changes: Partial<Task>) {
    setData((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
    try {
      await tasksService.updateTask(id, changes);
    } catch (err) {
      toast.error("Não foi possível salvar a alteração");
      throw err;
    }
  }

  async function removeTask(id: string) {
    const prev = data;
    setData((current) => current.filter((t) => t.id !== id));
    try {
      await tasksService.deleteTask(id);
      toast.success("Tarefa removida");
    } catch (err) {
      setData(prev);
      toast.error("Não foi possível remover a tarefa");
      throw err;
    }
  }

  async function moveTask(id: string, status: TaskStatus, position: number) {
    setData((current) => current.map((t) => (t.id === id ? { ...t, status, position } : t)));
    try {
      await tasksService.moveTask(id, status, position);
    } catch (err) {
      toast.error("Não foi possível mover a tarefa");
      throw err;
    }
  }

  return { tasks: data, grouped, loading, error, addTask, editTask, removeTask, moveTask };
}
