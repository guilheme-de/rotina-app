"use client";

import { format, isPast, isToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { CalendarClock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRIORITY_BADGE_VARIANT, PRIORITY_LABEL } from "@/utils/tasks";
import type { Task } from "@/types/database.types";

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onDragStart,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
}) {
  const overdue = task.due_date && isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        draggable
        onDragStart={onDragStart}
        className="cursor-grab p-3.5 transition-colors hover:border-border-soft active:cursor-grabbing"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug text-foreground">{task.title}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-1.5 -mt-1 h-6 w-6 shrink-0">
                <MoreHorizontal className="h-3.5 w-3.5" />
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

        {task.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge variant={PRIORITY_BADGE_VARIANT[task.priority]}>{PRIORITY_LABEL[task.priority]}</Badge>
          {task.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {task.due_date && (
            <span
              className={cn(
                "ml-auto flex items-center gap-1 text-[11px] text-muted-foreground",
                overdue && "text-danger"
              )}
            >
              <CalendarClock className="h-3 w-3" />
              {format(parseISO(task.due_date), "d MMM", { locale: ptBR })}
            </span>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
