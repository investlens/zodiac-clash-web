// lib/share-card/zodiac-themes.ts
export type ZodiacTheme = {
  title: string;
  primary: string;
  secondary: string;
  accent: string;
  aura: string;
};

export const zodiacThemes: Record<string, ZodiacTheme> = {
  Aries: {
    title: "Flame Vanguard",
    primary: "#7f1d1d",
    secondary: "#ea580c",
    accent: "#fbbf24",
    aura: "Explosive fire aura",
  },
  Taurus: {
    title: "Iron Guardian",
    primary: "#14532d",
    secondary: "#4b5563",
    accent: "#d4af37",
    aura: "Grounded earth force",
  },
  Gemini: {
    title: "Twin Trickster",
    primary: "#0f766e",
    secondary: "#4338ca",
    accent: "#cbd5e1",
    aura: "Mirror illusion flow",
  },
  Cancer: {
    title: "Lunar Protector",
    primary: "#334155",
    secondary: "#1d4ed8",
    accent: "#e5e7eb",
    aura: "Moonlit tidal shield",
  },
  Leo: {
    title: "Solar King",
    primary: "#92400e",
    secondary: "#f59e0b",
    accent: "#fde68a",
    aura: "Radiant solar blaze",
  },
  Virgo: {
    title: "Rune Strategist",
    primary: "#166534",
    secondary: "#a16207",
    accent: "#ecfccb",
    aura: "Ordered rune glow",
  },
  Libra: {
    title: "Blade Arbiter",
    primary: "#4c1d95",
    secondary: "#475569",
    accent: "#ddd6fe",
    aura: "Balanced duelist energy",
  },
  Scorpio: {
    title: "Venom Assassin",
    primary: "#3f0d12",
    secondary: "#581c87",
    accent: "#fb7185",
    aura: "Dark venom surge",
  },
  Sagittarius: {
    title: "Star Hunter",
    primary: "#1d4ed8",
    secondary: "#4338ca",
    accent: "#fbbf24",
    aura: "Celestial arrow trail",
  },
  Capricorn: {
    title: "Mountain Warlord",
    primary: "#172554",
    secondary: "#475569",
    accent: "#7dd3fc",
    aura: "Frosted mountain power",
  },
  Aquarius: {
    title: "Storm Visionary",
    primary: "#1d4ed8",
    secondary: "#6d28d9",
    accent: "#67e8f9",
    aura: "Electric storm current",
  },
  Pisces: {
    title: "Abyss Mystic",
    primary: "#0f766e",
    secondary: "#1d4ed8",
    accent: "#c4b5fd",
    aura: "Astral ocean mist",
  },
};

export function getZodiacTheme(zodiac?: string): ZodiacTheme {
  return zodiacThemes[zodiac || ""] || {
    title: "Origin Fighter",
    primary: "#111827",
    secondary: "#1f2937",
    accent: "#22d3ee",
    aura: "Cosmic origin glow",
  };
}