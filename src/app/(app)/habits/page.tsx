"use client";

import { useState } from "react";
import { Plus, Flame } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageSpinner } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/components/habits/habit-card";
import { HabitFormDialog } from "@/components/habits/habit-form-dialog";
import { useConfirmDialog } from "@/components/shared/confirm-dialog";
import { useHabits } from "@/hooks/use-habits";
import { useAuth } from "@/hooks/use-auth";
import type { Habit } from "@/types/database.types";

export default function HabitsPage() {
  const { user } = useAuth();
  const {
    habits,
    loading,
    addHabit,
    editHabit,
    removeHabit,
    toggleToday,
    isCompletedToday,
    logsFor,
    streakFor,
    completionRateFor,
  } = useHabits();
  const { confirm, dialog } = useConfirmDialog();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const active = habits.filter((h) => !h.archived);

  async function handleSubmit(values: { name: string; description?: string; color: string }) {
    if (editingHabit) {
      await editHabit(editingHabit.id, values);
    } else {
      await addHabit({ ...values, created_by: user?.id });
    }
  }

  if (loading) return <PageSpinner />;

  return (
    <div>
      <PageHeader
        title="Hábitos"
        description="Construa consistência dia após dia"
        action={
          <Button
            onClick={() => {
              setEditingHabit(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Novo hábito
          </Button>
        }
      />

      {active.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="Nenhum hábito ainda"
          description="Crie o primeiro hábito para começar a acompanhar sua sequência."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {active.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              logs={logsFor(habit.id)}
              streak={streakFor(habit.id)}
              completionRate={completionRateFor(habit.id)}
              completedToday={isCompletedToday(habit.id)}
              onToggleToday={() => toggleToday(habit.id)}
              onEdit={() => {
                setEditingHabit(habit);
                setDialogOpen(true);
              }}
              onDelete={() =>
                confirm({
                  title: "Excluir hábito?",
                  description: `"${habit.name}" e todo o histórico serão removidos.`,
                  onConfirm: () => removeHabit(habit.id),
                })
              }
            />
          ))}
        </div>
      )}

      <HabitFormDialog open={dialogOpen} onOpenChange={setDialogOpen} habit={editingHabit} onSubmit={handleSubmit} />
      {dialog}
    </div>
  );
}
