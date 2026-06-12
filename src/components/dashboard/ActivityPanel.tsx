import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export function ActivityPanel({
  title,
  description,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
          ) : null}
        </div>
        {Icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-[var(--sg-primary)]">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
