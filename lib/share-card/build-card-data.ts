// lib/share-card/build-card-data.ts
import { getZodiacTheme } from "./zodiac-themes";

export type ShareCardPlayer = {
  name: string;
  zodiac: string;
  archetype: string;
  level: number;
  power: number;
  winRate: number;
  seasonBadge: string;
  portraitUrl?: string | null;
};

export function buildCardData(player: ShareCardPlayer) {
  const theme = getZodiacTheme(player.zodiac);

  return {
    ...player,
    theme,
    subtitle: `${getZodiacSymbol(player.zodiac)} ${player.zodiac} • ${theme.title}`,
    archetypeLine: player.archetype,
    portraitUrl: player.portraitUrl || null,
  };
}

function getZodiacSymbol(zodiac: string) {
  const symbols: Record<string, string> = {
    Aries: "♈",
    Taurus: "♉",
    Gemini: "♊",
    Cancer: "♋",
    Leo: "♌",
    Virgo: "♍",
    Libra: "♎",
    Scorpio: "♏",
    Sagittarius: "♐",
    Capricorn: "♑",
    Aquarius: "♒",
    Pisces: "♓",
  };

  return symbols[zodiac] || "✦";
}