"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(
        error.message.includes("Signups not allowed")
          ? "Este e-mail não está autorizado a acessar este espaço."
          : "Não foi possível enviar o link. Tente novamente."
      );
      return;
    }
    setStatus("sent");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(227,165,61,0.08), transparent 45%), radial-gradient(circle at 80% 75%, rgba(139,133,240,0.08), transparent 45%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-sm"
      >
        <Card className="border-border/80 bg-surface/90 p-8 backdrop-blur">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-elevated">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Espaço privado</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Acesso restrito a dois membros. Informe seu e-mail para receber o link de entrada.
            </p>
          </div>

          {status === "sent" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface-elevated px-4 py-6 text-center"
            >
              <Mail className="h-5 w-5 text-primary" />
              <p className="text-sm text-foreground">
                Enviamos um link de acesso para <span className="font-medium">{email}</span>.
              </p>
              <p className="text-xs text-muted-foreground">
                Abra o e-mail neste dispositivo para entrar automaticamente.
              </p>
              <Button variant="ghost" size="sm" onClick={() => setStatus("idle")}>
                Usar outro e-mail
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {status === "error" && (
                <p className="text-xs text-danger">{errorMessage}</p>
              )}

              <Button type="submit" disabled={status === "sending"} className="mt-1">
                {status === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Enviando link...
                  </>
                ) : (
                  "Enviar link de acesso"
                )}
              </Button>
            </form>
          )}
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Sem cadastro público — apenas os e-mails convidados têm acesso.
        </p>
      </motion.div>
    </main>
  );
}
