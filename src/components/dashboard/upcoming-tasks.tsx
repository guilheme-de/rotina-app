"use client";

import Link from "next/link";
import { format, isPast, isToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { PRIORITY_BADGE_VARIANT, PRIORITY_LABEL } from "@/utils/tasks";
import type { Task } from "@/types/database.types";

export function UpcomingTasks({ tasks }: { tasks: Task[] }) {
  const upcoming = tasks
    .filter((t) => t.status !== "done")
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return a.due_date.localeCompare(b.due_date);
    })
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Próximas tarefas</CardTitle>
        <Link href="/tasks" className="text-xs text-primary hover:underline">
          Ver todas
        </Link>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <EmptyState icon={ListChecks} title="Nenhuma tarefa pendente" description="Você está em dia!" />
        ) : (
          <ul className="flex flex-col divide-y divide-border-soft">
            {upcoming.map((task) => {
              const overdue = task.due_date && isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date));
              return (
                <li key={task.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{task.title}</p>
                    {task.due_date && (
                      <p className={cn("text-xs text-muted-foreground", overdue && "text-danger")}>
                        {format(parseISO(task.due_date), "d 'de' MMM", { locale: ptBR })}
                      </p>
                    )}
                  </div>
                  <Badge variant={PRIORITY_BADGE_VARIANT[task.priority]}>{PRIORITY_LABEL[task.priority]}</Badge>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
