"use client";

import type { TimeRangeId } from "@/lib/utils/time-range";
import { TIME_RANGE_OPTIONS } from "@/lib/utils/time-range";
import { cn } from "@/lib/utils/cn";

export function TimeRangeFilter({
  value,
  onChange,
}: {
  value: TimeRangeId;
  onChange: (value: TimeRangeId) => void;
}) {
  return (
    <div
      className="inline-flex max-w-full gap-1 overflow-x-auto rounded-lg border border-white/10 bg-slate-950/45 p-1 backdrop-blur"
      aria-label="Filtro de tiempo"
    >
      {TIME_RANGE_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          title={option.description}
          onClick={() => onChange(option.id)}
          className={cn(
            "h-9 whitespace-nowrap rounded-md px-3 text-xs font-semibold transition duration-300",
            value === option.id
              ? "bg-[var(--sg-primary)] text-slate-950 shadow-[var(--sg-glow)]"
              : "text-slate-300 hover:bg-white/10 hover:text-white",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
