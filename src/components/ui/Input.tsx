import type { InputHTMLAttributes, LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-sm font-medium text-slate-300", className)}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-white/10 bg-slate-950/55 px-3 text-sm text-slate-100 outline-none transition duration-300 placeholder:text-slate-500 focus:border-[var(--sg-primary)] focus:ring-4 focus:ring-[rgb(var(--sg-primary-rgb)/0.16)]",
        className,
      )}
      {...props}
    />
  );
}
