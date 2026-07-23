import { UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export function TeamMemberCard({
  name,
  role,
  description,
}: {
  name: string;
  role: string;
  description: string;
}) {
  return (
    <Card className="animate-stagger-in h-full overflow-hidden">
      <CardContent className="flex h-full min-h-48 flex-col">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--sg-primary)] text-sm font-semibold text-slate-950 shadow-[var(--sg-glow)]">
          {initials(name)}
        </div>
        <div className="mt-4 min-w-0">
          <h3 className="text-sm font-semibold leading-5 text-slate-50">{name}</h3>
          <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <UserRound className="h-3.5 w-3.5 text-[var(--sg-primary)]" />
            {role}
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-400">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
