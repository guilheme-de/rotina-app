import { createClient } from "@/lib/supabase/client";
import type { Note } from "@/types/database.types";

export async function createNote(input: { title?: string; content?: string; created_by?: string }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .insert({
      title: input.title ?? "Sem título",
      content: input.content ?? "",
      created_by: input.created_by,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Note;
}

export async function updateNote(id: string, changes: Partial<Note>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Note;
}

export async function deleteNote(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
}
