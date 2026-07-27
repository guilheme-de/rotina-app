"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database.types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!active) return;
      setUser(currentUser);

      if (currentUser) {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();
        if (active) setProfile((profileRow ?? null) as Profile | null);
      }
      if (active) setLoading(false);
    }

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return { user, profile, setProfile, loading, signOut };
}
