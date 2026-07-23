import { statusColorMap } from "@/lib/utils/status-colors";
import { getStatusLabel } from "@/lib/utils/labels";
import { Badge } from "./Badge";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      className={`sg-status-badge ${
        statusColorMap[status] ?? "border-white/10 bg-white/8 text-slate-300"
      }`}
    >
      {getStatusLabel(status)}
    </Badge>
  );
}
