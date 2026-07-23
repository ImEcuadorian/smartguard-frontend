"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useActuators } from "@/hooks/useActuators";
import { useAlerts } from "@/hooks/useAlerts";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateDevice,
  useDevices,
  useUpdateDeviceStatus,
} from "@/hooks/useDevices";
import { useSensors } from "@/hooks/useSensors";
import type { DeviceStatus } from "@/lib/api/types";
import { canManage } from "@/lib/auth/roles";
import { getStatusLabel } from "@/lib/utils/labels";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DeviceStatsPanel } from "@/components/dashboard/DeviceStatsPanel";
import { DeviceApiKeyModal } from "./DeviceApiKeyModal";
import { DeviceForm, type DeviceFormValues } from "./DeviceForm";
import { DeviceTable } from "./DeviceTable";

export function DevicesPage() {
  const { role } = useAuth();
  const [status, setStatus] = useState<DeviceStatus | "">("");
  const [createOpen, setCreateOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const devices = useDevices(status ? { status } : undefined);
  const sensors = useSensors();
  const actuators = useActuators();
  const alerts = useAlerts();
  const createDevice = useCreateDevice();
  const updateStatus = useUpdateDeviceStatus();
  const canEdit = canManage(role);
  const devicesData = devices.data ?? [];

  async function handleCreate(values: DeviceFormValues) {
    const registration = await createDevice.mutateAsync(values);
    setCreateOpen(false);
    setApiKey(registration.apiKey);
  }

  return (
    <>
      <PageHeader
        title="Dispositivos"
        description="Inventario ESP32 de SmartGuard 360 con sensores, actuadores, alertas y salud por dispositivo."
        actions={
          canEdit ? (
            <Button type="button" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Nuevo dispositivo
            </Button>
          ) : null
        }
      />

      {devices.isLoading ? <LoadingState label="Cargando dispositivos" /> : null}
      {devices.isError ? (
        <ErrorState
          tone="warning"
          title="Dispositivos no disponibles"
          description="No se pudo cargar el modulo de dispositivos. La navegacion del sistema permanece disponible."
        />
      ) : null}

      {!devices.isLoading && !devices.isError ? (
        <>
          <section className="mb-5">
            <SectionHeader
              title="Resumen por dispositivo"
              description="Relaciones reales por deviceId: sensores conectados, actuadores disponibles y alertas relacionadas."
            />
            <DeviceStatsPanel
              devices={devicesData}
              sensors={sensors.data ?? []}
              actuators={actuators.data ?? []}
              alerts={alerts.data ?? []}
              limit={9}
            />
          </section>

          <Card className="mb-4">
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:max-w-xs">
                <Select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as DeviceStatus | "")
                  }
                >
                  <option value="">Todos los estados</option>
                  <option value="ACTIVE">{getStatusLabel("ACTIVE")}</option>
                  <option value="INACTIVE">{getStatusLabel("INACTIVE")}</option>
                  <option value="MAINTENANCE">{getStatusLabel("MAINTENANCE")}</option>
                </Select>
              </div>
            </CardContent>
          </Card>
          <DeviceTable
            devices={devicesData}
            canEdit={canEdit}
            onStatusChange={(id, nextStatus) =>
              updateStatus.mutate({ id, status: nextStatus })
            }
          />
        </>
      ) : null}

      <Modal
        open={createOpen}
        title="Crear dispositivo"
        onClose={() => setCreateOpen(false)}
      >
        <DeviceForm
          isSubmitting={createDevice.isPending}
          onSubmit={handleCreate}
        />
      </Modal>
      <DeviceApiKeyModal
        apiKey={apiKey}
        open={Boolean(apiKey)}
        onClose={() => setApiKey(null)}
      />
    </>
  );
}
