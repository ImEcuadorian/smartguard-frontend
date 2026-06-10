"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAcknowledgeAlert,
  useAlerts,
  useResolveAlert,
} from "@/hooks/useAlerts";
import { useAuth } from "@/hooks/useAuth";
import type { AlertSeverity, AlertStatus } from "@/lib/api/types";
import { canOperate } from "@/lib/auth/roles";
import { createRealtimeClient } from "@/lib/realtime/stomp-client";
import { Card, CardContent } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { AlertFilters } from "./AlertFilters";
import { AlertsTable } from "./AlertsTable";

export function AlertsPage() {
  const queryClient = useQueryClient();
  const { role, session } = useAuth();
  const [status, setStatus] = useState<AlertStatus | "">("");
  const [severity, setSeverity] = useState<AlertSeverity | "">("");
  const alerts = useAlerts({
    status: status || undefined,
    severity: severity || undefined,
  });
  const acknowledge = useAcknowledgeAlert();
  const resolve = useResolveAlert();

  useEffect(() => {
    if (!session?.accessToken) return;

    return createRealtimeClient(session.accessToken, [
      {
        topic: "/topic/alerts",
        onMessage: () => {
          void queryClient.invalidateQueries({ queryKey: ["alerts"] });
        },
      },
    ]);
  }, [queryClient, session?.accessToken]);

  return (
    <>
      <PageHeader
        title="Alertas"
        description="Alertas del sistema con filtros por estado y severidad."
      />

      {alerts.isLoading ? <LoadingState label="Cargando alertas" /> : null}
      {alerts.isError ? (
        <ErrorState
          tone="warning"
          title="Alertas no disponibles"
          description="No se pudo cargar el modulo de alertas. El resto del sistema sigue renderizando correctamente."
        />
      ) : null}

      {!alerts.isLoading && !alerts.isError ? (
        <>
          <Card className="mb-4">
            <CardContent>
              <AlertFilters
                status={status}
                severity={severity}
                onStatusChange={setStatus}
                onSeverityChange={setSeverity}
              />
            </CardContent>
          </Card>
          <AlertsTable
            alerts={alerts.data ?? []}
            canOperate={canOperate(role)}
            onAcknowledge={(id) => acknowledge.mutate(id)}
            onResolve={(id) => resolve.mutate(id)}
            isMutating={acknowledge.isPending || resolve.isPending}
          />
        </>
      ) : null}
    </>
  );
}
