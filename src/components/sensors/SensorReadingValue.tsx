import type { SensorDisplay } from "@/lib/utils/sensor-display";
import { cn } from "@/lib/utils/cn";

const toneClasses: Record<SensorDisplay["tone"], string> = {
  primary: "text-[var(--sg-primary)]",
  emerald: "text-emerald-200",
  amber: "text-amber-200",
  red: "text-red-200",
  sky: "text-sky-200",
  slate: "text-slate-200",
};

export function SensorReadingValue({ display }: { display: SensorDisplay }) {
  return (
    <div>
      <p className={cn("text-lg font-semibold", toneClasses[display.tone])}>
        {display.value}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{display.description}</p>
    </div>
  );
}
