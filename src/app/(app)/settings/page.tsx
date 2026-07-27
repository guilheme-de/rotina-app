"use client";

import { PageHeader } from "@/components/shared/page-header";
import { PageSpinner } from "@/components/shared/loading";
import { ProfileForm } from "@/components/settings/profile-form";
import { PreferencesForm } from "@/components/settings/preferences-form";
import { useAuth } from "@/hooks/use-auth";

export default function SettingsPage() {
  const { profile, setProfile, loading } = useAuth();

  if (loading || !profile) return <PageSpinner />;

  return (
    <div>
      <PageHeader title="Configurações" description="Ajustes do seu perfil e do espaço compartilhado" />

      <div className="flex max-w-xl flex-col gap-4">
        <ProfileForm profile={profile} onUpdated={setProfile} />
        <PreferencesForm profile={profile} onUpdated={setProfile} />
      </div>
    </div>
  );
}
