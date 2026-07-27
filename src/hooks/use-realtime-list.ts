"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useRealtimeList<T extends { id: string }>(
  table: string,
  options?: {
    orderBy?: string;
    ascending?: boolean;
  }
) {
  const supabase = useMemo(() => createClient(), []);

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);

    let query = supabase.from(table).select("*");

    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.ascending ?? true,
      });
    }

    const { data: rows, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setData((rows as T[]) ?? []);
      setError(null);
    }

    setLoading(false);
  }, [
    supabase,
    table,
    options?.orderBy,
    options?.ascending,
  ]);

  useEffect(() => {
    let isMounted = true;

    fetchData();

    const channelName = `realtime-${table}-${Date.now()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
        },
        () => {
          if (isMounted) {
            fetchData();
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      isMounted = false;

      if (channelRef.current) {
        void supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchData, supabase, table]);

  return {
    data,
    setData,
    loading,
    error,
    refetch: fetchData,
  };
}