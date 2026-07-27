"use client";

import { toast } from "sonner";
import { useRealtimeList } from "@/hooks/use-realtime-list";
import * as notesService from "@/services/notes.service";
import type { Note } from "@/types/database.types";

export function useNotes() {
  const { data, setData, loading } = useRealtimeList<Note>("notes", { orderBy: "updated_at", ascending: false });

  async function addNote(createdBy?: string) {
    try {
      const created = await notesService.createNote({ created_by: createdBy });
      setData((prev) => [created, ...prev]);
      return created;
    } catch {
      toast.error("Não foi possível criar a nota");
      throw new Error("create_note_failed");
    }
  }

  async function editNote(id: string, changes: Partial<Note>) {
    setData((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...changes, updated_at: new Date().toISOString() } : n))
    );
    try {
      await notesService.updateNote(id, changes);
    } catch {
      toast.error("Não foi possível salvar a nota");
    }
  }

  async function removeNote(id: string) {
    const prev = data;
    setData((current) => current.filter((n) => n.id !== id));
    try {
      await notesService.deleteNote(id);
      toast.success("Nota removida");
    } catch {
      setData(prev);
      toast.error("Não foi possível remover a nota");
    }
  }

  return { notes: data, loading, addNote, editNote, removeNote };
}
