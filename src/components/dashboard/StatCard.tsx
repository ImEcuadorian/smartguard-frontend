import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export function StatCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = "teal",
}: {
  title: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
  tone?: "teal" | "red" | "amber" | "slate";
}) {
  const tones = {
    teal: "bg-[rgb(var(--sg-primary-rgb)/0.18)] text-[var(--sg-primary)]",
    red: "bg-red-500/15 text-red-200",
    amber: "bg-amber-400/15 text-amber-200",
    slate: "bg-white/10 text-slate-200",
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-50">{value}</p>
          {detail ? <p className="mt-1 text-xs text-slate-400">{detail}</p> : null}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
