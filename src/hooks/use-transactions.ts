"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { useRealtimeList } from "@/hooks/use-realtime-list";
import * as transactionsService from "@/services/transactions.service";
import type { Transaction } from "@/types/database.types";

export function useTransactions() {
  const { data, setData, loading } = useRealtimeList<Transaction>("transactions", {
    orderBy: "occurred_on",
    ascending: false,
  });

  const summary = useMemo(() => {
    const income = data.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = data.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
    return { income, expense, balance: income - expense };
  }, [data]);

  async function addTransaction(input: Parameters<typeof transactionsService.createTransaction>[0]) {
    try {
      const created = await transactionsService.createTransaction(input);
      setData((prev) => [created, ...prev]);
      toast.success("Lançamento adicionado");
      return created;
    } catch {
      toast.error("Não foi possível salvar o lançamento");
      throw new Error("create_transaction_failed");
    }
  }

  async function removeTransaction(id: string) {
    const prev = data;
    setData((current) => current.filter((t) => t.id !== id));
    try {
      await transactionsService.deleteTransaction(id);
      toast.success("Lançamento removido");
    } catch {
      setData(prev);
      toast.error("Não foi possível remover o lançamento");
    }
  }

  return { transactions: data, loading, summary, addTransaction, removeTransaction };
}
