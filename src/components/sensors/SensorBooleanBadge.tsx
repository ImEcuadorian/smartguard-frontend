import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

export function SensorBooleanBadge({
  active,
  activeLabel,
  inactiveLabel,
  activeTone = "red",
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  activeTone?: "red" | "amber";
}) {
  return (
    <Badge
      className={cn(
        active
          ? activeTone === "red"
            ? "border-red-300/30 bg-red-500/10 text-red-100"
            : "border-amber-300/30 bg-amber-400/10 text-amber-100"
          : "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
      )}
    >
      {active ? activeLabel : inactiveLabel}
    </Badge>
  );
}
