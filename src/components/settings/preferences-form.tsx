"use client";

import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/services/profiles.service";
import type { Profile } from "@/types/database.types";

export function PreferencesForm({ profile, onUpdated }: { profile: Profile; onUpdated: (p: Profile) => void }) {
  async function handleNotificationsChange(checked: boolean) {
    try {
      const updated = await updateProfile(profile.id, { notifications_enabled: checked });
      onUpdated(updated);
    } catch {
      toast.error("Não foi possível salvar a preferência");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências</CardTitle>
        <CardDescription>Aparência e notificações do espaço.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
          <div>
            <Label className="text-foreground">Tema escuro</Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              O espaço foi desenhado para o tema escuro por padrão.
            </p>
          </div>
          <Switch checked disabled />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
          <div>
            <Label className="text-foreground">Notificações</Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Avisos de prazos de tarefas e metas próximas do vencimento.
            </p>
          </div>
          <Switch
            checked={profile.notifications_enabled}
            onCheckedChange={handleNotificationsChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
