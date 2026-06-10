import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-md border border-white/10 bg-slate-950/55 px-3 text-sm text-slate-100 outline-none transition duration-300 focus:border-[var(--sg-primary)] focus:ring-4 focus:ring-[rgb(var(--sg-primary-rgb)/0.16)]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
