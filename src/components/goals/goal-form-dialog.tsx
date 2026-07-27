"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import type { Goal } from "@/types/database.types";

const goalSchema = z.object({
  title: z.string().min(1, "Informe um título").max(120),
  description: z.string().max(1000).optional(),
  deadline: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalSchema>;

export function GoalFormDialog({
  open,
  onOpenChange,
  goal,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
  onSubmit: (values: { title: string; description?: string; deadline: string | null }) => Promise<void> | void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: { title: "", description: "", deadline: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: goal?.title ?? "",
        description: goal?.description ?? "",
        deadline: goal?.deadline ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, goal]);

  async function submit(values: GoalFormValues) {
    await onSubmit({ ...values, deadline: values.deadline ? values.deadline : null });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{goal ? "Editar meta" : "Nova meta"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input id="title" autoFocus {...register("title")} />
            {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deadline">Prazo</Label>
            <Input id="deadline" type="date" {...register("deadline")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {goal ? "Salvar alterações" : "Criar meta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
