"use client";

import { toast } from "sonner";
import { useRealtimeList } from "@/hooks/use-realtime-list";
import * as habitsService from "@/services/habits.service";
import { computeStreak, computeCompletionRate, todayISO } from "@/utils/habits";
import type { Habit, HabitLog } from "@/types/database.types";

export function useHabits() {
  const {
    data: habits,
    setData: setHabits,
    loading: loadingHabits,
  } = useRealtimeList<Habit>("habits", { orderBy: "created_at" });

  const {
    data: logs,
    setData: setLogs,
    loading: loadingLogs,
  } = useRealtimeList<HabitLog>("habit_logs", { orderBy: "log_date" });

  const loading = loadingHabits || loadingLogs;

  function logsFor(habitId: string) {
    return logs.filter((l) => l.habit_id === habitId);
  }

  function isCompletedToday(habitId: string) {
    const today = todayISO();
    return logs.some((l) => l.habit_id === habitId && l.log_date === today && l.completed);
  }

  async function addHabit(input: Parameters<typeof habitsService.createHabit>[0]) {
    try {
      const created = await habitsService.createHabit(input);
      setHabits((prev) => [...prev, created]);
      toast.success("Hábito criado");
      return created;
    } catch {
      toast.error("Não foi possível criar o hábito");
      throw new Error("create_habit_failed");
    }
  }

  async function editHabit(id: string, changes: Partial<Habit>) {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...changes } : h)));
    try {
      await habitsService.updateHabit(id, changes);
      toast.success("Hábito atualizado");
    } catch {
      toast.error("Não foi possível salvar o hábito");
    }
  }

  async function removeHabit(id: string) {
    const prevHabits = habits;
    setHabits((current) => current.filter((h) => h.id !== id));
    try {
      await habitsService.deleteHabit(id);
      toast.success("Hábito removido");
    } catch {
      setHabits(prevHabits);
      toast.error("Não foi possível remover o hábito");
    }
  }

  async function toggleToday(habitId: string) {
    const today = todayISO();
    const currentlyCompleted = isCompletedToday(habitId);
    const nextValue = !currentlyCompleted;

    const existing = logs.find((l) => l.habit_id === habitId && l.log_date === today);
    if (existing) {
      setLogs((current) =>
        current.map((l) => (l.id === existing.id ? { ...l, completed: nextValue } : l))
      );
    } else {
      const optimistic: HabitLog = {
        id: `optimistic-${habitId}-${today}`,
        habit_id: habitId,
        log_date: today,
        completed: nextValue,
        created_at: new Date().toISOString(),
      };
      setLogs((current) => [...current, optimistic]);
    }

    try {
      await habitsService.toggleHabitLog(habitId, today, nextValue);
    } catch {
      toast.error("Não foi possível atualizar o hábito de hoje");
    }
  }

  function streakFor(habitId: string) {
    return computeStreak(logsFor(habitId));
  }

  function completionRateFor(habitId: string, days = 30) {
    return computeCompletionRate(logsFor(habitId), days);
  }

  return {
    habits,
    logs,
    loading,
    addHabit,
    editHabit,
    removeHabit,
    toggleToday,
    isCompletedToday,
    logsFor,
    streakFor,
    completionRateFor,
  };
}
