import {
  LayoutDashboard,
  KanbanSquare,
  Flame,
  Target,
  CalendarDays,
  NotebookText,
  Wallet,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tarefas", icon: KanbanSquare },
  { href: "/habits", label: "Hábitos", icon: Flame },
  { href: "/goals", label: "Metas", icon: Target },
  { href: "/calendar", label: "Agenda", icon: CalendarDays },
  { href: "/notes", label: "Notas", icon: NotebookText },
  { href: "/finance", label: "Financeiro", icon: Wallet },
];

export const SETTINGS_ITEM: NavItem = { href: "/settings", label: "Configurações", icon: Settings };
