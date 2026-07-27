"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/shared/empty-state";
import { useHabits } from "@/hooks/use-habits";

export function HabitsWidget() {
  const { habits, isCompletedToday, toggleToday, streakFor } = useHabits();
  const active = habits.filter((h) => !h.archived).slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Hábitos de hoje</CardTitle>
        <Link href="/habits" className="text-xs text-primary hover:underline">
          Ver todos
        </Link>
      </CardHeader>
      <CardContent>
        {active.length === 0 ? (
          <EmptyState icon={Flame} title="Nenhum hábito cadastrado" description="Crie seu primeiro hábito." />
        ) : (
          <ul className="flex flex-col divide-y divide-border-soft">
            {active.map((habit) => (
              <li key={habit.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <label className="flex min-w-0 flex-1 items-center gap-3">
                  <Checkbox
                    checked={isCompletedToday(habit.id)}
                    onCheckedChange={() => toggleToday(habit.id)}
                  />
                  <span className="truncate text-sm text-foreground">{habit.name}</span>
                </label>
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Flame className="h-3.5 w-3.5 text-primary" /> {streakFor(habit.id)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
