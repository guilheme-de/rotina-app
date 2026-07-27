"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Wallet } from "lucide-react";
import type { Transaction } from "@/types/database.types";

export function TransactionList({
  transactions,
  onDelete,
}: {
  transactions: Transaction[];
  onDelete: (t: Transaction) => void;
}) {
  if (transactions.length === 0) {
    return <EmptyState icon={Wallet} title="Nenhum lançamento" description="Adicione sua primeira entrada ou saída." />;
  }

  return (
    <Card className="overflow-hidden p-0">
      <ul className="divide-y divide-border-soft">
        {transactions.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-foreground">{t.description || t.category}</p>
                <Badge variant="secondary">{t.category}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {format(parseISO(t.occurred_on), "d 'de' MMM", { locale: ptBR })}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span
                className={`font-mono text-sm font-medium tabular-nums ${
                  t.type === "income" ? "text-success" : "text-danger"
                }`}
              >
                {t.type === "income" ? "+" : "-"}
                {Number(t.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(t)}>
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
