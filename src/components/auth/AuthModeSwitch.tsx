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
    <div className="grid grid-cols-2 rounded-lg border border-white/10 bg-slate-950/55 p-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
      {[
        { id: "login", label: "Iniciar sesion" },
        { id: "register", label: "Crear cuenta" },
      ].map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onModeChange(item.id as AuthMode)}
          className={cn(
            "h-10 rounded-md text-sm font-medium transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-primary)]",
            mode === item.id
              ? "bg-[var(--sg-primary)] text-slate-950 shadow-[0_0_28px_rgb(var(--sg-primary-rgb)/0.22)]"
              : "text-slate-400 hover:bg-white/8 hover:text-slate-100",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
