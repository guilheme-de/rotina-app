import { createClient } from "@/lib/supabase/client";
import type { Task, TaskStatus } from "@/types/database.types";

export async function createTask(input: {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Task["priority"];
  due_date?: string | null;
  tags?: string[];
  created_by?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? "todo",
      priority: input.priority ?? "medium",
      due_date: input.due_date ?? null,
      tags: input.tags ?? [],
      created_by: input.created_by,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function updateTask(id: string, changes: Partial<Task>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tasks")
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function deleteTask(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function moveTask(id: string, status: TaskStatus, position: number) {
  return updateTask(id, { status, position });
}
