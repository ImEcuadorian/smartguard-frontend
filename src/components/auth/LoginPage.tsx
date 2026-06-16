"use client";

import {
  Activity,
  Cpu,
  Eye,
  EyeOff,
  LockKeyhole,
  RadioReceiver,
  ShieldCheck,
  Siren,
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
  { label: "ESP32", icon: Cpu },
  { label: "Sensores", icon: RadioReceiver },
  { label: "RFID", icon: LockKeyhole },
  { label: "Alertas", icon: Siren },
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
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-7xl items-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_460px] xl:gap-14">
          <section className="animate-sg-fade-up max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-slate-100 backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-[var(--sg-primary)]" />
              SmartGuard Security Console
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-normal text-white sm:text-6xl">
              Monitoreo IoT para seguridad inteligente.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Controla dispositivos ESP32, sensores, accesos RFID, actuadores y
              alertas desde una consola conectada al backend real.
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {featureChips.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-white/8 p-3 text-sm text-slate-200 shadow-lg shadow-black/10 backdrop-blur transition duration-300 hover:border-[rgb(var(--sg-primary-rgb)/0.35)] hover:bg-white/12"
                  >
                    <Icon className="mb-2 h-4 w-4 text-[var(--sg-primary)]" />
                    {item.label}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {["Backend activo", "JWT seguro", "React Query"].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300 backdrop-blur"
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
                    {mode === "login" ? "Acceso seguro" : "Crear cuenta cliente"}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {mode === "login"
                      ? "Usa tus credenciales de SmartGuard."
                      : "Registro visual preparado sin usar endpoints protegidos."}
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
                    <Activity className="h-4 w-4" />
                    Entrar al dashboard
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
