"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SETTINGS_ITEM } from "./nav-items";

const MOBILE_ITEMS = [...NAV_ITEMS.slice(0, 4), SETTINGS_ITEM];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-sidebar-border bg-sidebar/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      {MOBILE_ITEMS.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "focus-ring flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium",
              active ? "text-primary" : "text-sidebar-foreground/60"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
