"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRIORITY_LABEL } from "@/utils/tasks";
import type { TaskPriority } from "@/types/database.types";

export function TaskFilters({
  search,
  onSearchChange,
  priority,
  onPriorityChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  priority: TaskPriority | "all";
  onPriorityChange: (v: TaskPriority | "all") => void;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar tarefas..."
          className="pl-8"
        />
      </div>
      <Select value={priority} onValueChange={(v) => onPriorityChange(v as TaskPriority | "all")}>
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="Prioridade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas prioridades</SelectItem>
          {(Object.keys(PRIORITY_LABEL) as TaskPriority[]).map((p) => (
            <SelectItem key={p} value={p}>
              {PRIORITY_LABEL[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
