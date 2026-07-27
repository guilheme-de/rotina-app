import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database.types";

export async function fetchProfiles() {
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return data as Profile[];
}

export async function updateProfile(id: string, changes: Partial<Profile>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function uploadAvatar(userId: string, file: File) {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${userId}/avatar.${ext}`;
  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
    upsert: true,
    cacheControl: "3600",
  });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
