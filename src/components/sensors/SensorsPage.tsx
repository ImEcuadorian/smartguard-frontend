"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDevices } from "@/hooks/useDevices";
import {
  useCreateSensor,
  useSensors,
  useUpdateSensorStatus,
} from "@/hooks/useSensors";
import type { SensorStatus, SensorType } from "@/lib/api/types";
import { canManage, canOperate } from "@/lib/auth/roles";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { SensorForm, type SensorFormValues } from "./SensorForm";
import { SensorTable } from "./SensorTable";

const sensorTypes: SensorType[] = [
  "TEMPERATURE",
  "HUMIDITY",
  "GAS",
  "MOTION",
  "DOOR",
  "LIGHT",
  "DISTANCE",
  "EMERGENCY_BUTTON",
];

export function SensorsPage() {
  const { role } = useAuth();
  const [deviceId, setDeviceId] = useState("");
  const [status, setStatus] = useState<SensorStatus | "">("");
  const [type, setType] = useState<SensorType | "">("");
  const [createOpen, setCreateOpen] = useState(false);
  const sensors = useSensors({
    deviceId: deviceId || undefined,
    status: status || undefined,
    type: type || undefined,
  });
  const devices = useDevices();
  const createSensor = useCreateSensor();
  const updateStatus = useUpdateSensorStatus();
  const canCreate = canManage(role);
  const canEditStatus = canOperate(role);

  async function handleCreate(values: SensorFormValues) {
    await createSensor.mutateAsync(values);
    setCreateOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Sensores"
        description="Sensores conectados a dispositivos ESP32, con filtros por dispositivo, estado y tipo."
        actions={
          canCreate ? (
            <Button type="button" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Nuevo sensor
            </Button>
          ) : null
        }
      />

      {sensors.isLoading ? <LoadingState label="Cargando sensores" /> : null}
      {sensors.isError ? (
        <ErrorState
          tone="warning"
          title="Sensores no disponibles"
          description="No se pudo cargar el modulo de sensores. La navegacion del sistema permanece disponible."
        />
      ) : null}

      {!sensors.isLoading && !sensors.isError ? (
        <>
          <Card className="mb-4">
            <CardContent className="grid gap-3 md:grid-cols-3">
              <Input
                placeholder="Filtrar por deviceId"
                value={deviceId}
                onChange={(event) => setDeviceId(event.target.value)}
              />
              <Select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as SensorStatus | "")
                }
              >
                <option value="">Todos los estados</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </Select>
              <Select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as SensorType | "")
                }
              >
                <option value="">Todos los tipos</option>
                {sensorTypes.map((sensorType) => (
                  <option key={sensorType} value={sensorType}>
                    {sensorType}
                  </option>
                ))}
              </Select>
            </CardContent>
          </Card>
          <SensorTable
            sensors={sensors.data ?? []}
            canEdit={canEditStatus}
            onStatusChange={(id, nextStatus) =>
              updateStatus.mutate({ id, status: nextStatus })
            }
          />
        </>
      ) : null}

      <Modal open={createOpen} title="Crear sensor" onClose={() => setCreateOpen(false)}>
        {devices.isError ? (
          <ErrorState
            tone="warning"
            title="Dispositivos no disponibles"
            description="No se pudo cargar la lista de dispositivos para crear el sensor. El listado de sensores sigue funcionando."
          />
        ) : devices.isLoading ? (
          <LoadingState label="Cargando dispositivos" />
        ) : (
          <SensorForm
            devices={devices.data ?? []}
            isSubmitting={createSensor.isPending}
            onSubmit={handleCreate}
          />
        )}
      </Modal>
    </>
  );
}
