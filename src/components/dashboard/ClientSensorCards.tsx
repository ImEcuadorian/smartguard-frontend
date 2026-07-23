import type { SensorResponse } from "@/lib/api/types";
import { SensorSummaryPanel } from "./SensorSummaryPanel";

export function ClientSensorCards({
  sensors,
  refetchInterval,
}: {
  sensors: SensorResponse[];
  refetchInterval?: number;
}) {
  return (
    <SensorSummaryPanel
      sensors={sensors}
      limit={8}
      refetchInterval={refetchInterval}
    />
  );
}
