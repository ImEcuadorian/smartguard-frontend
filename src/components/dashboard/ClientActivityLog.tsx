import type { ActivityLogItem } from "@/lib/utils/activity-log";
import { ActivityLog } from "./ActivityLog";

export function ClientActivityLog({ items }: { items: ActivityLogItem[] }) {
  return <ActivityLog items={items} limit={10} />;
}
