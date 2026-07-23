"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { useActuators } from "@/hooks/useActuators";
import { useAuth } from "@/hooks/useAuth";
import type { ActuatorResponse } from "@/lib/api/types";
import { createRealtimeClient } from "@/lib/realtime/stomp-client";
import { getActuatorTypeLabel } from "@/lib/utils/labels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActivityPanel } from "@/components/dashboard/ActivityPanel";
import { DeviceStatusChart } from "@/components/dashboard/charts/DeviceStatusChart";
import { QuickControlPanel } from "@/components/dashboard/QuickControlPanel";
import { ActuatorCommandPanel } from "./ActuatorCommandPanel";
import { ActuatorTable } from "./ActuatorTable";

export function ActuatorsPage() {
  const queryClient = useQueryClient();
  const { role, session } = useAuth();
  const actuators = useActuators();
  const [selected, setSelected] = useState<ActuatorResponse | null>(null);
  const actuatorsData = actuators.data ?? [];
  const typeCounts = actuatorsData.reduce(
    (acc, actuator) => {
      acc[actuator.type] = (acc[actuator.type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  useEffect(() => {
    if (!session?.accessToken || !selected?.id) return;

    return createRealtimeClient(session.accessToken, [
      {
        topic: `/topic/actuators/${selected.id}/commands`,
        onMessage: () => {
          void queryClient.invalidateQueries({
            queryKey: ["actuators", selected.id, "commands"],
          });
        },
      },
    ]);
  }, [queryClient, selected?.id, session?.accessToken]);

  return (
    <>
      <PageHeader
        title="Actuadores"
        description="Control real de buzzer, LED, rele, servo y cerraduras para operacion SmartGuard 360."
      />

      {actuators.isLoading ? (
        <LoadingState label="Cargando actuadores" />
      ) : null}
      {actuators.isError ? (
        <ErrorState
          tone="warning"
          title="Actuadores no disponibles"
          description="No se pudo cargar el modulo de actuadores. La consola permanece operativa para los demas modulos."
        />
      ) : null}

      {!actuators.isLoading && !actuators.isError ? (
        <div className="space-y-6">
          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <ActivityPanel
              title="Actuadores por tipo"
              description="Distribucion real de salidas fisicas registradas."
              icon={SlidersHorizontal}
            >
              <DeviceStatusChart
                title="Tipos de actuador"
                items={Object.entries(typeCounts).map(([label, value], index) => ({
                  label: getActuatorTypeLabel(label),
                  value,
                  color:
                    [
                      "bg-amber-400",
                      "bg-sky-400",
                      "bg-emerald-400",
                      "bg-red-400",
                      "bg-purple-400",
                    ][index % 5],
                }))}
              />
            </ActivityPanel>
            <ActivityPanel
              title="Control rapido"
              description="Acciones frecuentes con confirmacion en comandos criticos."
              icon={SlidersHorizontal}
            >
              <QuickControlPanel actuators={actuatorsData} />
            </ActivityPanel>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle>Actuadores registrados</CardTitle>
              </CardHeader>
              <CardContent>
                <ActuatorTable
                  actuators={actuatorsData}
                  selectedId={selected?.id}
                  onSelect={setSelected}
                />
              </CardContent>
            </Card>
            <ActuatorCommandPanel actuator={selected} role={role} />
          </section>
        </div>
      ) : null}
    </>
  );
}
