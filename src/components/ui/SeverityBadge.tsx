import { severityColorMap } from "@/lib/utils/status-colors";
import { getSeverityLabel } from "@/lib/utils/labels";
import { Badge } from "./Badge";

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <Badge
      className={`sg-status-badge ${
        severityColorMap[severity] ?? "border-white/10 bg-white/8 text-slate-300"
      }`}
    >
      {getSeverityLabel(severity)}
    </Badge>
  );
}
