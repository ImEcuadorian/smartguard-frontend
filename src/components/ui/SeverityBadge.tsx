import { severityColorMap } from "@/lib/utils/status-colors";
import { Badge } from "./Badge";

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <Badge
      className={
        severityColorMap[severity] ?? "border-white/10 bg-white/8 text-slate-300"
      }
    >
      {severity}
    </Badge>
  );
}
