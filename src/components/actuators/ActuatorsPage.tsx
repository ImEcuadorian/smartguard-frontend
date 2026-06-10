"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useActuators } from "@/hooks/useActuators";
import { useAuth } from "@/hooks/useAuth";
import type { ActuatorResponse } from "@/lib/api/types";
import { createRealtimeClient } from "@/lib/realtime/stomp-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActuatorCommandPanel } from "./ActuatorCommandPanel";
import { ActuatorTable } from "./ActuatorTable";

export function ActuatorsPage() {
  const queryClient = useQueryClient();
  const { role, session } = useAuth();
  const actuators = useActuators();
  const [selected, setSelected] = useState<ActuatorResponse | null>(null);

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
        description="Control manual de reles, cerraduras, buzzer, LED, servo y solenoid lock."
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
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Actuadores registrados</CardTitle>
            </CardHeader>
            <CardContent>
              <ActuatorTable
                actuators={actuators.data ?? []}
                selectedId={selected?.id}
                onSelect={setSelected}
              />
            </CardContent>
          </Card>
          <ActuatorCommandPanel actuator={selected} role={role} />
        </section>
      ) : null}
    </>
  );
}
