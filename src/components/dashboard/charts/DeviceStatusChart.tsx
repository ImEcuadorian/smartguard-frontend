import { EmptyState } from "@/components/ui/EmptyState";

interface ChartItem {
  label: string;
  value: number;
  color: string;
}

export function DeviceStatusChart({
  title = "Distribucion por estado",
  items,
}: {
  title?: string;
  items: ChartItem[];
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (!total) {
    return (
      <EmptyState
        title="Sin datos para graficar"
        description="Aun no hay registros suficientes para construir esta distribucion."
      />
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/35 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <span className="text-xs text-slate-500">{total} registros</span>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-white/10">
        {items.map((item) => (
          <div
            key={item.label}
            title={`${item.label}: ${item.value}`}
            className={item.color}
            style={{ width: `${Math.max((item.value / total) * 100, item.value ? 4 : 0)}%` }}
          />
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-md border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              {item.label}
            </div>
            <p className="mt-2 text-xl font-semibold text-slate-50">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
