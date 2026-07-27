import { createClient } from "@/lib/supabase/client";
import type { CalendarEvent } from "@/types/database.types";

export async function createEvent(input: {
  title: string;
  description?: string;
  start_time: string;
  end_time?: string | null;
  all_day?: boolean;
  color?: string;
  created_by?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .insert({
      title: input.title,
      description: input.description ?? null,
      start_time: input.start_time,
      end_time: input.end_time ?? null,
      all_day: input.all_day ?? false,
      color: input.color ?? "#8b85f0",
      created_by: input.created_by,
    })
    .select()
    .single();
  if (error) throw error;
  return data as CalendarEvent;
}

export async function updateEvent(id: string, changes: Partial<CalendarEvent>) {
  const supabase = createClient();
  const { data, error } = await supabase.from("events").update(changes).eq("id", id).select().single();
  if (error) throw error;
  return data as CalendarEvent;
}

export async function deleteEvent(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}
