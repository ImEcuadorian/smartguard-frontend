import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export function ContactInfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <Card className="animate-stagger-in h-full">
      <CardContent className="h-full">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgb(var(--sg-primary-rgb)/0.24)] bg-[rgb(var(--sg-primary-rgb)/0.12)] text-[var(--sg-primary)]">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {label}
            </p>
            <p className="mt-2 break-words text-sm font-medium text-slate-100">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
