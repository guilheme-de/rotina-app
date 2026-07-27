"use client";

import { toast } from "sonner";
import { useRealtimeList } from "@/hooks/use-realtime-list";
import * as eventsService from "@/services/events.service";
import type { CalendarEvent } from "@/types/database.types";

export function useEvents() {
  const { data, setData, loading } = useRealtimeList<CalendarEvent>("events", {
    orderBy: "start_time",
  });

  async function addEvent(input: Parameters<typeof eventsService.createEvent>[0]) {
    try {
      const created = await eventsService.createEvent(input);
      setData((prev) => [...prev, created]);
      toast.success("Evento criado");
      return created;
    } catch {
      toast.error("Não foi possível criar o evento");
      throw new Error("create_event_failed");
    }
  }

  async function editEvent(id: string, changes: Partial<CalendarEvent>) {
    setData((prev) => prev.map((e) => (e.id === id ? { ...e, ...changes } : e)));
    try {
      await eventsService.updateEvent(id, changes);
    } catch {
      toast.error("Não foi possível salvar o evento");
    }
  }

  async function removeEvent(id: string) {
    const prev = data;
    setData((current) => current.filter((e) => e.id !== id));
    try {
      await eventsService.deleteEvent(id);
      toast.success("Evento removido");
    } catch {
      setData(prev);
      toast.error("Não foi possível remover o evento");
    }
  }

  return { events: data, loading, addEvent, editEvent, removeEvent };
}
