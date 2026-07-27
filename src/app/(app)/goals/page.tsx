"use client";

import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageSpinner } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalFormDialog } from "@/components/goals/goal-form-dialog";
import { useConfirmDialog } from "@/components/shared/confirm-dialog";
import { useGoals } from "@/hooks/use-goals";
import { useAuth } from "@/hooks/use-auth";
import type { Goal } from "@/types/database.types";

export default function GoalsPage() {
  const { user } = useAuth();
  const { goals, loading, addGoal, editGoal, removeGoal } = useGoals();
  const { confirm, dialog } = useConfirmDialog();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  async function handleSubmit(values: { title: string; description?: string; deadline: string | null }) {
    if (editingGoal) {
      await editGoal(editingGoal.id, values);
    } else {
      await addGoal({ ...values, created_by: user?.id });
    }
  }

  function handleProgressChange(goal: Goal, value: number) {
    editGoal(goal.id, { progress: value, status: value === 100 ? "completed" : "active" });
  }

  if (loading) return <PageSpinner />;

  return (
    <div>
      <PageHeader
        title="Metas"
        description="Acompanhe objetivos de médio e longo prazo"
        action={
          <Button
            onClick={() => {
              setEditingGoal(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Nova meta
          </Button>
        }
      />

      {goals.length === 0 ? (
        <EmptyState icon={Target} title="Nenhuma meta ainda" description="Defina o primeiro objetivo do casal." />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onProgressChange={(value) => handleProgressChange(goal, value)}
              onEdit={() => {
                setEditingGoal(goal);
                setDialogOpen(true);
              }}
              onDelete={() =>
                confirm({
                  title: "Excluir meta?",
                  description: `"${goal.title}" será removida permanentemente.`,
                  onConfirm: () => removeGoal(goal.id),
                })
              }
            />
          ))}
        </div>
      )}

      <GoalFormDialog open={dialogOpen} onOpenChange={setDialogOpen} goal={editingGoal} onSubmit={handleSubmit} />
      {dialog}
    </div>
  );
}
