export const statusColorMap: Record<string, string> = {
  ACTIVE: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  INACTIVE: "border-slate-300/20 bg-white/8 text-slate-300",
  MAINTENANCE: "border-amber-300/30 bg-amber-400/10 text-amber-100",
  OPEN: "border-red-300/30 bg-red-500/10 text-red-100",
  ACKNOWLEDGED: "border-amber-300/30 bg-amber-400/10 text-amber-100",
  RESOLVED: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  GRANTED: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  DENIED: "border-red-300/30 bg-red-500/10 text-red-100",
  PENDING: "border-amber-300/30 bg-amber-400/10 text-amber-100",
  SENT: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  FAILED: "border-red-300/30 bg-red-500/10 text-red-100",
  DISABLED: "border-slate-300/20 bg-white/8 text-slate-300",
};

export const severityColorMap: Record<string, string> = {
  INFO: "border-sky-300/30 bg-sky-400/10 text-sky-100",
  WARNING: "border-amber-300/30 bg-amber-400/10 text-amber-100",
  CRITICAL: "border-red-300/30 bg-red-500/10 text-red-100",
};
