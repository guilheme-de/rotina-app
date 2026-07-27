import { createClient } from "@/lib/supabase/client";
import type { Goal } from "@/types/database.types";

export async function createGoal(input: {
  title: string;
  description?: string;
  deadline?: string | null;
  created_by?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("goals")
    .insert({
      title: input.title,
      description: input.description ?? null,
      deadline: input.deadline ?? null,
      created_by: input.created_by,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Goal;
}

export async function updateGoal(id: string, changes: Partial<Goal>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("goals")
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Goal;
}

export async function deleteGoal(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("goals").delete().eq("id", id);
  if (error) throw error;
}
