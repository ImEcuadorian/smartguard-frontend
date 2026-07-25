"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateRfidCard,
  useRfidCards,
} from "@/hooks/useAccessEvents";
import { canManage } from "@/lib/auth/roles";
import { formatDate } from "@/lib/utils/format-date";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input, Label } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function RfidCardsPanel() {
  const { role, isAuthenticated } = useAuth();
  const cards = useRfidCards(isAuthenticated);
  const createCard = useCreateRfidCard();
  const [form, setForm] = useState({ uid: "", ownerName: "" });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage(null);

    const uid = form.uid.trim();
    const ownerName = form.ownerName.trim();

    if (!uid || !ownerName) return;

    try {
      await createCard.mutateAsync({ uid, ownerName });
      setForm({ uid: "", ownerName: "" });
      setSuccessMessage(`Tarjeta ${uid} registrada correctamente.`);
    } catch {
      // La mutación conserva el error para mostrar la respuesta del backend.
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarjetas RFID</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {canManage(role) ? (
          <form
            className="grid gap-3 md:grid-cols-[minmax(180px,0.8fr)_minmax(240px,1.4fr)_auto]"
            onSubmit={handleSubmit}
          >
            <div>
              <Label htmlFor="rfid-card-uid">UID de la tarjeta</Label>
              <Input
                id="rfid-card-uid"
                className="mt-1 font-mono"
                placeholder="7A:2E:44:32"
                value={form.uid}
                onChange={(event) => {
                  setForm((current) => ({ ...current, uid: event.target.value }));
                  setSuccessMessage(null);
                  createCard.reset();
                }}
                autoComplete="off"
                required
              />
            </div>
            <div>
              <Label htmlFor="rfid-card-owner">Propietario</Label>
              <Input
                id="rfid-card-owner"
                className="mt-1"
                placeholder="Hugo / Admin / Usuario prueba"
                value={form.ownerName}
                onChange={(event) => {
                  setForm((current) => ({
                    ...current,
                    ownerName: event.target.value,
                  }));
                  setSuccessMessage(null);
                  createCard.reset();
                }}
                required
              />
            </div>
            <Button
              className="self-end"
              type="submit"
              isLoading={createCard.isPending}
            >
              Registrar tarjeta
            </Button>
          </form>
        ) : null}

        {canManage(role) ? (
          <p className="text-xs leading-5 text-slate-400">
            Escribe el UID exactamente como lo entrega el ESP32, respetando
            mayúsculas y separadores.
          </p>
        ) : null}

        {createCard.isError ? (
          <ErrorState
            title="No se pudo registrar la tarjeta"
            description={
              createCard.error instanceof Error
                ? createCard.error.message
                : "Revisa los datos e intenta nuevamente."
            }
          />
        ) : null}

        {successMessage ? (
          <div
            className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
            role="status"
          >
            {successMessage}
          </div>
        ) : null}

        {cards.isLoading ? <LoadingState label="Cargando tarjetas RFID" /> : null}
        {cards.isError ? (
          <ErrorState
            tone="warning"
            title="No se pudieron cargar las tarjetas"
            description={
              cards.error instanceof Error
                ? cards.error.message
                : "Revisa la conexión con el backend e intenta nuevamente."
            }
          />
        ) : null}
        {!cards.isLoading && !cards.isError && cards.data?.length ? (
          <DataTable>
            <thead>
              <tr>
                <Th>UID</Th>
                <Th>Propietario</Th>
                <Th>Estado</Th>
                <Th>Registrada</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {cards.data.map((card) => (
                <tr key={card.id}>
                  <Td className="font-mono text-xs text-slate-100">{card.uid}</Td>
                  <Td>{card.ownerName}</Td>
                  <Td>
                    <StatusBadge status={card.status} />
                  </Td>
                  <Td>{formatDate(card.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        ) : null}
        {!cards.isLoading && !cards.isError && !cards.data?.length ? (
          <EmptyState
            title="Sin tarjetas RFID"
            description={
              canManage(role)
                ? "Registra la primera tarjeta con el UID leído por el ESP32."
                : "Todavía no hay tarjetas RFID registradas."
            }
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
