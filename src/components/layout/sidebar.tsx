"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SETTINGS_ITEM } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-foreground">Rotina</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-sidebar-foreground/70 hover:bg-white/[0.03] hover:text-sidebar-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-surface-elevated"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href={SETTINGS_ITEM.href}
          className={cn(
            "focus-ring flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === SETTINGS_ITEM.href
              ? "bg-surface-elevated text-foreground"
              : "text-sidebar-foreground/70 hover:bg-white/[0.03] hover:text-sidebar-foreground"
          )}
        >
          <SETTINGS_ITEM.icon className="h-4 w-4" />
          {SETTINGS_ITEM.label}
        </Link>
      </div>
    </aside>
  );
}
