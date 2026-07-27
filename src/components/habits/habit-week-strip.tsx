"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { last7Days } from "@/utils/habits";
import type { HabitLog } from "@/types/database.types";

export function HabitWeekStrip({ logs, color }: { logs: HabitLog[]; color: string }) {
  const days = last7Days();
  const completedSet = new Set(logs.filter((l) => l.completed).map((l) => l.log_date));

  return (
    <div className="flex items-center gap-1.5">
      {days.map((day) => {
        const completed = completedSet.has(day);
        return (
          <div key={day} className="flex flex-col items-center gap-1">
            <div
              className={cn("h-5 w-5 rounded-md border transition-colors", !completed && "border-border bg-surface-elevated")}
              style={completed ? { backgroundColor: color, borderColor: color } : undefined}
              title={format(parseISO(day), "d 'de' MMM", { locale: ptBR })}
            />
            <span className="text-[9px] uppercase text-muted-foreground">
              {format(parseISO(day), "EEEEE", { locale: ptBR })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
