"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    description?: string;
    onConfirm: () => void;
  }>({ open: false, title: "", onConfirm: () => {} });

  function confirm(options: { title: string; description?: string; onConfirm: () => void }) {
    setState({ open: true, ...options });
  }

  const dialog = (
    <Dialog open={state.open} onOpenChange={(open) => setState((s) => ({ ...s, open }))}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{state.title}</DialogTitle>
          {state.description && <DialogDescription>{state.description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setState((s) => ({ ...s, open: false }))}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              state.onConfirm();
              setState((s) => ({ ...s, open: false }));
            }}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { confirm, dialog };
}
