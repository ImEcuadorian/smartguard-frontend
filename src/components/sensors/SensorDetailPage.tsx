"use client";

import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateSensorRule,
  useDisableSensorRule,
  useLatestSensorReading,
  useSensor,
  useSensorReadings,
  useSensorRules,
} from "@/hooks/useSensors";
import type {
  AlertSeverity,
  AlertType,
  ComparisonOperator,
  SensorAlertRuleType,
} from "@/lib/api/types";
import { canManage } from "@/lib/auth/roles";
import { createRealtimeClient } from "@/lib/realtime/stomp-client";
import { formatDate } from "@/lib/utils/format-date";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input, Label } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SensorReadingsChart } from "./SensorReadingsChart";
import { SensorRulesTable } from "./SensorRulesTable";

const ruleTypes: SensorAlertRuleType[] = [
  "NUMERIC_THRESHOLD",
  "BOOLEAN_MATCH",
  "DURATION_OPEN",
  "NO_READING",
];
const operators: ComparisonOperator[] = [
  "GREATER_THAN",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN",
  "LESS_THAN_OR_EQUAL",
  "EQUAL",
];
const alertTypes: AlertType[] = [
  "GAS_DETECTED",
  "MOTION_DETECTED",
  "DOOR_OPEN",
  "EMERGENCY_BUTTON",
  "ACCESS_DENIED",
  "DEVICE_OFFLINE",
  "THRESHOLD_EXCEEDED",
];
const severities: AlertSeverity[] = ["INFO", "WARNING", "CRITICAL"];

export function SensorDetailPage({ sensorId }: { sensorId: string }) {
  const { role, session } = useAuth();
  const queryClient = useQueryClient();
  const sensor = useSensor(sensorId);
  const latest = useLatestSensorReading(sensorId);
  const readings = useSensorReadings(sensorId, { limit: 30 });
  const rules = useSensorRules(sensorId);
  const createRule = useCreateSensorRule(sensorId);
  const disableRule = useDisableSensorRule(sensorId);
  const [ruleOpen, setRuleOpen] = useState(false);
  const canEditRules = canManage(role);

  useEffect(() => {
    if (!session?.accessToken) return;

    return createRealtimeClient(session.accessToken, [
      {
        topic: `/topic/sensors/${sensorId}/readings`,
        onMessage: () => {
          void queryClient.invalidateQueries({
            queryKey: ["sensors", sensorId, "readings"],
          });
        },
      },
    ]);
  }, [queryClient, sensorId, session?.accessToken]);

  if (sensor.isLoading) return <LoadingState label="Cargando sensor" />;
  if (sensor.isError || !sensor.data) return <ErrorState />;

  return (
    <>
      <PageHeader
        title={sensor.data.name}
        description={`${sensor.data.type} - ${sensor.data.code}`}
        actions={
          <Link
            href="/sensors"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 text-sm font-medium text-slate-100 transition hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
        <Card>
          <CardHeader>
            <CardTitle>Informacion general</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Info label="Estado" value={<StatusBadge status={sensor.data.status} />} />
            <Info label="Dispositivo" value={sensor.data.deviceId} />
            <Info label="Unidad" value={sensor.data.unit ?? "N/A"} />
            <Info label="Ubicacion" value={sensor.data.location ?? "Sin ubicacion"} />
            <Info
              label="Ultima lectura"
              value={formatDate(sensor.data.lastReadingAt)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ultima lectura</CardTitle>
          </CardHeader>
          <CardContent>
            {latest.isLoading ? <LoadingState /> : null}
            {latest.data ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <ReadingMetric label="Numerico" value={latest.data.numericValue ?? "N/A"} />
                <ReadingMetric label="Booleano" value={String(latest.data.booleanValue ?? "N/A")} />
                <ReadingMetric label="Texto" value={latest.data.textValue ?? "N/A"} />
              </div>
            ) : (
              <p className="text-sm text-slate-400">Sin lectura reciente.</p>
            )}
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Grafico historico</CardTitle>
          </CardHeader>
          <CardContent>
            {readings.isLoading ? (
              <LoadingState />
            ) : (
              <SensorReadingsChart readings={readings.data ?? []} />
            )}
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Reglas de alerta</CardTitle>
            {canEditRules ? (
              <Button type="button" onClick={() => setRuleOpen(true)}>
                <Plus className="h-4 w-4" />
                Nueva regla
              </Button>
            ) : null}
          </CardHeader>
          <CardContent>
            {rules.isLoading ? <LoadingState /> : null}
            <SensorRulesTable
              rules={rules.data ?? []}
              canEdit={canEditRules}
              isDisabling={disableRule.isPending}
              onDisable={(id) => disableRule.mutate(id)}
            />
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Lecturas recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable>
              <thead>
                <tr>
                  <Th>Numerico</Th>
                  <Th>Booleano</Th>
                  <Th>Texto</Th>
                  <Th>Registrado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {(readings.data ?? []).slice(0, 10).map((reading) => (
                  <tr key={reading.id}>
                    <Td>{reading.numericValue ?? "N/A"}</Td>
                    <Td>{String(reading.booleanValue ?? "N/A")}</Td>
                    <Td>{reading.textValue ?? "N/A"}</Td>
                    <Td>{formatDate(reading.recordedAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </CardContent>
        </Card>
      </section>
      <Modal open={ruleOpen} title="Crear regla" onClose={() => setRuleOpen(false)}>
        <RuleForm
          isSubmitting={createRule.isPending}
          onSubmit={async (values) => {
            await createRule.mutateAsync(values);
            setRuleOpen(false);
          }}
        />
      </Modal>
    </>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-100">{value}</span>
    </div>
  );
}

function ReadingMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/8 p-4">
      <p className="text-xs font-medium uppercase tracking-normal text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-slate-50">{value}</p>
    </div>
  );
}

function RuleForm({
  isSubmitting,
  onSubmit,
}: {
  isSubmitting?: boolean;
  onSubmit: (values: {
    type: SensorAlertRuleType;
    operator?: ComparisonOperator | null;
    thresholdValue?: number | null;
    expectedBooleanValue?: boolean | null;
    durationMinutes?: number | null;
    alertType: AlertType;
    severity: AlertSeverity;
    message: string;
  }) => Promise<void>;
}) {
  const [type, setType] = useState<SensorAlertRuleType>("NUMERIC_THRESHOLD");
  const [operator, setOperator] = useState<ComparisonOperator>("GREATER_THAN");
  const [thresholdValue, setThresholdValue] = useState("");
  const [expectedBooleanValue, setExpectedBooleanValue] = useState("true");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [alertType, setAlertType] = useState<AlertType>("THRESHOLD_EXCEEDED");
  const [severity, setSeverity] = useState<AlertSeverity>("WARNING");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      type,
      operator: type === "NUMERIC_THRESHOLD" ? operator : null,
      thresholdValue:
        type === "NUMERIC_THRESHOLD" && thresholdValue
          ? Number(thresholdValue)
          : null,
      expectedBooleanValue:
        type === "BOOLEAN_MATCH" ? expectedBooleanValue === "true" : null,
      durationMinutes:
        type === "DURATION_OPEN" || type === "NO_READING"
          ? Number(durationMinutes || 0)
          : null,
      alertType,
      severity,
      message,
    });
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="rule-type">Tipo</Label>
        <Select
          id="rule-type"
          value={type}
          onChange={(event) => setType(event.target.value as SensorAlertRuleType)}
        >
          {ruleTypes.map((ruleType) => (
            <option key={ruleType} value={ruleType}>
              {ruleType}
            </option>
          ))}
        </Select>
      </div>
      {type === "NUMERIC_THRESHOLD" ? (
        <>
          <div>
            <Label htmlFor="rule-operator">Operador</Label>
            <Select
              id="rule-operator"
              value={operator}
              onChange={(event) => setOperator(event.target.value as ComparisonOperator)}
            >
              {operators.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="rule-threshold">Umbral</Label>
            <Input
              id="rule-threshold"
              type="number"
              value={thresholdValue}
              onChange={(event) => setThresholdValue(event.target.value)}
              required
            />
          </div>
        </>
      ) : null}
      {type === "BOOLEAN_MATCH" ? (
        <div>
          <Label htmlFor="rule-boolean">Valor esperado</Label>
          <Select
            id="rule-boolean"
            value={expectedBooleanValue}
            onChange={(event) => setExpectedBooleanValue(event.target.value)}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </Select>
        </div>
      ) : null}
      {(type === "DURATION_OPEN" || type === "NO_READING") ? (
        <div>
          <Label htmlFor="rule-duration">Minutos</Label>
          <Input
            id="rule-duration"
            type="number"
            min={1}
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            required
          />
        </div>
      ) : null}
      <div>
        <Label htmlFor="rule-alert">Tipo de alerta</Label>
        <Select
          id="rule-alert"
          value={alertType}
          onChange={(event) => setAlertType(event.target.value as AlertType)}
        >
          {alertTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="rule-severity">Severidad</Label>
        <Select
          id="rule-severity"
          value={severity}
          onChange={(event) => setSeverity(event.target.value as AlertSeverity)}
        >
          {severities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="rule-message">Mensaje</Label>
        <Input
          id="rule-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" isLoading={isSubmitting}>
          Crear regla
        </Button>
      </div>
    </form>
  );
}
