import type { LucideIcon } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

type MetricTone = "primary" | "emerald" | "amber" | "red" | "sky" | "slate";

const tones: Record<MetricTone, string> = {
  primary: "bg-[rgb(var(--sg-primary-rgb)/0.18)] text-[var(--sg-primary)]",
  emerald: "bg-emerald-400/15 text-emerald-200",
  amber: "bg-amber-400/15 text-amber-200",
  red: "bg-red-500/15 text-red-200",
  sky: "bg-sky-400/15 text-sky-200",
  slate: "bg-white/10 text-slate-200",
};

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "primary",
  isLoading,
  hasError,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  tone?: MetricTone;
  isLoading?: boolean;
  hasError?: boolean;
}) {
  return (
    <Card className="min-h-36 overflow-hidden">
      <CardContent className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {title}
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-50">
              {isLoading ? "--" : value}
            </p>
          </div>
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-lg",
              hasError ? "bg-red-500/15 text-red-200" : tones[tone],
            )}
          >
            {hasError ? <AlertTriangle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-400">
          {hasError ? "Modulo no disponible" : description}
        </p>
      </CardContent>
    </Card>
  );
}
