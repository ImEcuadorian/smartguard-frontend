import type { SensorResponse } from "@/lib/api/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { SensorStatusCard } from "@/components/sensors/SensorStatusCard";

const priority = [
  "DOOR",
  "MOTION",
  "GAS",
  "EMERGENCY_BUTTON",
  "TEMPERATURE",
  "HUMIDITY",
  "LIGHT",
  "DISTANCE",
];

export function SensorSummaryPanel({
  sensors,
  limit = 8,
  refetchInterval,
}: {
  sensors: SensorResponse[];
  limit?: number;
  refetchInterval?: number;
}) {
  const sorted = [...sensors].sort(
    (a, b) => priority.indexOf(a.type) - priority.indexOf(b.type),
  );
  const visibleSensors = sorted.slice(0, limit);

  if (!visibleSensors.length) {
    return (
      <EmptyState
        title="Sin sensores disponibles"
        description="No hay sensores asociados para construir el resumen operativo."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {visibleSensors.map((sensor) => (
        <SensorStatusCard
          key={sensor.id}
          sensor={sensor}
          refetchInterval={refetchInterval}
        />
      ))}
    </div>
  );
}
