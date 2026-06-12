import { CheckCircle2, CircleDashed, TriangleAlert, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

export type ModuleHealthStatus = "online" | "loading" | "warning" | "offline";

export interface ModuleHealth {
  label: string;
  detail: string;
  status: ModuleHealthStatus;
}

const healthStyles: Record<ModuleHealthStatus, string> = {
  online: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
  loading: "border-sky-300/25 bg-sky-400/10 text-sky-100",
  warning: "border-amber-300/25 bg-amber-400/10 text-amber-100",
  offline: "border-red-300/25 bg-red-500/10 text-red-100",
};

const healthIcons = {
  online: CheckCircle2,
  loading: CircleDashed,
  warning: TriangleAlert,
  offline: WifiOff,
};

export function SystemHealthCard({ modules }: { modules: ModuleHealth[] }) {
  const onlineCount = modules.filter((module) => module.status === "online").length;
  const score = modules.length ? Math.round((onlineCount / modules.length) * 100) : 0;
  const headline = score >= 80 ? "Sistema estable" : score >= 50 ? "Sistema parcial" : "Atencion requerida";

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Estado general del sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-4xl font-semibold text-slate-50">{score}%</p>
            <p className="mt-1 text-sm text-slate-400">{headline}</p>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 md:max-w-xs">
            <div
              className="h-full rounded-full bg-[var(--sg-primary)] shadow-[var(--sg-glow)] transition-all duration-700"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {modules.map((module) => {
            const Icon = healthIcons[module.status];

            return (
              <div
                key={module.label}
                className={cn("rounded-lg border p-3", healthStyles[module.status])}
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Icon className="h-4 w-4" />
                  {module.label}
                </div>
                <p className="mt-1 text-xs leading-5 opacity-80">{module.detail}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
