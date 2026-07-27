"use client";

import Link from "next/link";
import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import type { Goal } from "@/types/database.types";

export function GoalsWidget({ goals }: { goals: Goal[] }) {
  const active = goals.filter((g) => g.status === "active").slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Metas em andamento</CardTitle>
        <Link href="/goals" className="text-xs text-primary hover:underline">
          Ver todas
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {active.length === 0 ? (
          <EmptyState icon={Target} title="Nenhuma meta ativa" description="Defina um objetivo para acompanhar." />
        ) : (
          active.map((goal) => (
            <div key={goal.id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="truncate text-foreground">{goal.title}</span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
