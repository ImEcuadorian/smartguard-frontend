"use client";

import { Palette } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { SMARTGUARD_THEMES, type ThemeId } from "@/lib/theme/themes";
import { cn } from "@/lib/utils/cn";
import { Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export function ThemeSwitcher({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/10 text-[var(--sg-primary)]">
        <Palette className="h-4 w-4" />
      </div>
      <div className={compact ? "w-44" : "w-full"}>
        {!compact ? <Label htmlFor="theme-switcher">Tema visual</Label> : null}
        <Select
          id="theme-switcher"
          value={theme}
          onChange={(event) => setTheme(event.target.value as ThemeId)}
          className="border-white/10 bg-slate-950/70 text-slate-100"
        >
          {SMARTGUARD_THEMES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
