import type { SensorReadingResponse, SensorResponse } from "@/lib/api/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils/format-date";

export function SensorReadingsChart({
  sensor,
  readings,
}: {
  sensor?: SensorResponse;
  readings: SensorReadingResponse[];
}) {
  const numericReadings = readings
    .filter((reading) => reading.numericValue !== null)
    .slice(-24);

  if (!sensor || !numericReadings.length) {
    return (
      <EmptyState
        title="Aun no hay datos suficientes para graficar"
        description="Cuando existan lecturas numericas recientes se mostrara la tendencia."
      />
    );
  }

  const width = 720;
  const height = 220;
  const padding = 28;
  const values = numericReadings.map((reading) => reading.numericValue ?? 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = numericReadings.map((reading, index) => {
    const x =
      padding +
      (index / Math.max(numericReadings.length - 1, 1)) * (width - padding * 2);
    const y =
      height -
      padding -
      (((reading.numericValue ?? 0) - min) / range) * (height - padding * 2);
    return { x, y, reading };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const last = numericReadings[numericReadings.length - 1];

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/35 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{sensor.name}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Ultimo valor:{" "}
            <span className="text-slate-200">
              {last.numericValue} {sensor.unit ?? ""}
            </span>
          </p>
        </div>
        <span className="text-xs text-slate-500">{formatDate(last.recordedAt)}</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-56 w-full overflow-visible"
        role="img"
        aria-label="Tendencia de lecturas recientes"
      >
        <path
          d={`M ${padding} ${height - padding} H ${width - padding}`}
          stroke="rgb(148 163 184 / 0.28)"
        />
        <path
          d={`M ${padding} ${padding} V ${height - padding}`}
          stroke="rgb(148 163 184 / 0.28)"
        />
        <polyline
          fill="none"
          stroke="var(--sg-primary)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          points={polyline}
        />
        {points.map((point) => (
          <circle
            key={point.reading.id}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="var(--sg-primary)"
            stroke="#020617"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>Min {min}</span>
        <span>Max {max}</span>
      </div>
    </div>
  );
}
