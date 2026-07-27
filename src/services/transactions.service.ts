import { createClient } from "@/lib/supabase/client";
import type { Transaction } from "@/types/database.types";

export async function createTransaction(input: {
  type: Transaction["type"];
  amount: number;
  category?: string;
  description?: string;
  occurred_on?: string;
  created_by?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      type: input.type,
      amount: input.amount,
      category: input.category ?? "Outros",
      description: input.description ?? null,
      occurred_on: input.occurred_on ?? new Date().toISOString().slice(0, 10),
      created_by: input.created_by,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Transaction;
}

export async function updateTransaction(id: string, changes: Partial<Transaction>) {
  const supabase = createClient();
  const { data, error } = await supabase.from("transactions").update(changes).eq("id", id).select().single();
  if (error) throw error;
  return data as Transaction;
}

export async function deleteTransaction(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}
