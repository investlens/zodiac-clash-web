"use client";

import { useEffect, useState } from "react";
import {
  getTelegramInitData,
  initTelegramWebApp,
} from "../lib/telegram/client";

export type CurrentPlayer = {
  telegramId: string;
  name: string;
  zodiac: string;
  archetype: string;
  rarity: string;
  level: number;
  xp: number;
  xpToNext: number;
  stardust: number;
  streak: number;
  power: number;
  wins: number;
  losses: number;
  battles: number;
  winRate: number;
  seasonBadge: string;
  traits: Record<string, unknown>;
  traitPoints: Record<string, number>;
  shieldUses?: number;
  luckActive?: boolean;
  dailyCombo?: number;
  card_image_url?: string | null;
  card_image_status?: string | null;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForTelegramInitData() {
  for (let i = 0; i < 20; i++) {
    const rawInitData = getTelegramInitData();
    if (rawInitData) return rawInitData;
    await wait(150);
  }
  return "";
}

export function useCurrentPlayer() {
  const [player, setPlayer] = useState<CurrentPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    async function run() {
      try {
        initTelegramWebApp();

        const rawInitData = await waitForTelegramInitData();

        if (!rawInitData) {
          setIsTelegram(false);

          if (process.env.NODE_ENV !== "development") {
            setLoading(false);
            return;
          }

          const response = await fetch("/api/me", {
            method: "GET",
            cache: "no-store",
          });

          const json = await response.json();

          if (!response.ok) {
            throw new Error(json?.error || "Failed to load player");
          }

          setPlayer(json.player);
          setLoading(false);
          return;
        }

        setIsTelegram(true);

        const response = await fetch("/api/me", {
          method: "GET",
          headers: {
            Authorization: `tma ${rawInitData}`,
          },
          cache: "no-store",
        });

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json?.error || "Failed to load player");
        }

        setPlayer(json.player);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, []);

  return { player, loading, error, isTelegram };
}