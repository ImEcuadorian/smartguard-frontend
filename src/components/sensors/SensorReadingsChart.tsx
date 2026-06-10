import type { SensorReadingResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { EmptyState } from "@/components/ui/EmptyState";

export function SensorReadingsChart({
  readings,
}: {
  readings: SensorReadingResponse[];
}) {
  const numericReadings = readings.filter(
    (reading) => reading.numericValue !== null,
  );

  if (!numericReadings.length) {
    return (
      <EmptyState
        title="Sin datos numericos"
        description="Este sensor no tiene lecturas numericas para graficar."
      />
    );
  }

  const values = numericReadings.map((reading) => reading.numericValue ?? 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 640;
  const height = 220;
  const padding = 28;
  const points = numericReadings
    .map((reading, index) => {
      const x =
        padding +
        (index / Math.max(numericReadings.length - 1, 1)) * (width - padding * 2);
      const y =
        height -
        padding -
        (((reading.numericValue ?? 0) - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const last = numericReadings[numericReadings.length - 1];

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/35 p-4 backdrop-blur">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-medium text-slate-100">
          Ultimo valor: {last.numericValue}
        </span>
        <span className="text-slate-400">{formatDate(last.recordedAt)}</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-56 w-full overflow-visible"
        role="img"
        aria-label="Grafico historico de lecturas"
      >
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="rgb(148 163 184 / 0.34)"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="rgb(148 163 184 / 0.34)"
        />
        <polyline fill="none" stroke="var(--sg-primary)" strokeWidth="3" points={points} />
        {numericReadings.map((reading, index) => {
          const [x, y] = points.split(" ")[index].split(",");
          return (
            <circle
              key={reading.id}
              cx={x}
              cy={y}
              r="4"
              fill="var(--sg-primary)"
              stroke="#020617"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>Min {min}</span>
        <span>Max {max}</span>
      </div>
    </div>
  );
}
