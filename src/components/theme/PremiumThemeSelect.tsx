"use client";

import { Check, ChevronDown, Palette } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SMARTGUARD_THEMES, type ThemeId } from "@/lib/theme/themes";
import { cn } from "@/lib/utils/cn";

export function PremiumThemeSelect({
  compact = false,
  showLabel = true,
  placement = "down",
  className,
}: {
  compact?: boolean;
  showLabel?: boolean;
  placement?: "up" | "down";
  className?: string;
}) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedTheme = useMemo(
    () => SMARTGUARD_THEMES.find((item) => item.id === theme) ?? SMARTGUARD_THEMES[0],
    [theme],
  );

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    rootRef.current
      ?.querySelector("[role='option'][aria-selected='true']")
      ?.scrollIntoView({ block: "nearest" });
  }, [open, theme]);

  function chooseTheme(nextTheme: ThemeId) {
    setTheme(nextTheme);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={cn("relative", compact ? "w-44" : "w-full", className)}>
      {showLabel ? (
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/10 text-[var(--sg-primary)] shadow-[0_0_18px_rgb(var(--sg-primary-rgb)/0.16)]">
            <Palette className="h-3.5 w-3.5" />
          </span>
          Tema visual
        </div>
      ) : null}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label="Tema visual"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "group flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-950/70 px-3 text-left text-sm text-slate-100 shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_0_0_1px_rgb(var(--sg-primary-rgb)/0.04)] backdrop-blur-xl transition duration-300 ease-out hover:border-[rgb(var(--sg-primary-rgb)/0.36)] hover:bg-slate-950/82 hover:shadow-[0_0_30px_rgb(var(--sg-primary-rgb)/0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-primary)]",
          open ? "border-[rgb(var(--sg-primary-rgb)/0.48)] shadow-[0_0_34px_rgb(var(--sg-primary-rgb)/0.2)]" : null,
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white/15"
            style={{ backgroundColor: selectedTheme.color }}
          />
          <span className="min-w-0">
            <span className="block truncate font-medium">{selectedTheme.name}</span>
            {!compact ? (
              <span className="mt-0.5 block truncate text-xs text-slate-500">
                {selectedTheme.description}
              </span>
            ) : null}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition duration-300 group-hover:text-[var(--sg-primary)]",
            open ? "rotate-180 text-[var(--sg-primary)]" : null,
          )}
        />
      </button>

      {open ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Tema visual"
          className={cn(
            "sg-theme-scrollbar absolute left-0 z-[70] max-h-[280px] w-full min-w-[17rem] animate-sg-fade-up overflow-y-auto overscroll-contain rounded-lg border border-white/10 bg-slate-950/92 p-1.5 pr-2 shadow-2xl shadow-black/45 backdrop-blur-2xl",
            placement === "up"
              ? "bottom-full mb-2 origin-bottom"
              : "top-full mt-2 origin-top",
          )}
        >
          {SMARTGUARD_THEMES.map((item) => {
            const selected = item.id === selectedTheme.id;

            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => chooseTheme(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition duration-200",
                  selected
                    ? "bg-[rgb(var(--sg-primary-rgb)/0.16)] text-slate-50"
                    : "text-slate-300 hover:bg-white/8 hover:text-white",
                )}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white/15"
                  style={{ backgroundColor: item.color }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    {item.description}
                  </span>
                </span>
                {selected ? (
                  <Check className="h-4 w-4 shrink-0 text-[var(--sg-primary)]" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
