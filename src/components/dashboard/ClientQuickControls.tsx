import type { ActuatorResponse } from "@/lib/api/types";
import { QuickControlPanel } from "./QuickControlPanel";

export function ClientQuickControls({
  actuators,
  isLoading,
  isError,
}: {
  actuators: ActuatorResponse[];
  isLoading?: boolean;
  isError?: boolean;
}) {
  return (
    <QuickControlPanel
      actuators={actuators}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
