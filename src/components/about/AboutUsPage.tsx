import {
  BellRing,
  CircuitBoard,
  Clock,
  Cpu,
  Gauge,
  Headphones,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Utensils,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactInfoCard } from "./ContactInfoCard";
import { LocationMapCard } from "./LocationMapCard";
import { TeamMemberCard } from "./TeamMemberCard";

const teamMembers = [
  {
    name: "Jairo Alejandro Ojeda Herrera",
    role: "Desarrollo Frontend y documentación",
    description:
      "Coordina la interfaz, la navegación y la documentación visual del panel.",
  },
  {
    name: "Hugo Mauricio Saldarriaga",
    role: "Integración Backend",
    description:
      "Apoya la conexión con servicios, autenticación y consumo seguro de datos.",
  },
  {
    name: "Josue Samuel Asifuela Vele",
    role: "Integración IoT",
    description:
      "Trabaja la lectura de sensores, dispositivos ESP32 y telemetría del prototipo.",
  },
  {
    name: "Juan David Figuero Miño",
    role: "Pruebas y validación",
    description:
      "Valida flujos críticos, estados de alerta y consistencia de la experiencia.",
  },
  {
    name: "Christian Humberto Carrion Lopez",
    role: "Diseño y experiencia de usuario",
    description:
      "Define composición visual, jerarquía de componentes y pulido de interacción.",
  },
];

const features = [
  {
    label: "Monitoreo 24/7",
    icon: Gauge,
  },
  {
    label: "Seguridad IoT",
    icon: ShieldCheck,
  },
  {
    label: "Control de cocina",
    icon: Utensils,
  },
  {
    label: "Alertas inteligentes",
    icon: BellRing,
  },
  {
    label: "ESP32",
    icon: Cpu,
  },
  {
    label: "Dashboard en tiempo real",
    icon: CircuitBoard,
  },
];

const contacts = [
  {
    label: "Correo principal",
    value: "contacto@smartguard360-demo.com",
    icon: Mail,
  },
  {
    label: "Soporte técnico",
    value: "soporte@smartguard360-demo.com",
    icon: Headphones,
  },
  {
    label: "Teléfono",
    value: "+593 99 123 4567",
    icon: Phone,
  },
  {
    label: "Teléfono secundario",
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
              <p className="mt-3 max-w-4xl text-sm font-medium leading-7 text-slate-300">
                Sistema IoT de monitoreo para restaurantes y cocinas
                inteligentes.
              </p>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
                SmartGuard 360 es una plataforma IoT diseñada para supervisar
                en tiempo real sensores, accesos RFID, alertas y actuadores en
                cocinas y restaurantes. Su objetivo es mejorar la seguridad
                operativa, prevenir riesgos y facilitar el control inteligente
                mediante dispositivos ESP32.
              </p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--sg-primary-rgb)/0.28)] bg-[rgb(var(--sg-primary-rgb)/0.14)] text-[var(--sg-primary)] shadow-[var(--sg-glow)]">
              <UsersRound className="h-7 w-7" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Metric label="Monitoreo" value="Tiempo real" />
            <Metric label="Hardware" value="ESP32" />
            <Metric label="Entorno" value="Cocinas" />
          </div>
        </CardContent>
      </Card>

      <section aria-labelledby="about-who-title">
        <Card className="overflow-hidden">
          <CardHeader className="bg-white/[0.025]">
            <CardTitle id="about-who-title">Quiénes somos</CardTitle>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-400">
              Somos un equipo académico enfocado en el desarrollo de soluciones
              IoT para seguridad, monitoreo y automatización de espacios
              gastronómicos. SmartGuard 360 combina sensores, actuadores y una
              consola web para facilitar el control de una cocina inteligente.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.label}
                  icon={feature.icon}
                  label={feature.label}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <SectionHeader
          title="Nuestro equipo"
          description="Integrantes del proyecto y responsabilidades académicas."
        />
        <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-5">
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.name}
              name={member.name}
              role={member.role}
              description={member.description}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Contacto"
          description="Datos ficticios preparados para presentación del proyecto."
        />
        <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-5">
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

function FeatureCard({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="animate-stagger-in flex min-h-20 items-center gap-3 rounded-lg border border-white/10 bg-slate-950/35 p-4 transition duration-300 hover:border-[rgb(var(--sg-primary-rgb)/0.35)] hover:bg-white/8 hover:shadow-[var(--sg-glow)]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgb(var(--sg-primary-rgb)/0.24)] bg-[rgb(var(--sg-primary-rgb)/0.12)] text-[var(--sg-primary)]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-semibold text-slate-100">{label}</span>
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
