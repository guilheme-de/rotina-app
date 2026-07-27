"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TransactionType } from "@/types/database.types";

const CATEGORY_SUGGESTIONS = [
  "Mercado",
  "Moradia",
  "Transporte",
  "Lazer",
  "Saúde",
  "Educação",
  "Salário",
  "Outros",
];

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z
    .string()
    .min(1, "Informe um valor")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, "Informe um valor maior que zero"),
  category: z.string().min(1, "Informe uma categoria"),
  description: z.string().max(200).optional(),
  occurred_on: z.string().min(1),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function TransactionFormDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    type: TransactionType;
    amount: number;
    category: string;
    description?: string;
    occurred_on: string;
  }) => Promise<void> | void;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      category: "",
      description: "",
      occurred_on: format(new Date(), "yyyy-MM-dd"),
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        occurred_on: format(new Date(), "yyyy-MM-dd"),
      });
    }
  }, [open, reset]);

  async function submit(values: TransactionFormValues) {
    await onSubmit({ ...values, amount: Number(values.amount) });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo lançamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Tabs value={field.value} onValueChange={field.onChange}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="expense">Saída</TabsTrigger>
                  <TabsTrigger value="income">Entrada</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input id="amount" type="number" step="0.01" min="0" autoFocus {...register("amount")} />
              {errors.amount && <p className="text-xs text-danger">{errors.amount.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="occurred_on">Data</Label>
              <Input id="occurred_on" type="date" {...register("occurred_on")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">Categoria</Label>
            <Input id="category" list="category-suggestions" placeholder="Ex: Mercado" {...register("category")} />
            <datalist id="category-suggestions">
              {CATEGORY_SUGGESTIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.category && <p className="text-xs text-danger">{errors.category.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input id="description" {...register("description")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Adicionar lançamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
