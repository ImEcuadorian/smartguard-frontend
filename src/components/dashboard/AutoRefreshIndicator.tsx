"use client";

import { RefreshCw, Wifi } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatClock } from "@/lib/utils/time-range";
import { cn } from "@/lib/utils/cn";

export function AutoRefreshIndicator({
  updatedAt,
  intervalSeconds,
  isFetching,
  onRefresh,
}: {
  updatedAt: Date;
  intervalSeconds: number;
  isFetching?: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/7 px-3 text-xs text-slate-300 backdrop-blur">
        <Wifi className="h-4 w-4 text-[var(--sg-primary)]" />
        <span className="hidden sm:inline">Actualizacion automatica activa</span>
        <span className="text-slate-500">cada {intervalSeconds}s</span>
        <span className="text-slate-500">|</span>
        <span>Ultima: {formatClock(updatedAt)}</span>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={onRefresh}
        disabled={isFetching}
      >
        <RefreshCw className={cn("h-4 w-4", isFetching ? "animate-spin" : "")} />
        Actualizar ahora
      </Button>
    </div>
  );
}
