import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--sg-primary)] text-slate-950 shadow-[0_0_28px_rgb(var(--sg-primary-rgb)/0.24)] hover:brightness-110 focus-visible:outline-[var(--sg-primary)]",
  secondary:
    "border border-white/10 bg-white/10 text-slate-100 hover:border-white/20 hover:bg-white/15 focus-visible:outline-[var(--sg-primary)]",
  ghost:
    "text-slate-300 hover:bg-white/10 hover:text-white focus-visible:outline-[var(--sg-primary)]",
  danger:
    "bg-red-500 text-white shadow-[0_0_28px_rgb(239_68_68/0.2)] hover:bg-red-400 focus-visible:outline-red-400",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 gap-2 px-3 text-sm",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-11 gap-2 px-5 text-base",
  icon: "h-10 w-10",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md font-medium transition duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
