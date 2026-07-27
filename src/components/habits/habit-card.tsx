"use client";

import { motion } from "framer-motion";
import { Flame, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HabitWeekStrip } from "./habit-week-strip";
import { HabitTrendChart } from "./habit-trend-chart";
import type { Habit, HabitLog } from "@/types/database.types";

export function HabitCard({
  habit,
  logs,
  streak,
  completionRate,
  completedToday,
  onToggleToday,
  onEdit,
  onDelete,
}: {
  habit: Habit;
  logs: HabitLog[];
  streak: number;
  completionRate: number;
  completedToday: boolean;
  onToggleToday: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
          <div className="flex items-start gap-3">
            <Checkbox checked={completedToday} onCheckedChange={onToggleToday} className="mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">{habit.name}</p>
              {habit.description && <p className="text-xs text-muted-foreground">{habit.description}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${habit.color}22`, color: habit.color }}
            >
              <Flame className="h-3 w-3" /> {streak}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-danger focus:text-danger">
                  <Trash2 className="h-3.5 w-3.5" /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <HabitWeekStrip logs={logs} color={habit.color} />
            <div className="text-right">
              <p className="font-mono text-lg font-semibold text-foreground">{completionRate}%</p>
              <p className="text-[11px] text-muted-foreground">últimos 30 dias</p>
            </div>
          </div>
          <HabitTrendChart logs={logs} color={habit.color} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
