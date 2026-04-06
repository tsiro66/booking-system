export interface ColorTheme {
  label: string;
  swatch: string;
  selectedDate: string;
  range: string;
  todayRing: string;
  button: string;
  buttonHover: string;
  buttonActive: string;
}

export const THEME_KEYS = [
  "zinc",
  "blue",
  "emerald",
  "rose",
  "amber",
  "violet",
] as const;

export type ThemeKey = (typeof THEME_KEYS)[number];

export const COLOR_THEMES: Record<ThemeKey, ColorTheme> = {
  zinc: {
    label: "Zinc",
    swatch: "bg-zinc-950",
    selectedDate: "bg-zinc-950 text-white",
    range: "bg-zinc-300",
    todayRing: "ring-zinc-950",
    button: "bg-zinc-950",
    buttonHover: "hover:bg-zinc-700",
    buttonActive: "active:bg-zinc-800",
  },
  blue: {
    label: "Blue",
    swatch: "bg-blue-600",
    selectedDate: "bg-blue-600 text-white",
    range: "bg-blue-100",
    todayRing: "ring-blue-600",
    button: "bg-blue-600",
    buttonHover: "hover:bg-blue-700",
    buttonActive: "active:bg-blue-500",
  },
  emerald: {
    label: "Emerald",
    swatch: "bg-emerald-600",
    selectedDate: "bg-emerald-600 text-white",
    range: "bg-emerald-100",
    todayRing: "ring-emerald-600",
    button: "bg-emerald-600",
    buttonHover: "hover:bg-emerald-700",
    buttonActive: "active:bg-emerald-500",
  },
  rose: {
    label: "Rose",
    swatch: "bg-rose-600",
    selectedDate: "bg-rose-600 text-white",
    range: "bg-rose-100",
    todayRing: "ring-rose-600",
    button: "bg-rose-600",
    buttonHover: "hover:bg-rose-700",
    buttonActive: "active:bg-rose-500",
  },
  amber: {
    label: "Amber",
    swatch: "bg-amber-500",
    selectedDate: "bg-amber-500 text-white",
    range: "bg-amber-100",
    todayRing: "ring-amber-500",
    button: "bg-amber-500",
    buttonHover: "hover:bg-amber-600",
    buttonActive: "active:bg-amber-400",
  },
  violet: {
    label: "Violet",
    swatch: "bg-violet-600",
    selectedDate: "bg-violet-600 text-white",
    range: "bg-violet-100",
    todayRing: "ring-violet-600",
    button: "bg-violet-600",
    buttonHover: "hover:bg-violet-700",
    buttonActive: "active:bg-violet-500",
  },
};
