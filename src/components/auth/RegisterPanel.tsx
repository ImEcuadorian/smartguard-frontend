"use client";

import { CheckCircle2, Eye, EyeOff, Info, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterPanel({ onBackToLogin }: { onBackToLogin: () => void }) {
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError(null);
    setMessage(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!emailPattern.test(form.email.trim())) {
      setError("Ingresa un correo electronico valido.");
      return;
    }

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
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="rounded-lg border border-sky-300/25 bg-sky-400/10 p-3 text-sm leading-6 text-sky-100 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
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
          className="h-11 bg-slate-950/70 px-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]"
          required
        />
      </div>
      <div>
        <Label htmlFor="register-email">Correo electronico</Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="cliente@correo.com"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="h-11 bg-slate-950/70 px-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="register-password">Contrasena</Label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              className="h-11 bg-slate-950/70 px-4 pr-12 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]"
              required
            />
            <button
              type="button"
              aria-label={
                showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
              }
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition duration-200 hover:bg-white/10 hover:text-[var(--sg-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-primary)]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <div>
          <Label htmlFor="register-confirm">Confirmar contrasena</Label>
          <div className="relative">
            <Input
              id="register-confirm"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(event) => updateField("confirmPassword", event.target.value)}
              className="h-11 bg-slate-950/70 px-4 pr-12 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]"
              required
            />
            <button
              type="button"
              aria-label={
                showConfirmPassword
                  ? "Ocultar confirmacion de contrasena"
                  : "Mostrar confirmacion de contrasena"
              }
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition duration-200 hover:bg-white/10 hover:text-[var(--sg-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-primary)]"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
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

      <Button
        className="h-11 w-full shadow-[0_0_34px_rgb(var(--sg-primary-rgb)/0.22)]"
        type="submit"
        isLoading={isSubmitting}
      >
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
