"use client";

import { toast } from "sonner";
import { useRealtimeList } from "@/hooks/use-realtime-list";
import * as goalsService from "@/services/goals.service";
import type { Goal } from "@/types/database.types";

export function useGoals() {
  const { data, setData, loading } = useRealtimeList<Goal>("goals", { orderBy: "created_at" });

  async function addGoal(input: Parameters<typeof goalsService.createGoal>[0]) {
    try {
      const created = await goalsService.createGoal(input);
      setData((prev) => [...prev, created]);
      toast.success("Meta criada");
      return created;
    } catch {
      toast.error("Não foi possível criar a meta");
      throw new Error("create_goal_failed");
    }
  }

  async function editGoal(id: string, changes: Partial<Goal>) {
    setData((prev) => prev.map((g) => (g.id === id ? { ...g, ...changes } : g)));
    try {
      await goalsService.updateGoal(id, changes);
    } catch {
      toast.error("Não foi possível salvar a meta");
    }
  }

  async function removeGoal(id: string) {
    const prev = data;
    setData((current) => current.filter((g) => g.id !== id));
    try {
      await goalsService.deleteGoal(id);
      toast.success("Meta removida");
    } catch {
      setData(prev);
      toast.error("Não foi possível remover a meta");
    }
  }

  return { goals: data, loading, addGoal, editGoal, removeGoal };
}
