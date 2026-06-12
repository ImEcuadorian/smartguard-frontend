import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export function DonutStat({
  title,
  value,
  total,
  label,
  icon: Icon,
  tone = "var(--sg-primary)",
}: {
  title: string;
  value: number;
  total: number;
  label: string;
  icon: LucideIcon;
  tone?: string;
}) {
  const safeTotal = Math.max(total, 0);
  const percent = safeTotal > 0 ? Math.min(100, Math.round((value / safeTotal) * 100)) : 0;
  const circumference = 2 * Math.PI * 42;
  const dash = (percent / 100) * circumference;

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgb(255 255 255 / 0.09)"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={tone}
              strokeLinecap="round"
              strokeWidth="10"
              strokeDasharray={`${dash} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-slate-50">{percent}%</span>
            <span className="text-[0.65rem] uppercase tracking-[0.16em] text-slate-500">
              activo
            </span>
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-slate-200">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-50">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-sm text-slate-300">
            <span className="font-semibold text-slate-50">{value}</span> de{" "}
            <span className="font-semibold text-slate-50">{total}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
