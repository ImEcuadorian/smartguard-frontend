import type { ReactNode } from "react";
import { ActivityPanel } from "./ActivityPanel";

export function RecentEventsPanel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <ActivityPanel title={title} description={description}>
      {children}
    </ActivityPanel>
  );
}
