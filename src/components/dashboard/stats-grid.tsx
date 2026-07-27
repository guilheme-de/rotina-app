"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Flame, Target, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string;
  icon: typeof CheckCircle2;
  tone: "primary" | "accent" | "success" | "danger";
}

export function StatsGrid({
  pendingTasks,
  bestStreak,
  activeGoalsAvg,
  balance,
}: {
  pendingTasks: number;
  bestStreak: number;
  activeGoalsAvg: number;
  balance: number;
}) {
  const items: StatItem[] = [
    { label: "Tarefas em aberto", value: String(pendingTasks), icon: CheckCircle2, tone: "primary" },
    { label: "Melhor sequência", value: `${bestStreak} dias`, icon: Flame, tone: "accent" },
    { label: "Progresso médio das metas", value: `${activeGoalsAvg}%`, icon: Target, tone: "success" },
    {
      label: "Saldo do mês",
      value: balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      icon: Wallet,
      tone: balance >= 0 ? "success" : "danger",
    },
  ];

  const toneClasses: Record<StatItem["tone"], string> = {
    primary: "bg-primary/15 text-primary",
    accent: "bg-accent/15 text-accent",
    success: "bg-success/15 text-success",
    danger: "bg-danger/15 text-danger",
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
        >
          <Card className="p-4">
            <div className={cn("mb-3 flex h-8 w-8 items-center justify-center rounded-lg", toneClasses[item.tone])}>
              <item.icon className="h-4 w-4" />
            </div>
            <p className="font-mono text-lg font-semibold tabular-nums text-foreground">{item.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.label}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
