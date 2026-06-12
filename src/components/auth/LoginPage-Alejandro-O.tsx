"use client";

import {
  Activity,
  Cpu,
  LockKeyhole,
  RadioReceiver,
  ShieldCheck,
  Siren,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAuthSession } from "@/lib/auth/auth-storage";
import { FloatingThemeSelector } from "@/components/theme/FloatingThemeSelector";
import { AuthModeSwitch, type AuthMode } from "@/components/auth/AuthModeSwitch";
import { RegisterPanel } from "@/components/auth/RegisterPanel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Input, Label } from "@/components/ui/Input";

const featureChips = [
  { label: "ESP32", icon: Cpu },
  { label: "Sensors", icon: RadioReceiver },
  { label: "RFID", icon: LockKeyhole },
  { label: "Alerts", icon: Siren },
];

const securityMetrics = [
  { label: "IoT nodes", value: "24/7" },
  { label: "Auth", value: "JWT" },
  { label: "Realtime", value: "STOMP" },
];

export function LoginPage() {
  const router = useRouter();
  const { login, loginStatus, loginError } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    <main className="relative min-h-screen overflow-hidden px-4 py-10 pb-32 text-white sm:pb-10">
      <GradientBackground />
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center">
        <div className="grid w-full items-center gap-10 xl:grid-cols-[minmax(0,1fr)_500px]">
          <section className="animate-sg-fade-up mx-auto max-w-3xl xl:mx-0">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-slate-100 backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-[var(--sg-primary)]" />
              SmartGuard Security Console
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-white sm:text-6xl">
              Monitoreo inteligente para espacios seguros.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Opera dispositivos ESP32, sensores, RFID, actuadores y alertas en
              una consola visual de seguridad IoT conectada al backend real.
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {featureChips.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-white/8 p-3 text-sm text-slate-200 backdrop-blur"
                  >
                    <Icon className="mb-2 h-4 w-4 text-[var(--sg-primary)]" />
                    {item.label}
                  </div>
                );
              })}
            </div>

            <div className="sg-scan-panel mt-8 max-w-xl rounded-lg border border-white/10 bg-slate-950/45 p-4 backdrop-blur">
              <div className="grid gap-3 sm:grid-cols-3">
                {securityMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-md border border-white/10 bg-white/7 p-3"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-50">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-6 gap-2">
                {Array.from({ length: 18 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-2 rounded-full bg-[rgb(var(--sg-primary-rgb)/0.22)]"
                  />
                ))}
              </div>
            </div>
          </section>

          <Card className="animate-sg-fade-up mx-auto w-full max-w-[500px] p-6 shadow-2xl shadow-black/30 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--sg-primary)] text-slate-950 shadow-[var(--sg-glow)]">
                  <LockKeyhole className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-semibold text-slate-50">
                  {mode === "login" ? "Iniciar sesion" : "Crear cuenta cliente"}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {mode === "login"
                    ? "Usa tus credenciales del backend SmartGuard."
                    : "Formulario visual preparado para registro publico."}
                </p>
              </div>
              <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
                Backend URL
              </div>
            </div>

            <AuthModeSwitch mode={mode} onModeChange={setMode} />

            <div className="mt-5">
              {mode === "login" ? (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="username">Usuario</Label>
                    <Input
                      id="username"
                      autoComplete="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Contrasena</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>

                  {loginError ? (
                    <div className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                      Credenciales invalidas o backend no disponible.
                    </div>
                  ) : null}

                  <Button
                    className="w-full"
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
