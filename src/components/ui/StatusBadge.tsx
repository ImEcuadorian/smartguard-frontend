import { statusColorMap } from "@/lib/utils/status-colors";
import { Badge } from "./Badge";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={statusColorMap[status] ?? "border-white/10 bg-white/8 text-slate-300"}>
      {status}
    </Badge>
  );
}
