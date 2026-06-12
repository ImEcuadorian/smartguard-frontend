"use client";

import { cn } from "@/lib/utils/cn";

export type AuthMode = "login" | "register";

export function AuthModeSwitch({
  mode,
  onModeChange,
}: {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}) {
  return (
    <div className="grid grid-cols-2 rounded-lg border border-white/10 bg-slate-950/45 p-1">
      {[
        { id: "login", label: "Iniciar sesion" },
        { id: "register", label: "Crear cuenta" },
      ].map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onModeChange(item.id as AuthMode)}
          className={cn(
            "h-10 rounded-md text-sm font-medium transition duration-300",
            mode === item.id
              ? "bg-[var(--sg-primary)] text-slate-950 shadow-[var(--sg-glow)]"
              : "text-slate-400 hover:bg-white/8 hover:text-slate-100",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
