import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Cargando datos" }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/7 p-6 text-sm text-slate-300 backdrop-blur">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/40 px-4 py-2">
        <Loader2 className="h-4 w-4 animate-spin text-[var(--sg-primary)]" />
        {label}
      </div>
    </div>
  );
}
