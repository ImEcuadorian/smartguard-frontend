import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("animate-sg-fade-up", className)}>{children}</div>;
}
