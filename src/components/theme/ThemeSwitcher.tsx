"use client";

import { cn } from "@/lib/utils/cn";
import { PremiumThemeSelect } from "./PremiumThemeSelect";

export function ThemeSwitcher({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <PremiumThemeSelect
      compact={compact}
      showLabel={!compact}
      className={cn(compact ? "w-44" : "w-full", className)}
    />
  );
}
