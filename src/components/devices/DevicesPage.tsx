"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateDevice,
  useDevices,
  useUpdateDeviceStatus,
} from "@/hooks/useDevices";
import type { DeviceStatus } from "@/lib/api/types";
import { canManage } from "@/lib/auth/roles";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { DeviceApiKeyModal } from "./DeviceApiKeyModal";
import { DeviceForm, type DeviceFormValues } from "./DeviceForm";
import { DeviceTable } from "./DeviceTable";

export function DevicesPage() {
  const { role } = useAuth();
  const [status, setStatus] = useState<DeviceStatus | "">("");
  const [createOpen, setCreateOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const devices = useDevices(status ? { status } : undefined);
  const createDevice = useCreateDevice();
  const updateStatus = useUpdateDeviceStatus();
  const canEdit = canManage(role);

  async function handleCreate(values: DeviceFormValues) {
    const registration = await createDevice.mutateAsync(values);
    setCreateOpen(false);
    setApiKey(registration.apiKey);
  }

  return (
    <>
      <PageHeader
        title="Dispositivos"
        description="Registro y control de ESP32 conectados al sistema SmartGuard."
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
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </Select>
              </div>
            </CardContent>
          </Card>
          <DeviceTable
            devices={devices.data ?? []}
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
