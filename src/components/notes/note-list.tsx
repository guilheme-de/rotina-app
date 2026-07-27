"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Search, StickyNote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/database.types";

export function NoteList({
  notes,
  search,
  onSearchChange,
  selectedId,
  onSelect,
  onCreate,
}: {
  notes: Note[];
  search: string;
  onSearchChange: (v: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col border-border md:w-72 md:border-r">
      <div className="flex items-center gap-2 border-b border-border p-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar notas..."
            className="pl-8"
          />
        </div>
        <Button size="icon" onClick={onCreate}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {notes.length === 0 ? (
        <EmptyState icon={StickyNote} title="Nenhuma nota" description="Crie sua primeira nota." className="m-3" />
      ) : (
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-0.5 p-2">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => onSelect(note.id)}
                className={cn(
                  "focus-ring flex flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors",
                  selectedId === note.id ? "bg-surface-elevated" : "hover:bg-surface-elevated/60"
                )}
              >
                <span className="w-full truncate text-sm font-medium text-foreground">
                  {note.title || "Sem título"}
                </span>
                <span className="w-full truncate text-xs text-muted-foreground">
                  {note.content ? note.content.slice(0, 60) : "Nota vazia"}
                </span>
                <span className="text-[10px] text-muted-foreground/70">
                  {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: ptBR })}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
