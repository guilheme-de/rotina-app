"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { NAV_ITEMS, SETTINGS_ITEM } from "./nav-items";

function pageTitle(pathname: string) {
  const item = [...NAV_ITEMS, SETTINGS_ITEM].find((i) => pathname.startsWith(i.href));
  return item?.label ?? "Rotina";
}

export function Topbar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const initials = (profile?.name ?? "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      <h1 className="text-sm font-semibold tracking-tight text-foreground">{pageTitle(pathname ?? "")}</h1>

      <DropdownMenu>
        <DropdownMenuTrigger className="focus-ring rounded-full">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.name ?? "Usuário"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{profile?.name ?? "Usuário"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4" /> Configurações
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()} className="text-danger focus:text-danger">
            <LogOut className="h-4 w-4" /> Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
