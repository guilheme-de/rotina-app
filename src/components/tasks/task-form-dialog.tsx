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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRIORITY_LABEL, STATUS_LABEL, STATUS_ORDER } from "@/utils/tasks";
import type { Task, TaskPriority, TaskStatus } from "@/types/database.types";

const taskSchema = z.object({
  title: z.string().min(1, "Informe um título").max(120),
  description: z.string().max(2000).optional(),
  status: z.enum(["todo", "doing", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  due_date: z.string().optional(),
  tagsText: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
  defaultStatus,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultStatus?: TaskStatus;
  onSubmit: (values: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string | null;
    tags: string[];
  }) => Promise<void> | void;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: defaultStatus ?? "todo",
      priority: "medium",
      due_date: "",
      tagsText: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: task?.title ?? "",
        description: task?.description ?? "",
        status: task?.status ?? defaultStatus ?? "todo",
        priority: task?.priority ?? "medium",
        due_date: task?.due_date ?? "",
        tagsText: task?.tags?.join(", ") ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task]);

  async function submit(values: TaskFormValues) {
    await onSubmit({
      title: values.title,
      description: values.description,
      status: values.status,
      priority: values.priority,
      due_date: values.due_date ? values.due_date : null,
      tags: values.tagsText
        ? values.tagsText.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
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

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_ORDER.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Prioridade</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(PRIORITY_LABEL) as TaskPriority[]).map((p) => (
                        <SelectItem key={p} value={p}>
                          {PRIORITY_LABEL[p]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="due_date">Prazo</Label>
              <Input id="due_date" type="date" {...register("due_date")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tagsText">Etiquetas</Label>
              <Input id="tagsText" placeholder="casa, urgente" {...register("tagsText")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {task ? "Salvar alterações" : "Criar tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
