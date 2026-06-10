"use client";

import { FormEvent, useState } from "react";
import type { DeviceResponse, SensorType } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

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

export interface SensorFormValues {
  deviceId: string;
  code: string;
  name: string;
  type: SensorType;
  unit?: string | null;
  location?: string | null;
}

export function SensorForm({
  devices,
  isSubmitting,
  onSubmit,
}: {
  devices: DeviceResponse[];
  isSubmitting?: boolean;
  onSubmit: (values: SensorFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<SensorFormValues>({
    deviceId: devices[0]?.id ?? "",
    code: "",
    name: "",
    type: "GAS",
    unit: "",
    location: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      ...values,
      code: values.code.trim(),
      name: values.name.trim(),
      unit: values.unit?.trim() || null,
      location: values.location?.trim() || null,
    });
  }

  function setField<K extends keyof SensorFormValues>(
    field: K,
    value: SensorFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      <div className="sm:col-span-2">
        <Label htmlFor="sensor-device">Dispositivo</Label>
        <Select
          id="sensor-device"
          value={values.deviceId}
          onChange={(event) => setField("deviceId", event.target.value)}
          required
        >
          <option value="" disabled>
            Selecciona un dispositivo
          </option>
          {devices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.name} - {device.code}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="sensor-code">Codigo</Label>
        <Input
          id="sensor-code"
          value={values.code}
          onChange={(event) => setField("code", event.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="sensor-name">Nombre</Label>
        <Input
          id="sensor-name"
          value={values.name}
          onChange={(event) => setField("name", event.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="sensor-type">Tipo</Label>
        <Select
          id="sensor-type"
          value={values.type}
          onChange={(event) => setField("type", event.target.value as SensorType)}
        >
          {sensorTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="sensor-unit">Unidad</Label>
        <Input
          id="sensor-unit"
          value={values.unit ?? ""}
          onChange={(event) => setField("unit", event.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="sensor-location">Ubicacion</Label>
        <Input
          id="sensor-location"
          value={values.location ?? ""}
          onChange={(event) => setField("location", event.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" isLoading={isSubmitting} disabled={!devices.length}>
          Crear sensor
        </Button>
      </div>
    </form>
  );
}
