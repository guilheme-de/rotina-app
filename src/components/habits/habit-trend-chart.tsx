"use client";

import { format, parseISO, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { HabitLog } from "@/types/database.types";

export function HabitTrendChart({ logs, color }: { logs: HabitLog[]; color: string }) {
  const days = Array.from({ length: 14 }, (_, i) => format(subDays(new Date(), 13 - i), "yyyy-MM-dd"));
  const completedSet = new Set(logs.filter((l) => l.completed).map((l) => l.log_date));

  const data = days.map((day) => ({
    day: format(parseISO(day), "d/M", { locale: ptBR }),
    value: completedSet.has(day) ? 1 : 0,
  }));

  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="day" hide />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 11,
            }}
            labelFormatter={(label) => label}
            formatter={(value) => [Number(value) ? "Concluído" : "Não concluído", ""]}
          />
          <Bar dataKey="value" radius={[3, 3, 0, 0]} fill={color} fillOpacity={0.85} maxBarSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
