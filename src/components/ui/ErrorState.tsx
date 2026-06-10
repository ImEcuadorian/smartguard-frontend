import { AlertCircle } from "lucide-react";

export function ErrorState({
  title = "No se pudo cargar la informacion",
  description = "Revisa la conexion con el backend e intenta nuevamente.",
  tone = "danger",
}: {
  title?: string;
  description?: string;
  tone?: "danger" | "warning" | "info";
}) {
  const tones = {
    danger: "border-red-400/30 bg-red-500/10 text-red-100",
    warning: "border-amber-300/30 bg-amber-400/10 text-amber-100",
    info: "border-sky-300/30 bg-sky-400/10 text-sky-100",
  };

  return (
    <div className={`animate-sg-fade-up rounded-lg border p-5 backdrop-blur ${tones[tone]}`}>
      <div className="flex items-center gap-2 font-semibold">
        <AlertCircle className="h-4 w-4" />
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 opacity-85">{description}</p>
    </div>
  );
}
