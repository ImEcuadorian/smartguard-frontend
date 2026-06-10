import { Inbox } from "lucide-react";

export function EmptyState({
  title = "Sin registros",
  description = "Todavia no hay datos para mostrar.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="animate-sg-fade-up rounded-lg border border-dashed border-white/15 bg-white/7 p-8 text-center backdrop-blur">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[var(--sg-primary)]">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}
