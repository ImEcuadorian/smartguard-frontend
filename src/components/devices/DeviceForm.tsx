"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export interface DeviceFormValues {
  code: string;
  name: string;
  location?: string | null;
  ipAddress?: string | null;
  firmwareVersion?: string | null;
}

export function DeviceForm({
  isSubmitting,
  onSubmit,
}: {
  isSubmitting?: boolean;
  onSubmit: (values: DeviceFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<DeviceFormValues>({
    code: "",
    name: "",
    location: "",
    ipAddress: "",
    firmwareVersion: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      code: values.code.trim(),
      name: values.name.trim(),
      location: values.location?.trim() || null,
      ipAddress: values.ipAddress?.trim() || null,
      firmwareVersion: values.firmwareVersion?.trim() || null,
    });
  }

  function setField(field: keyof DeviceFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="device-code">Codigo</Label>
        <Input
          id="device-code"
          value={values.code}
          onChange={(event) => setField("code", event.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="device-name">Nombre</Label>
        <Input
          id="device-name"
          value={values.name}
          onChange={(event) => setField("name", event.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="device-location">Ubicacion</Label>
        <Input
          id="device-location"
          value={values.location ?? ""}
          onChange={(event) => setField("location", event.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="device-ip">IP</Label>
        <Input
          id="device-ip"
          value={values.ipAddress ?? ""}
          onChange={(event) => setField("ipAddress", event.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="device-firmware">Firmware</Label>
        <Input
          id="device-firmware"
          value={values.firmwareVersion ?? ""}
          onChange={(event) => setField("firmwareVersion", event.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" isLoading={isSubmitting}>
          Crear dispositivo
        </Button>
      </div>
    </form>
  );
}
