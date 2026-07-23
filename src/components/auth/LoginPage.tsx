"use client";

import {
  Bell,
  DoorClosed,
  Droplets,
  Eye,
  EyeOff,
  Flame,
  LockKeyhole,
  Move,
  ShieldCheck,
  Thermometer,
  Utensils,
  UserRoundPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAuthSession } from "@/lib/auth/auth-storage";
import { AuthModeSwitch, type AuthMode } from "@/components/auth/AuthModeSwitch";
import { RegisterPanel } from "@/components/auth/RegisterPanel";
import { FloatingThemeSelector } from "@/components/theme/FloatingThemeSelector";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Input, Label } from "@/components/ui/Input";

const featureChips = [
  {
    label: "Temperatura",
    description: "Control termico de cocina",
    icon: Thermometer,
  },
  {
    label: "Humedad",
    description: "Ambiente supervisado",
    icon: Droplets,
  },
  {
    label: "Gas / Humo",
    description: "Prevencion de riesgos",
    icon: Flame,
  },
  {
    label: "Puerta",
    description: "Estado de accesos",
    icon: DoorClosed,
  },
  {
    label: "Movimiento",
    description: "Deteccion operativa",
    icon: Move,
  },
  {
    label: "Alarma",
    description: "Respuesta inmediata",
    icon: Bell,
  },
];

export function LoginPage() {
  const router = useRouter();
  const { login, loginStatus, loginError } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const session = getAuthSession();

    if (session?.accessToken) {
      router.replace("/");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await login({ username, password });
      window.location.href = "/";
    } catch {
      // React Query expone el error para renderizar feedback sin romper la UI.
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden px-4 pb-28 pt-8 text-white sm:pb-10 lg:px-8">
      <AnimatedBackground />
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-6xl items-center">
        <div className="grid w-full items-center justify-center gap-10 lg:grid-cols-[minmax(0,640px)_460px] xl:gap-16">
          <section className="animate-sg-fade-up w-full max-w-[40rem] justify-self-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 backdrop-blur">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgb(var(--sg-primary-rgb)/0.16)] text-[var(--sg-primary)]">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span className="font-medium">SmartGuard 360</span>
              <span className="hidden h-4 w-px bg-white/15 sm:block" />
              <span className="hidden text-xs text-slate-400 sm:block">
                Kitchen IoT Console
              </span>
            </div>

            <h1 className="mt-6 max-w-[39rem] text-4xl font-semibold leading-[1.04] tracking-normal text-white sm:text-5xl xl:text-[3.55rem]">
              Monitoreo IoT para cocinas inteligentes.
            </h1>

            <p className="mt-5 max-w-[36rem] text-base leading-7 text-slate-300">
              Supervisa temperatura, humedad, gas, accesos, alertas y actuadores
              de tu restaurante desde una consola segura en tiempo real.
            </p>

            <div className="mt-8 grid max-w-[42rem] grid-cols-2 gap-3 sm:grid-cols-3">
              {featureChips.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="animate-stagger-in rounded-lg border border-white/10 bg-white/8 p-4 text-sm text-slate-200 shadow-lg shadow-black/10 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[rgb(var(--sg-primary-rgb)/0.35)] hover:bg-white/12 hover:shadow-[var(--sg-glow)]"
                    style={{ animationDelay: `${index * 55}ms` }}
                  >
                    <Icon className="h-4 w-4 text-[var(--sg-primary)]" />
                    <p className="mt-3 font-semibold text-slate-100">{item.label}</p>
                    <p className="mt-1 min-h-9 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid max-w-[42rem] grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                "Backend activo",
                "JWT seguro",
                "Monitoreo 24/7",
                "ESP32 conectado",
              ].map((item, index) => (
                <div
                  key={item}
                  className="animate-stagger-in flex min-h-16 items-center rounded-lg border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300 backdrop-blur"
                  style={{ animationDelay: `${360 + index * 55}ms` }}
                >
                  <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-[var(--sg-primary)] shadow-[var(--sg-glow)]" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <Card className="relative animate-sg-fade-up overflow-hidden rounded-xl border-[rgb(var(--sg-primary-rgb)/0.24)] bg-slate-950/42 p-0 shadow-[0_28px_90px_rgb(0_0_0/0.38),0_0_70px_rgb(var(--sg-primary-rgb)/0.08)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--sg-primary-rgb)/0.72)] to-transparent" />
            <div className="border-b border-white/10 bg-white/[0.025] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--sg-primary)] text-slate-950 shadow-[var(--sg-glow)] ring-1 ring-white/25">
                    {mode === "login" ? (
                      <LockKeyhole className="h-5 w-5" />
                    ) : (
                      <UserRoundPlus className="h-5 w-5" />
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-slate-50">
                    {mode === "login" ? "Acceso seguro 360" : "Crear cuenta cliente"}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {mode === "login"
                      ? "Ingresa a la consola de monitoreo de tu cocina."
                      : "Solicitud visual preparada para cuentas de restaurante."}
                  </p>
                </div>
                <div className="shrink-0 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100 shadow-[0_0_22px_rgb(52_211_153/0.12)]">
                  API ready
                </div>
              </div>
              <div className="mt-6">
                <AuthModeSwitch mode={mode} onModeChange={setMode} />
              </div>
            </div>

            <div className="p-6">
              {mode === "login" ? (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="username">Usuario</Label>
                    <Input
                      id="username"
                      autoComplete="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="h-11 bg-slate-950/70 px-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Contrasena</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
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

                  {loginError ? (
                    <div className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                      Credenciales invalidas o backend no disponible.
                    </div>
                  ) : null}

                  <Button
                    className="h-11 w-full shadow-[0_0_34px_rgb(var(--sg-primary-rgb)/0.22)]"
                    type="submit"
                    isLoading={loginStatus === "pending"}
                  >
                    <Utensils className="h-4 w-4" />
                    Entrar a SmartGuard 360
                  </Button>
                </form>
              ) : (
                <RegisterPanel onBackToLogin={() => setMode("login")} />
              )}
            </div>
          </Card>
        </div>
      </div>
      <FloatingThemeSelector />
    </main>
  );
}
