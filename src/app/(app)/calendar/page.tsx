"use client";

import { useState } from "react";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageSpinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { MonthGrid } from "@/components/calendar/month-grid";
import { EventFormDialog } from "@/components/calendar/event-form-dialog";
import { useConfirmDialog } from "@/components/shared/confirm-dialog";
import { useEvents } from "@/hooks/use-events";
import { useAuth } from "@/hooks/use-auth";
import type { CalendarEvent } from "@/types/database.types";

export default function CalendarPage() {
  const { user } = useAuth();
  const { events, loading, addEvent, editEvent, removeEvent } = useEvents();
  const { confirm, dialog } = useConfirmDialog();

  const [month, setMonth] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [defaultDate, setDefaultDate] = useState<Date>(new Date());

  async function handleSubmit(values: {
    title: string;
    description?: string;
    start_time: string;
    all_day: boolean;
    color: string;
  }) {
    if (editingEvent) {
      await editEvent(editingEvent.id, values);
    } else {
      await addEvent({ ...values, created_by: user?.id });
    }
  }

  if (loading) return <PageSpinner />;

  return (
    <div>
      <PageHeader
        title="Agenda"
        description="Eventos e compromissos do casal"
        action={
          <Button
            onClick={() => {
              setEditingEvent(null);
              setDefaultDate(new Date());
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Novo evento
          </Button>
        }
      />

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium capitalize text-foreground">
          {format(month, "MMMM 'de' yyyy", { locale: ptBR })}
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={() => setMonth((m) => subMonths(m, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMonth(new Date())}>
            Hoje
          </Button>
          <Button variant="outline" size="icon" onClick={() => setMonth((m) => addMonths(m, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <MonthGrid
        month={month}
        events={events}
        onDayClick={(day) => {
          setEditingEvent(null);
          setDefaultDate(day);
          setDialogOpen(true);
        }}
        onEventClick={(event) => {
          setEditingEvent(event);
          setDialogOpen(true);
        }}
      />

      {editingEvent && (
        <div className="mt-3 flex justify-end">
          <Button
            variant="ghost"
            className="text-xs text-danger hover:text-danger"
            onClick={() =>
              confirm({
                title: "Excluir evento?",
                description: `"${editingEvent.title}" será removido.`,
                onConfirm: () => removeEvent(editingEvent.id),
              })
            }
          >
            Excluir evento selecionado
          </Button>
        </div>
      )}

      <EventFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={editingEvent}
        defaultDate={defaultDate}
        onSubmit={handleSubmit}
      />
      {dialog}
    </div>
  );
}
