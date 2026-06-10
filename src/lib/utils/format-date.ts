import type { ISODateTime } from "@/lib/api/types";

export function formatDate(value?: ISODateTime | null) {
  if (!value) return "Sin registro";

  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Guayaquil",
  }).format(new Date(value));
}
