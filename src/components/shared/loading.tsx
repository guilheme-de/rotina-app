import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageSpinner() {
  return (
    <div className="flex h-64 items-center justify-center text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-surface-elevated", className)} />;
}
