import { Clock, Mail, MapPin, Phone, ShieldCheck, UsersRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const members = [
  "Jairo Alejandro Ojeda Herrera",
  "Hugo Mauricio Saldarriaga",
  "Josue Samuel Asifuela Vele",
  "Juan David Figuero Mino",
  "Christian Humberto Carrion Lopez",
];

const contacts = [
  {
    label: "Correo",
    value: "contacto@smartguard-demo.com",
    icon: Mail,
  },
  {
    label: "Telefono",
    value: "+593 99 123 4567",
    icon: Phone,
  },
  {
    label: "Soporte",
    value: "soporte@smartguard-demo.com",
    icon: ShieldCheck,
  },
  {
    label: "Horario",
    value: "Lunes a viernes, 08:00 - 17:00",
    icon: Clock,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AboutUsPanel() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-white/[0.025]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl">Acerca de SmartGuard</CardTitle>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              SmartGuard es una plataforma IoT de seguridad inteligente disenada
              para monitorear sensores, accesos, alertas y actuadores en tiempo
              real, facilitando el control de espacios mediante dispositivos ESP32.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[rgb(var(--sg-primary-rgb)/0.28)] bg-[rgb(var(--sg-primary-rgb)/0.14)] text-[var(--sg-primary)] shadow-[var(--sg-glow)]">
            <UsersRound className="h-6 w-6" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            Integrantes
          </h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {members.map((member) => (
              <article
                key={member}
                className="rounded-lg border border-white/10 bg-slate-950/35 p-3 transition duration-300 hover:-translate-y-0.5 hover:border-[rgb(var(--sg-primary-rgb)/0.28)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--sg-primary)] text-sm font-semibold text-slate-950">
                    {initials(member)}
                  </div>
                  <p className="text-sm font-medium leading-5 text-slate-100">{member}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-[1fr_1.25fr]">
          <div className="rounded-lg border border-white/10 bg-slate-950/35 p-4">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--sg-primary)]" />
              <div>
                <p className="text-sm font-semibold text-slate-100">Direccion</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Av. Tecnologica N45-120 y Calle Innovacion, Quito, Ecuador
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {contacts.map((contact) => {
              const Icon = contact.icon;

              return (
                <div
                  key={contact.label}
                  className="rounded-lg border border-white/10 bg-slate-950/35 p-4"
                >
                  <div className="flex gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--sg-primary)]" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-100">
                        {contact.label}
                      </p>
                      <p className="mt-1 truncate text-sm text-slate-400">
                        {contact.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
