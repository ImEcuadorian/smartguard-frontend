"use client";

import { Palette } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { SMARTGUARD_THEMES, type ThemeId } from "@/lib/theme/themes";
import { Select } from "@/components/ui/Select";

export function FloatingThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-30 w-[calc(100%-2rem)] max-w-xs animate-sg-fade-up rounded-lg border border-white/10 bg-slate-950/60 p-3 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:w-64">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-300">
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/10 text-[var(--sg-primary)]">
          <Palette className="h-3.5 w-3.5" />
        </span>
        Tema visual
      </div>
      <Select
        aria-label="Tema visual"
        value={theme}
        onChange={(event) => setTheme(event.target.value as ThemeId)}
        className="h-9 bg-slate-950/75 text-sm"
      >
        {SMARTGUARD_THEMES.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
