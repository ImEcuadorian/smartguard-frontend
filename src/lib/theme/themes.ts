export type ThemeId =
  | "cyber-teal"
  | "neon-purple"
  | "ocean-blue"
  | "emerald-matrix"
  | "solar-amber";

export interface SmartGuardTheme {
  id: ThemeId;
  name: string;
  description: string;
  swatch: string;
}

export const THEME_STORAGE_KEY = "smartguard.theme";

export const SMARTGUARD_THEMES: SmartGuardTheme[] = [
  {
    id: "cyber-teal",
    name: "Cyber Teal",
    description: "Consola IoT clasica con acentos teal.",
    swatch: "bg-teal-400",
  },
  {
    id: "neon-purple",
    name: "Neon Purple",
    description: "Glow violeta para monitoreo nocturno.",
    swatch: "bg-purple-400",
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Azules frios para salas de control.",
    swatch: "bg-sky-400",
  },
  {
    id: "emerald-matrix",
    name: "Emerald Matrix",
    description: "Verde operativo de alta visibilidad.",
    swatch: "bg-emerald-400",
  },
  {
    id: "solar-amber",
    name: "Solar Amber",
    description: "Acento calido para prioridad visual.",
    swatch: "bg-amber-400",
  },
];

export const DEFAULT_THEME: ThemeId = "cyber-teal";

export function isThemeId(value: string | null): value is ThemeId {
  return SMARTGUARD_THEMES.some((theme) => theme.id === value);
}
