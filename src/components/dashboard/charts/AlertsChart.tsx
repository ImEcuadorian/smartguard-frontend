import { EmptyState } from "@/components/ui/EmptyState";

export function AlertsChart({
  critical,
  warning,
  info,
}: {
  critical: number;
  warning: number;
  info: number;
}) {
  const items = [
    { label: "Criticas", value: critical, bar: "bg-red-400" },
    { label: "Advertencias", value: warning, bar: "bg-amber-300" },
    { label: "Informativas", value: info, bar: "bg-sky-300" },
  ];
  const max = Math.max(...items.map((item) => item.value), 0);

  if (!max) {
    return (
      <EmptyState
        title="Sin alertas en el rango"
        description="No hay datos suficientes para graficar severidades."
      />
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-slate-950/35 p-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-300">{item.label}</span>
            <span className="font-semibold text-slate-50">{item.value}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div
              className={`h-full rounded-full ${item.bar}`}
              style={{ width: `${Math.max((item.value / max) * 100, 3)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
