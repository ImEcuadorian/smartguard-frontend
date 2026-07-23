import type { LucideIcon } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "@/components/ui/Card";
import { AutoRefreshIndicator } from "./AutoRefreshIndicator";

export function ClientSecurityStatus({
  title,
  description,
  tone,
  icon: Icon,
  systemScore,
  updatedAt,
  isFetching,
  onRefresh,
}: {
  title: string;
  description: string;
  tone: string;
  icon: LucideIcon;
  systemScore: number;
  updatedAt: Date;
  isFetching?: boolean;
  onRefresh: () => void;
}) {
  const recommendation =
    systemScore >= 85
      ? "Todo esta funcionando correctamente."
      : systemScore >= 60
        ? "Hay sensores o dispositivos que requieren revision."
        : "Revisa alertas criticas antes de operar el sistema.";

  return (
    <Card className={cn("sg-glow-breathe overflow-hidden", tone)}>
      <CardContent className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-current/25 bg-current/10">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal opacity-75">
                Estado de mi seguridad
              </p>
              <h2 className="mt-1 text-3xl font-semibold">{title}</h2>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 opacity-85">
            {description}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-current/20 bg-current/10 px-3 py-1 text-xs font-semibold">
            <RefreshCw className="h-3.5 w-3.5" />
            {recommendation}
          </div>
        </div>
        <div className="space-y-4 lg:min-w-80 lg:text-right">
          <div>
            <p className="text-6xl font-semibold">{systemScore}%</p>
            <p className="mt-1 text-sm opacity-75">salud operativa</p>
          </div>
          <AutoRefreshIndicator
            updatedAt={updatedAt}
            intervalSeconds={30}
            isFetching={isFetching}
            onRefresh={onRefresh}
          />
        </div>
      </CardContent>
    </Card>
  );
}
