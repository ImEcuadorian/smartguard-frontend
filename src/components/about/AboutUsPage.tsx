import {
  Clock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactInfoCard } from "./ContactInfoCard";
import { LocationMapCard } from "./LocationMapCard";
import { TeamMemberCard } from "./TeamMemberCard";

const teamMembers = [
  {
    name: "Jairo Alejandro Ojeda Herrera",
    role: "Desarrollo Frontend",
  },
  {
    name: "Hugo Mauricio Saldarriaga",
    role: "Desarrollo Backend",
  },
  {
    name: "Josue Samuel Asifuela Vele",
    role: "Integracion IoT",
  },
  {
    name: "Juan David Figuero Miño",
    role: "Documentacion y pruebas",
  },
  {
    name: "Christian Humberto Carrion Lopez",
    role: "Diseño y experiencia de usuario",
  },
];

const contacts = [
  {
    label: "Correo principal",
    value: "contacto@smartguard360-demo.com",
    icon: Mail,
  },
  {
    label: "Soporte tecnico",
    value: "soporte@smartguard360-demo.com",
    icon: ShieldCheck,
  },
  {
    label: "Telefono",
    value: "+593 99 123 4567",
    icon: Phone,
  },
  {
    label: "Telefono secundario",
    value: "+593 98 765 4321",
    icon: Phone,
  },
  {
    label: "Horario",
    value: "Lunes a viernes, 08:00 - 17:00",
    icon: Clock,
  },
];

export function AboutUsPage() {
  return (
    <div className="space-y-6">
      <Card className="animate-card-float overflow-hidden">
        <CardHeader className="bg-white/[0.025]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--sg-primary-rgb)/0.28)] bg-[rgb(var(--sg-primary-rgb)/0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sg-primary)]">
                <Sparkles className="h-3.5 w-3.5" />
                Plataforma IoT
              </div>
              <CardTitle className="mt-4 text-2xl">
                Acerca de SmartGuard 360
              </CardTitle>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
                SmartGuard 360 es una plataforma IoT de monitoreo para
                restaurantes y cocinas, diseñada para supervisar sensores,
                accesos, alertas y actuadores en tiempo real mediante
                dispositivos ESP32. Su objetivo es ayudar a mejorar la
                seguridad operativa, prevenir riesgos y facilitar el control
                inteligente de espacios gastronomicos.
              </p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--sg-primary-rgb)/0.28)] bg-[rgb(var(--sg-primary-rgb)/0.14)] text-[var(--sg-primary)] shadow-[var(--sg-glow)]">
              <UsersRound className="h-7 w-7" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Metric label="Sensores" value="ESP32" />
            <Metric label="Enfoque" value="Cocinas" />
            <Metric label="Operacion" value="Tiempo real" />
          </div>
        </CardContent>
      </Card>

      <section>
        <SectionHeader
          title="Nuestro equipo"
          description="Integrantes del proyecto y responsabilidades academicas."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.name}
              name={member.name}
              role={member.role}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Contacto"
          description="Datos ficticios preparados para presentacion del proyecto."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {contacts.map((contact) => (
            <ContactInfoCard
              key={contact.label}
              icon={contact.icon}
              label={contact.label}
              value={contact.value}
            />
          ))}
        </div>
      </section>

      <LocationMapCard />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/35 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-50">{value}</p>
    </div>
  );
}
