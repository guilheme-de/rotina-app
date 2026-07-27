"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import type { Note } from "@/types/database.types";

export function NoteEditor({
  note,
  onChange,
  onDelete,
}: {
  note: Note;
  onChange: (changes: Partial<Note>) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saving, setSaving] = useState(false);
  const isFirstRender = useRef(true);

  const debouncedTitle = useDebounce(title, 600);
  const debouncedContent = useDebounce(content, 600);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSaving(true);
    onChange({ title: debouncedTitle, content: debouncedContent });
    const timeout = setTimeout(() => setSaving(false), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedContent]);

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 md:px-8">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {saving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> Salvando...
            </>
          ) : (
            <>
              <Check className="h-3 w-3" /> Salvo
            </>
          )}
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-danger hover:text-danger" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5 md:px-8">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sem título"
          className="h-auto border-none bg-transparent p-0 text-xl font-semibold shadow-none focus-visible:ring-0"
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comece a escrever..."
          className="min-h-[50vh] flex-1 resize-none border-none bg-transparent p-0 text-sm leading-relaxed shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
