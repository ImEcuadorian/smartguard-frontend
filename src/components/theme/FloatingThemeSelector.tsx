"use client";

import { PremiumThemeSelect } from "./PremiumThemeSelect";

export function FloatingThemeSelector() {
  return (
    <div className="relative z-30 mx-auto mt-6 w-full max-w-xs animate-sg-fade-up rounded-xl border border-white/10 bg-slate-950/60 p-3 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:fixed sm:bottom-4 sm:right-4 sm:mt-0 sm:w-72">
      <PremiumThemeSelect placement="up" />
    </div>
  );
}
