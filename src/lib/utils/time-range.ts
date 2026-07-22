export type TimeRangeId = "1h" | "today" | "24h" | "7d" | "30d";

export interface TimeRangeOption {
  id: TimeRangeId;
  label: string;
  description: string;
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  {
    id: "1h",
    label: "Ultima hora",
    description: "Actividad de los ultimos 60 minutos",
  },
  {
    id: "today",
    label: "Hoy",
    description: "Desde el inicio del dia",
  },
  {
    id: "24h",
    label: "Ultimas 24 horas",
    description: "Ventana movil de 24 horas",
  },
  {
    id: "7d",
    label: "Ultimos 7 dias",
    description: "Actividad semanal",
  },
  {
    id: "30d",
    label: "Ultimos 30 dias",
    description: "Tendencia mensual",
  },
];

export function getTimeRangeWindow(range: TimeRangeId, now = new Date()) {
  const to = new Date(now);
  const from = new Date(now);

  if (range === "today") {
    from.setHours(0, 0, 0, 0);
  } else if (range === "1h") {
    from.setHours(from.getHours() - 1);
  } else if (range === "24h") {
    from.setDate(from.getDate() - 1);
  } else if (range === "7d") {
    from.setDate(from.getDate() - 7);
  } else {
    from.setDate(from.getDate() - 30);
  }

  return {
    from,
    to,
    fromIso: from.toISOString(),
    toIso: to.toISOString(),
  };
}

export function isInsideRange(value: string | null | undefined, range: TimeRangeId) {
  if (!value) return false;

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return false;

  const { from, to } = getTimeRangeWindow(range);
  return timestamp >= from.getTime() && timestamp <= to.getTime();
}

export function filterByTimeRange<T>(
  items: T[],
  range: TimeRangeId,
  getTimestamp: (item: T) => string | null | undefined,
) {
  return items.filter((item) => isInsideRange(getTimestamp(item), range));
}

export function formatClock(value: Date) {
  return new Intl.DateTimeFormat("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "America/Guayaquil",
  }).format(value);
}

export function getRangeDescription(range: TimeRangeId) {
  return TIME_RANGE_OPTIONS.find((option) => option.id === range)?.description ?? "";
}
