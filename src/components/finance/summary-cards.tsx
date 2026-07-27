"use client";

import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";

function currency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function SummaryCards({ income, expense, balance }: { income: number; expense: number; balance: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card className="p-4">
        <div className="mb-2 flex items-center gap-2 text-success">
          <ArrowUpCircle className="h-4 w-4" />
          <span className="text-xs font-medium">Entradas</span>
        </div>
        <p className="font-mono text-xl font-semibold tabular-nums text-foreground">{currency(income)}</p>
      </Card>
      <Card className="p-4">
        <div className="mb-2 flex items-center gap-2 text-danger">
          <ArrowDownCircle className="h-4 w-4" />
          <span className="text-xs font-medium">Saídas</span>
        </div>
        <p className="font-mono text-xl font-semibold tabular-nums text-foreground">{currency(expense)}</p>
      </Card>
      <Card className="p-4">
        <div className="mb-2 flex items-center gap-2 text-primary">
          <Wallet className="h-4 w-4" />
          <span className="text-xs font-medium">Saldo</span>
        </div>
        <p className="font-mono text-xl font-semibold tabular-nums text-foreground">{currency(balance)}</p>
      </Card>
    </div>
  );
}
