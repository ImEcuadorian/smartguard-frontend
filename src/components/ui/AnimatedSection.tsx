import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function AnimatedSection({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("animate-sg-fade-up transition duration-300 ease-out", className)}
      {...props}
    />
  );
}
