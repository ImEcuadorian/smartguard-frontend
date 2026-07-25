"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccessEvents, useAccessReaders } from "@/hooks/useAccessEvents";
import { useAuth } from "@/hooks/useAuth";
import { createRealtimeClient } from "@/lib/realtime/stomp-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { AccessEventsTable } from "./AccessEventsTable";
import { AccessReadersTable } from "./AccessReadersTable";
import { RfidCardsPanel } from "./RfidCardsPanel";

export function AccessPage() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const readers = useAccessReaders();
  const events = useAccessEvents({ limit: 30 });

  useEffect(() => {
    if (!session?.accessToken) return;

    return createRealtimeClient(session.accessToken, [
      {
        topic: "/topic/access/events",
        onMessage: () => {
          void queryClient.invalidateQueries({ queryKey: ["access", "events"] });
        },
      },
    ]);
  }, [queryClient, session?.accessToken]);

  if (readers.isLoading && events.isLoading) {
    return <LoadingState label="Cargando accesos RFID" />;
  }

  return (
    <>
      <PageHeader
        title="RFID / Accesos"
        description="Lectores RFID/NFC y eventos de tarjetas autorizadas o rechazadas."
      />
      <section className="grid gap-6">
        <RfidCardsPanel />
        <Card>
          <CardHeader>
            <CardTitle>Lectores</CardTitle>
          </CardHeader>
          <CardContent>
            {readers.isLoading ? (
              <LoadingState label="Cargando lectores" />
            ) : readers.isError ? (
              <ErrorState
                tone="info"
                title="Lectores RFID no disponibles"
                description="No se pudo consultar la lista de lectores RFID. Revisa la sesion y la conexion con el backend."
              />
            ) : (
              <AccessReadersTable readers={readers.data ?? []} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Eventos recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {events.isLoading ? (
              <LoadingState label="Cargando eventos" />
            ) : events.isError ? (
              <ErrorState
                tone="info"
                title="Eventos RFID no disponibles"
                description="No se pudieron consultar los eventos RFID. Revisa la sesion y la conexion con el backend."
              />
            ) : (
              <AccessEventsTable events={events.data ?? []} />
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
