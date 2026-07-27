"use client";

import { motion } from "framer-motion";
import { format, isPast, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClock, CheckCircle2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Goal } from "@/types/database.types";

export function GoalCard({
  goal,
  onProgressChange,
  onEdit,
  onDelete,
}: {
  goal: Goal;
  onProgressChange: (value: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const overdue = goal.deadline && isPast(parseISO(goal.deadline)) && goal.status === "active";

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{goal.title}</p>
              {goal.status === "completed" && (
                <Badge variant="success">
                  <CheckCircle2 className="h-3 w-3" /> Concluída
                </Badge>
              )}
            </div>
            {goal.description && <p className="mt-1 text-xs text-muted-foreground">{goal.description}</p>}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
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
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-mono font-medium text-foreground">{goal.progress}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={goal.progress}
              onChange={(e) => onProgressChange(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-elevated accent-[var(--primary)]"
            />
          </div>

          {goal.deadline && (
            <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", overdue && "text-danger")}>
              <CalendarClock className="h-3.5 w-3.5" />
              {format(parseISO(goal.deadline), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              {overdue && " · atrasada"}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
