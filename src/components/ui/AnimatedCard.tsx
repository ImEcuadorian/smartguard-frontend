import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Card } from "./Card";

export function AnimatedCard({
  children,
  className,
  critical,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  critical?: boolean;
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        critical ? "sg-critical-card" : null,
        className,
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
