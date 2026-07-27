"use client";

import { useMemo } from "react";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Transaction } from "@/types/database.types";

export function MonthlyChart({ transactions }: { transactions: Transaction[] }) {
  const data = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), 5 - i));
    return months.map((month) => {
      const key = format(month, "yyyy-MM");
      const monthTransactions = transactions.filter((t) => t.occurred_on.startsWith(key));
      const income = monthTransactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
      const expense = monthTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
      return {
        month: format(month, "MMM", { locale: ptBR }),
        Entradas: income,
        Saídas: expense,
      };
    });
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimos 6 meses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Entradas" fill="var(--success)" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Saídas" fill="var(--danger)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
