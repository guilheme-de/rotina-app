"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import type { Habit } from "@/types/database.types";

const HABIT_COLORS = ["#e3a53d", "#8b85f0", "#4ade80", "#f0654f", "#60a5fa", "#f472b6"];

const habitSchema = z.object({
  name: z.string().min(1, "Informe um nome").max(80),
  description: z.string().max(300).optional(),
  color: z.string(),
});

type HabitFormValues = z.infer<typeof habitSchema>;

export function HabitFormDialog({
  open,
  onOpenChange,
  habit,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit | null;
  onSubmit: (values: { name: string; description?: string; color: string }) => Promise<void> | void;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: { name: "", description: "", color: HABIT_COLORS[0] },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: habit?.name ?? "",
        description: habit?.description ?? "",
        color: habit?.color ?? HABIT_COLORS[0],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, habit]);

  async function submit(values: HabitFormValues) {
    await onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{habit ? "Editar hábito" : "Novo hábito"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" autoFocus placeholder="Ex: Beber 2L de água" {...register("name")} />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" rows={2} {...register("description")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Cor</Label>
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <div className="flex gap-2">
                  {HABIT_COLORS.map((color) => (
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
              {habit ? "Salvar alterações" : "Criar hábito"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
