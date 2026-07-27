"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function getGreeting(hour: number) {
  if (hour < 6) return "Boa madrugada";
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function GreetingHeader({ name }: { name: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza com o relógio real do sistema
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const firstName = name.split(" ")[0];

  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-sm text-muted-foreground">
          {now ? format(now, "EEEE, d 'de' MMMM", { locale: ptBR }) : "\u00A0"}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {getGreeting(now?.getHours() ?? 12)}, {firstName}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-xl border border-border bg-surface px-4 py-2.5 font-mono text-2xl font-medium tabular-nums text-foreground"
      >
        {now ? format(now, "HH:mm:ss") : "--:--:--"}
      </motion.div>
    </div>
  );
}
