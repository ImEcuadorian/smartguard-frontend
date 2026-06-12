"use client";

import { CheckCircle2, Info, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export function RegisterPanel({ onBackToLogin }: { onBackToLogin: () => void }) {
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError(null);
    setMessage(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setMessage(
        "El registro publico aun no esta habilitado en el backend. Solicita una cuenta cliente al administrador.",
      );
    }, 450);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="rounded-lg border border-sky-300/25 bg-sky-400/10 p-3 text-sm leading-6 text-sky-100">
        <div className="flex items-center gap-2 font-semibold">
          <Info className="h-4 w-4" />
          Registro cliente preparado
        </div>
        <p className="mt-1 opacity-85">
          No se usaran endpoints protegidos desde esta pantalla sin una sesion activa.
        </p>
      </div>

      <div>
        <Label htmlFor="register-name">Nombre completo</Label>
        <Input
          id="register-name"
          autoComplete="name"
          value={form.displayName}
          onChange={(event) => updateField("displayName", event.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="register-username">Usuario</Label>
        <Input
          id="register-username"
          autoComplete="username"
          value={form.username}
          onChange={(event) => updateField("username", event.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="register-password">Contrasena</Label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="register-confirm">Confirmar</Label>
          <Input
            id="register-confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            required
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        </div>
      ) : null}

      <Button className="w-full" type="submit" isLoading={isSubmitting}>
        <UserPlus className="h-4 w-4" />
        Solicitar cuenta cliente
      </Button>
      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full text-center text-sm font-medium text-[var(--sg-primary)] transition hover:text-slate-100"
      >
        Ya tengo cuenta, volver al login
      </button>
    </form>
  );
}
