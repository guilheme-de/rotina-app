"use client";

import { useMemo, useState } from "react";
import { StickyNote } from "lucide-react";
import { PageSpinner } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { NoteList } from "@/components/notes/note-list";
import { NoteEditor } from "@/components/notes/note-editor";
import { useNotes } from "@/hooks/use-notes";
import { useAuth } from "@/hooks/use-auth";

export default function NotesPage() {
  const { user } = useAuth();
  const { notes, loading, addNote, editNote, removeNote } = useNotes();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search) return notes;
    const q = search.toLowerCase();
    return notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }, [notes, search]);

  const effectiveSelectedId = selectedId ?? notes[0]?.id ?? null;
  const selectedNote = notes.find((n) => n.id === effectiveSelectedId) ?? null;

  async function handleCreate() {
    const created = await addNote(user?.id);
    setSelectedId(created.id);
  }

  function handleDelete(id: string) {
    removeNote(id);
    setSelectedId(null);
  }

  if (loading) return <PageSpinner />;

  return (
    <div className="-mx-4 -my-6 flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden rounded-none border-border md:-mx-8 md:-my-8 md:h-[calc(100vh-3.5rem)] md:flex-row md:rounded-xl md:border">
      <NoteList
        notes={filtered}
        search={search}
        onSearchChange={setSearch}
        selectedId={effectiveSelectedId}
        onSelect={setSelectedId}
        onCreate={handleCreate}
      />

      {selectedNote ? (
        <NoteEditor
          key={selectedNote.id}
          note={selectedNote}
          onChange={(changes) => editNote(selectedNote.id, changes)}
          onDelete={() => handleDelete(selectedNote.id)}
        />
      ) : (
        <div className="hidden flex-1 items-center justify-center md:flex">
          <EmptyState icon={StickyNote} title="Selecione uma nota" description="Ou crie uma nova para começar." />
        </div>
      )}
    </div>
  );
}
