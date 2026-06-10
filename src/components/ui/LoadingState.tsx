import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Cargando datos" }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/7 p-6 text-sm text-slate-300 backdrop-blur">
      <Loader2 className="mr-2 h-4 w-4 animate-spin text-[var(--sg-primary)]" />
      {label}
    </div>
  );
}
