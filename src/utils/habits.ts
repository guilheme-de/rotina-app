import { differenceInCalendarDays, format, parseISO, subDays } from "date-fns";
import type { HabitLog } from "@/types/database.types";

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/** Calcula a sequência atual (streak) de dias consecutivos concluídos, terminando hoje ou ontem. */
export function computeStreak(logs: HabitLog[]): number {
  const completedDates = new Set(
    logs.filter((l) => l.completed).map((l) => l.log_date)
  );

  let streak = 0;
  let cursor = new Date();

  // Se hoje ainda não foi concluído, a sequência pode ter terminado ontem.
  if (!completedDates.has(format(cursor, "yyyy-MM-dd"))) {
    cursor = subDays(cursor, 1);
  }

  while (completedDates.has(format(cursor, "yyyy-MM-dd"))) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }

  return streak;
}

/** Percentual de conclusão nos últimos N dias. */
export function computeCompletionRate(logs: HabitLog[], days = 30): number {
  const relevant = logs.filter((l) => differenceInCalendarDays(new Date(), parseISO(l.log_date)) <= days);
  const completed = relevant.filter((l) => l.completed).length;
  if (days === 0) return 0;
  return Math.round((completed / days) * 100);
}

export function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), "yyyy-MM-dd"));
}
