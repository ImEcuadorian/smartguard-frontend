import type { AccessEventResponse } from "@/lib/api/types";
import { EmptyState } from "@/components/ui/EmptyState";

function getHourLabel(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    hour: "2-digit",
    timeZone: "America/Guayaquil",
  }).format(new Date(value));
}

export function RfidEventsChart({ events }: { events: AccessEventResponse[] }) {
  const buckets = events.reduce(
    (acc, event) => {
      const hour = getHourLabel(event.occurredAt);
      acc[hour] ??= { hour, granted: 0, denied: 0 };
      if (event.result === "GRANTED") acc[hour].granted += 1;
      if (event.result === "DENIED") acc[hour].denied += 1;
      return acc;
    },
    {} as Record<string, { hour: string; granted: number; denied: number }>,
  );
  const rows = Object.values(buckets).slice(-8);
  const max = Math.max(...rows.map((row) => row.granted + row.denied), 0);

  if (!rows.length) {
    return (
      <EmptyState
        title="Sin eventos RFID"
        description="Aun no hay eventos suficientes para graficar actividad."
      />
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/35 p-4">
      <div className="flex h-44 items-end gap-2">
        {rows.map((row) => {
          const total = row.granted + row.denied;
          const height = max ? Math.max((total / max) * 100, 8) : 0;

          return (
            <div key={row.hour} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-36 w-full items-end justify-center">
                <div
                  className="flex w-full max-w-10 flex-col overflow-hidden rounded-t-md bg-white/10"
                  style={{ height: `${height}%` }}
                >
                  <div
                    className="bg-red-400"
                    style={{ height: `${total ? (row.denied / total) * 100 : 0}%` }}
                  />
                  <div
                    className="bg-emerald-400"
                    style={{ height: `${total ? (row.granted / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <span className="text-[0.65rem] text-slate-500">{row.hour}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Concedidos
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          Denegados
        </span>
      </div>
    </div>
  );
}
