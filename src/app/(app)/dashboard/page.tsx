"use client";

import { useMemo } from "react";
import { GreetingHeader } from "@/components/dashboard/greeting-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { HabitsWidget } from "@/components/dashboard/habits-widget";
import { GoalsWidget } from "@/components/dashboard/goals-widget";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/hooks/use-tasks";
import { useGoals } from "@/hooks/use-goals";
import { useHabits } from "@/hooks/use-habits";
import { useTransactions } from "@/hooks/use-transactions";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { tasks } = useTasks();
  const { goals } = useGoals();
  const { habits, streakFor } = useHabits();
  const { summary } = useTransactions();

  const pendingTasks = useMemo(() => tasks.filter((t) => t.status !== "done").length, [tasks]);

  const bestStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map((h) => streakFor(h.id)), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits]);

  const activeGoalsAvg = useMemo(() => {
    const active = goals.filter((g) => g.status === "active");
    if (active.length === 0) return 0;
    return Math.round(active.reduce((sum, g) => sum + g.progress, 0) / active.length);
  }, [goals]);

  return (
    <div>
      <GreetingHeader name={profile?.name ?? "Usuário"} />

      <div className="mb-6">
        <StatsGrid
          pendingTasks={pendingTasks}
          bestStreak={bestStreak}
          activeGoalsAvg={activeGoalsAvg}
          balance={summary.balance}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <UpcomingTasks tasks={tasks} />
        <HabitsWidget />
        <GoalsWidget goals={goals} />
      </div>
    </div>
  );
}
