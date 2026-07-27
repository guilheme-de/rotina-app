"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CalendarEvent } from "@/types/database.types";

const EVENT_COLORS = ["#8b85f0", "#e3a53d", "#4ade80", "#f0654f", "#60a5fa"];

const eventSchema = z.object({
  title: z.string().min(1, "Informe um título").max(120),
  description: z.string().max(1000).optional(),
  date: z.string().min(1, "Informe uma data"),
  time: z.string().optional(),
  color: z.string(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export function EventFormDialog({
  open,
  onOpenChange,
  event,
  defaultDate,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CalendarEvent | null;
  defaultDate?: Date;
  onSubmit: (values: {
    title: string;
    description?: string;
    start_time: string;
    all_day: boolean;
    color: string;
  }) => Promise<void> | void;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: { title: "", description: "", date: "", time: "", color: EVENT_COLORS[0] },
  });

  useEffect(() => {
    if (open) {
      const base = event ? new Date(event.start_time) : defaultDate ?? new Date();
      reset({
        title: event?.title ?? "",
        description: event?.description ?? "",
        date: format(base, "yyyy-MM-dd"),
        time: event && !event.all_day ? format(base, "HH:mm") : "",
        color: event?.color ?? EVENT_COLORS[0],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, event, defaultDate]);

  async function submit(values: EventFormValues) {
    const allDay = !values.time;
    const start = new Date(`${values.date}T${values.time || "00:00"}`);
    await onSubmit({
      title: values.title,
      description: values.description,
      start_time: start.toISOString(),
      all_day: allDay,
      color: values.color,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Editar evento" : "Novo evento"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input id="title" autoFocus {...register("title")} />
            {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" rows={2} {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-danger">{errors.date.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="time">Horário (opcional)</Label>
              <Input id="time" type="time" {...register("time")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Cor</Label>
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <div className="flex gap-2">
                  {EVENT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => field.onChange(color)}
                      className="focus-ring h-7 w-7 rounded-full transition-transform"
                      style={{
                        backgroundColor: color,
                        outline: field.value === color ? `2px solid ${color}` : "none",
                        outlineOffset: 2,
                        transform: field.value === color ? "scale(1.1)" : "scale(1)",
                      }}
                    />
                  ))}
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {event ? "Salvar alterações" : "Criar evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
