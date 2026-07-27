"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageSpinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { SummaryCards } from "@/components/finance/summary-cards";
import { MonthlyChart } from "@/components/finance/monthly-chart";
import { TransactionList } from "@/components/finance/transaction-list";
import { TransactionFormDialog } from "@/components/finance/transaction-form-dialog";
import { useConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTransactions } from "@/hooks/use-transactions";
import { useAuth } from "@/hooks/use-auth";

export default function FinancePage() {
  const { user } = useAuth();
  const { transactions, loading, summary, addTransaction, removeTransaction } = useTransactions();
  const { confirm, dialog } = useConfirmDialog();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (loading) return <PageSpinner />;

  return (
    <div>
      <PageHeader
        title="Financeiro"
        description="Entradas, saídas e saldo do casal"
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Novo lançamento
          </Button>
        }
      />

      <div className="mb-4">
        <SummaryCards income={summary.income} expense={summary.expense} balance={summary.balance} />
      </div>

      <div className="mb-4">
        <MonthlyChart transactions={transactions} />
      </div>

      <TransactionList
        transactions={transactions}
        onDelete={(t) =>
          confirm({
            title: "Excluir lançamento?",
            description: `"${t.description || t.category}" será removido.`,
            onConfirm: () => removeTransaction(t.id),
          })
        }
      />

      <TransactionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={async (values) => {
          await addTransaction({ ...values, created_by: user?.id });
        }}
      />
      {dialog}
    </div>
  );
}
