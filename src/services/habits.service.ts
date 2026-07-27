import { createClient } from "@/lib/supabase/client";
import type { Habit, HabitLog } from "@/types/database.types";

export async function createHabit(input: {
  name: string;
  description?: string;
  color?: string;
  frequency?: Habit["frequency"];
  target_days?: number;
  created_by?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habits")
    .insert({
      name: input.name,
      description: input.description ?? null,
      color: input.color ?? "#e3a53d",
      frequency: input.frequency ?? "daily",
      target_days: input.target_days ?? 7,
      created_by: input.created_by,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Habit;
}

export async function updateHabit(id: string, changes: Partial<Habit>) {
  const supabase = createClient();
  const { data, error } = await supabase.from("habits").update(changes).eq("id", id).select().single();
  if (error) throw error;
  return data as Habit;
}

export async function deleteHabit(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("habits").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchHabitLogs(habitId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("habit_id", habitId)
    .order("log_date", { ascending: true });
  if (error) throw error;
  return data as HabitLog[];
}

export async function fetchAllHabitLogs() {
  const supabase = createClient();
  const { data, error } = await supabase.from("habit_logs").select("*").order("log_date", { ascending: true });
  if (error) throw error;
  return data as HabitLog[];
}

export async function toggleHabitLog(habitId: string, dateISO: string, completed: boolean) {
  const supabase = createClient();
  const { data: existing } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("habit_id", habitId)
    .eq("log_date", dateISO)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("habit_logs")
      .update({ completed })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data as HabitLog;
  }

  const { data, error } = await supabase
    .from("habit_logs")
    .insert({ habit_id: habitId, log_date: dateISO, completed })
    .select()
    .single();
  if (error) throw error;
  return data as HabitLog;
}
