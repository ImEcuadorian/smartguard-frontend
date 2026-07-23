import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const address =
  "Av. Tecnológica N45-120 y Calle Innovación, Quito, Ecuador";

export function LocationMapCard() {
  return (
    <section aria-labelledby="about-location-title">
      <Card className="overflow-hidden">
        <CardHeader className="bg-white/[0.025]">
          <CardTitle id="about-location-title">
            Ubicación referencial
          </CardTitle>
          <p className="mt-1 text-sm text-slate-400">
            Ubicación referencial del proyecto SmartGuard 360.
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative min-h-[340px] overflow-hidden rounded-xl border border-white/10 bg-slate-950/70 shadow-inner shadow-black/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgb(var(--sg-primary-rgb)/0.18),transparent_34%),linear-gradient(135deg,rgb(255_255_255/0.05),transparent_42%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[length:46px_46px]" />

            <div className="absolute left-[-10%] top-[18%] h-3 w-[120%] rotate-[-8deg] rounded-full bg-white/10" />
            <div className="absolute left-[-8%] top-[58%] h-3 w-[118%] rotate-[6deg] rounded-full bg-white/10" />
            <div className="absolute left-[22%] top-[-12%] h-[130%] w-3 rotate-[16deg] rounded-full bg-white/10" />
            <div className="absolute left-[64%] top-[-8%] h-[125%] w-3 rotate-[-13deg] rounded-full bg-white/10" />
            <div className="absolute left-[8%] top-[35%] h-1.5 w-[88%] rotate-[18deg] rounded-full bg-[rgb(var(--sg-primary-rgb)/0.18)]" />
            <div className="absolute left-[14%] top-[72%] h-1.5 w-[78%] rotate-[-18deg] rounded-full bg-[rgb(var(--sg-accent-rgb)/0.16)]" />
            <div className="absolute left-[35%] top-[12%] h-1 w-[56%] rotate-[34deg] rounded-full bg-white/10" />

            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <span className="absolute h-20 w-20 rounded-full border border-[rgb(var(--sg-primary-rgb)/0.4)] bg-[rgb(var(--sg-primary-rgb)/0.14)] animate-map-pin-pulse" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sg-primary)] text-slate-950 shadow-[var(--sg-glow)]">
                <MapPin className="h-7 w-7" />
              </span>
              <div className="relative mt-4 max-w-xs rounded-lg border border-white/10 bg-slate-950/82 p-4 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
                <p className="text-sm font-semibold text-slate-50">
                  SmartGuard 360
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {address}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
