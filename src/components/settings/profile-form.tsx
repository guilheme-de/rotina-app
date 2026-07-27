"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateProfile, uploadAvatar } from "@/services/profiles.service";
import type { Profile } from "@/types/database.types";

export function ProfileForm({ profile, onUpdated }: { profile: Profile; onUpdated: (p: Profile) => void }) {
  const [name, setName] = useState(profile.name);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleSaveName() {
    setSaving(true);
    try {
      const updated = await updateProfile(profile.id, { name });
      onUpdated(updated);
      toast.success("Nome atualizado");
    } catch {
      toast.error("Não foi possível salvar o nome");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAvatar(profile.id, file);
      const updated = await updateProfile(profile.id, { avatar_url: url });
      onUpdated(updated);
      toast.success("Foto atualizada");
    } catch {
      toast.error("Não foi possível enviar a foto");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Seu nome e foto, visíveis para os dois membros do espaço.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border border-border">
              <AvatarImage src={profile.avatar_url ?? undefined} alt={name} />
              <AvatarFallback className="text-base">{initials}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="focus-ring absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-elevated"
            >
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
          </div>
        </div>

        <Button className="self-start" onClick={handleSaveName} disabled={saving || name === profile.name}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </CardContent>
    </Card>
  );
}
