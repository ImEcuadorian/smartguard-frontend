import { Inbox } from "lucide-react";

export function EmptyState({
  title = "Sin registros",
  description = "Todavia no hay datos para mostrar.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="animate-sg-fade-up rounded-lg border border-dashed border-white/15 bg-white/7 p-10 text-center backdrop-blur">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-[rgb(var(--sg-primary-rgb)/0.28)] bg-[rgb(var(--sg-primary-rgb)/0.12)] text-[var(--sg-primary)] shadow-[var(--sg-glow)]">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-100">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}
