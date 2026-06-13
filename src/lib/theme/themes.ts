export type ThemeId =
  | "cyber-teal"
  | "neon-purple"
  | "ocean-blue"
  | "emerald-matrix"
  | "solar-amber"
  | "light-professional";

export interface SmartGuardTheme {
  id: ThemeId;
  name: string;
  description: string;
  swatch: string;
  color: string;
}

export const THEME_STORAGE_KEY = "smartguard.theme";

export const SMARTGUARD_THEMES: SmartGuardTheme[] = [
  {
    id: "cyber-teal",
    name: "Cyber Teal",
    description: "Consola IoT clasica con acentos teal.",
    swatch: "bg-teal-400",
    color: "#14b8a6",
  },
  {
    id: "neon-purple",
    name: "Neon Purple",
    description: "Glow violeta para monitoreo nocturno.",
    swatch: "bg-purple-400",
    color: "#a855f7",
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Azules frios para salas de control.",
    swatch: "bg-sky-400",
    color: "#0ea5e9",
  },
  {
    id: "emerald-matrix",
    name: "Emerald Matrix",
    description: "Verde operativo de alta visibilidad.",
    swatch: "bg-emerald-400",
    color: "#22c55e",
  },
  {
    id: "solar-amber",
    name: "Solar Amber",
    description: "Acento calido para prioridad visual.",
    swatch: "bg-amber-400",
    color: "#f59e0b",
  },
  {
    id: "light-professional",
    name: "Light Professional",
    description: "Paleta clara corporativa con superficies de alto contraste.",
    swatch: "bg-blue-300",
    color: "#93c5fd",
  },
];

export const DEFAULT_THEME: ThemeId = "cyber-teal";

export function isThemeId(value: string | null): value is ThemeId {
  return SMARTGUARD_THEMES.some((theme) => theme.id === value);
}
