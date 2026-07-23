import type { SensorResponse } from "@/lib/api/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { SensorStatusCard } from "@/components/sensors/SensorStatusCard";

export function DeviceSensorStats({
  sensors,
  refetchInterval,
}: {
  sensors: SensorResponse[];
  refetchInterval?: number;
}) {
  if (!sensors.length) {
    return (
      <EmptyState
        title="Sin sensores asociados"
        description="No hay datos relacionados disponibles para este dispositivo."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sensors.map((sensor) => (
        <SensorStatusCard
          key={sensor.id}
          sensor={sensor}
          refetchInterval={refetchInterval}
        />
      ))}
    </div>
  );
}
