import type { ReactNode } from "react";

export function StatsOverview({ children }: { children: ReactNode }) {
  return <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{children}</section>;
}
