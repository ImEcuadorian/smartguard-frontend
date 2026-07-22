import {
  Activity,
  AlertTriangle,
  Fingerprint,
  RadioReceiver,
  SlidersHorizontal,
} from "lucide-react";
import type { ActivityLogItem } from "@/lib/utils/activity-log";
import { formatDate } from "@/lib/utils/format-date";
import { cn } from "@/lib/utils/cn";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";

const icons = {
  alert: AlertTriangle,
  access: Fingerprint,
  sensor: RadioReceiver,
  actuator: SlidersHorizontal,
};

const tones: Record<ActivityLogItem["tone"], string> = {
  primary: "border-[rgb(var(--sg-primary-rgb)/0.25)] bg-[rgb(var(--sg-primary-rgb)/0.12)] text-[var(--sg-primary)]",
  emerald: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
  amber: "border-amber-300/25 bg-amber-400/10 text-amber-100",
  red: "border-red-300/25 bg-red-500/10 text-red-100",
  sky: "border-sky-300/25 bg-sky-400/10 text-sky-100",
  slate: "border-white/10 bg-white/8 text-slate-200",
};

export function ActivityLog({ items, limit = 8 }: { items: ActivityLogItem[]; limit?: number }) {
  const visibleItems = items.slice(0, limit);

  if (!visibleItems.length) {
    return (
      <EmptyState
        title="Sin eventos recientes"
        description="La bitacora no tiene actividad para mostrar."
      />
    );
  }

  return (
    <div className="space-y-3">
      {visibleItems.map((item) => {
        const Icon = icons[item.type] ?? Activity;

        return (
          <article
            key={item.id}
            className="flex gap-3 rounded-lg border border-white/10 bg-slate-950/35 p-3"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                tones[item.tone],
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
                <StatusBadge status={item.result} />
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                {item.description}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {formatDate(item.occurredAt)}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
