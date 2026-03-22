// hooks/use-leaderboard.ts
"use client";

import { useEffect, useState } from "react";

export type LeaderboardPlayer = {
  rank: number;
  telegramId: string;
  name: string;
  zodiac: string;
  archetype: string;
  rarity: string;
  level: number;
  wins: number;
  battles: number;
  streak: number;
  winRate: number;
  seasonBadge: string;
};

export function useLeaderboard() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      try {
        const response = await fetch("/api/leaderboard", {
          method: "GET",
          cache: "no-store",
        });

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json?.error || "Failed to load leaderboard");
        }

        setPlayers(json.leaderboard || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, []);

  return { players, loading, error };
}