import type { TableHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function DataTable({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/35 shadow-inner shadow-black/20 backdrop-blur">
      <div className="overflow-x-auto">
        <table
          className={cn("min-w-full divide-y divide-white/10 text-sm", className)}
          {...props}
        />
      </div>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap bg-white/5 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-4 py-3.5 align-middle text-slate-300", className)}>
      {children}
    </td>
  );
}
