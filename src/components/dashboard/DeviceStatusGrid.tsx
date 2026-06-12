import type { DeviceStatus, SensorStatus } from "@/lib/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type StatusKey = DeviceStatus | SensorStatus;

const statusLabels: Record<StatusKey, string> = {
  ACTIVE: "Activos",
  INACTIVE: "Inactivos",
  MAINTENANCE: "Mantenimiento",
};

export function DeviceStatusGrid({
  title,
  values,
}: {
  title: string;
  values: Record<StatusKey, number>;
}) {
  const total = Object.values(values).reduce((sum, count) => sum + count, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(Object.keys(statusLabels) as StatusKey[]).map((status) => {
          const count = values[status] ?? 0;
          const percent = total ? Math.round((count / total) * 100) : 0;

          return (
            <div key={status}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-300">{statusLabels[status]}</span>
                <span className="font-semibold text-slate-50">{count}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[var(--sg-primary)] shadow-[var(--sg-glow)] transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
