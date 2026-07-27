import type { TaskPriority, TaskStatus } from "@/types/database.types";

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

export const PRIORITY_BADGE_VARIANT: Record<TaskPriority, "secondary" | "accent" | "default" | "danger"> = {
  low: "secondary",
  medium: "accent",
  high: "default",
  urgent: "danger",
};

export const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "A Fazer",
  doing: "Fazendo",
  done: "Concluído",
};

export const STATUS_ORDER: TaskStatus[] = ["todo", "doing", "done"];
